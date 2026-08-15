import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';

@Injectable()
export class PurchaseInvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.purchaseInvoice.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        supplier: true,
        branch: true,
        lines: {
          include: {
            item: true,
          },
        },
        journalEntry: {
          include: {
            lines: {
              include: {
                account: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: true,
        lines: {
          include: {
            item: true,
          },
        },
        journalEntry: {
          include: {
            lines: {
              include: {
                account: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Purchase invoice with ID "${id}" not found.`);
    }

    return invoice;
  }

  async create(dto: CreatePurchaseInvoiceDto) {
    const lineData = dto.lines.map((line) => {
      const lineTotal = line.quantity * line.unitCost;
      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitCost: line.unitCost,
        lineTotal,
      };
    });

    const subtotal = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
    const taxAmount = dto.taxAmount ?? 0;
    const totalAmount = subtotal + taxAmount;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Parallelize account lookups for Inventory (1200) & Accounts Payable (2000)
        const [inventoryAccount, apAccount] = await Promise.all([
          tx.account.findUnique({ where: { code: '1200' } }).then(async (acc) => {
            return acc ?? tx.account.create({ data: { code: '1200', name: 'Inventory', type: 'ASSET' } });
          }),
          tx.account.findUnique({ where: { code: '2000' } }).then(async (acc) => {
            return acc ?? tx.account.create({ data: { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' } });
          }),
        ]);

        // 1. Create the Purchase Invoice
        const purchaseInvoice = await tx.purchaseInvoice.create({
          data: {
            invoiceNumber: dto.invoiceNumber,
            supplierId: dto.supplierId,
            branchId: dto.branchId,
            paymentTerms: dto.paymentTerms ?? 'IMMEDIATE',
            status: 'POSTED',
            subtotal,
            taxAmount,
            totalAmount,
            lines: {
              create: lineData,
            },
          },
          include: {
            lines: true,
            supplier: true,
            branch: true,
          },
        });

        // 2. Increment stock & update Weighted Average Cost (WAC) for each item purchased
        for (const line of dto.lines) {
          const currentItem = await tx.item.findUnique({ where: { id: line.itemId } });
          if (currentItem) {
            const currentQty = currentItem.stockQuantity ?? 0;
            const currentCost = Number(currentItem.cost) || 0;
            const newQty = currentQty + Math.round(line.quantity);

            // Weighted Average Cost formula
            const newWacCost = newQty > 0
              ? ((currentQty * currentCost) + (line.quantity * line.unitCost)) / newQty
              : line.unitCost;

            await tx.item.update({
              where: { id: line.itemId },
              data: {
                stockQuantity: newQty,
                cost: newWacCost,
              },
            });
          }

          await tx.itemStock.upsert({
            where: {
              itemId_branchId: { itemId: line.itemId, branchId: dto.branchId },
            },
            update: { quantity: { increment: line.quantity } },
            create: { itemId: line.itemId, branchId: dto.branchId, quantity: line.quantity },
          });
        }

        // 3. Auto-post journal entry: DEBIT Inventory, CREDIT Accounts Payable
        const journalEntry = await tx.journalEntry.create({
          data: {
            reference: `JE-${dto.invoiceNumber}`,
            description: `Auto-posted from purchase invoice ${dto.invoiceNumber}`,
            status: 'POSTED',
            branchId: dto.branchId,
            purchaseInvoiceId: purchaseInvoice.id,
            lines: {
              create: [
                {
                  accountId: inventoryAccount.id,
                  debit: totalAmount,
                  credit: 0,
                },
                {
                  accountId: apAccount.id,
                  debit: 0,
                  credit: totalAmount,
                },
              ],
            },
          },
          include: {
            lines: {
              include: {
                account: true,
              },
            },
          },
        });

        return { ...purchaseInvoice, journalEntry };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Purchase invoice number "${dto.invoiceNumber}" already exists.`,
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Invalid supplier or item reference — please check the IDs provided.',
          );
        }
      }
      throw error;
    }
  }

  async createReturn(dto: CreatePurchaseInvoiceDto) {
    const lineData = dto.lines.map((line) => {
      const lineTotal = line.quantity * line.unitCost;
      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitCost: line.unitCost,
        lineTotal,
      };
    });

    const subtotal = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
    const taxAmount = dto.taxAmount ?? 0;
    const totalAmount = subtotal + taxAmount;

    return await this.prisma.$transaction(async (tx) => {
      const [inventoryAccount, apAccount] = await Promise.all([
        tx.account.findUnique({ where: { code: '1200' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '1200', name: 'Inventory', type: 'ASSET' } });
        }),
        tx.account.findUnique({ where: { code: '2000' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' } });
        }),
      ]);

      // 1. Create Purchase Return record
      const purchaseReturn = await tx.purchaseInvoice.create({
        data: {
          invoiceNumber: dto.invoiceNumber,
          supplierId: dto.supplierId,
          branchId: dto.branchId,
          paymentTerms: 'RETURN',
          status: 'POSTED',
          subtotal,
          taxAmount,
          totalAmount,
          lines: {
            create: lineData,
          },
        },
        include: {
          lines: true,
          supplier: true,
          branch: true,
        },
      });

      // 2. Decrement stock from warehouse/branch
      for (const line of dto.lines) {
        await tx.item.update({
          where: { id: line.itemId },
          data: {
            stockQuantity: { decrement: Math.round(line.quantity) },
          },
        });

        await tx.itemStock.upsert({
          where: {
            itemId_branchId: { itemId: line.itemId, branchId: dto.branchId },
          },
          update: { quantity: { decrement: line.quantity } },
          create: { itemId: line.itemId, branchId: dto.branchId, quantity: -line.quantity },
        });
      }

      // 3. Auto-post reversing journal entry: DEBIT Accounts Payable (2000), CREDIT Inventory (1200)
      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: `JE-${dto.invoiceNumber}`,
          description: `Auto-posted from purchase return ${dto.invoiceNumber}`,
          status: 'POSTED',
          branchId: dto.branchId,
          purchaseInvoiceId: purchaseReturn.id,
          lines: {
            create: [
              {
                accountId: apAccount.id,
                debit: totalAmount,
                credit: 0,
              },
              {
                accountId: inventoryAccount.id,
                debit: 0,
                credit: totalAmount,
              },
            ],
          },
        },
        include: {
          lines: {
            include: {
              account: true,
            },
          },
        },
      });

      return { ...purchaseReturn, journalEntry };
    });
  }
}
