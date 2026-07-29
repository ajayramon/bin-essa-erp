import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.purchaseOrder.findMany({
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
            lines: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreatePurchaseOrderDto) {
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

    return this.prisma.$transaction(async (tx) => {
      // Find or create Inventory Account (code 1200) and Accounts Payable Account (code 2000)
      let inventoryAccount = await tx.account.findUnique({ where: { code: '1200' } });
      if (!inventoryAccount) {
        inventoryAccount = await tx.account.create({
          data: { code: '1200', name: 'Inventory', type: 'ASSET' },
        });
      }

      let apAccount = await tx.account.findUnique({ where: { code: '2000' } });
      if (!apAccount) {
        apAccount = await tx.account.create({
          data: { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
        });
      }

      // 1. Create the Purchase Order
      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          poNumber: dto.poNumber,
          supplierId: dto.supplierId,
          branchId: dto.branchId,
          status: dto.status ?? 'POSTED',
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
        },
      });

      // 2. Increase stock for each item (both Item.stockQuantity and ItemStock.quantity)
      for (const line of dto.lines) {
        // Increase scalar stock on Item
        await tx.item.update({
          where: { id: line.itemId },
          data: {
            stockQuantity: { increment: Math.round(line.quantity) },
          },
        });

        // Increase branch stock on ItemStock
        await tx.itemStock.upsert({
          where: {
            itemId_branchId: {
              itemId: line.itemId,
              branchId: dto.branchId,
            },
          },
          update: {
            quantity: { increment: line.quantity },
          },
          create: {
            itemId: line.itemId,
            branchId: dto.branchId,
            quantity: line.quantity,
          },
        });
      }

      // 3. Auto-post journal entry: DEBIT Inventory, CREDIT Accounts Payable
      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: `JE-${dto.poNumber}`,
          description: `Auto-posted from purchase order ${dto.poNumber}`,
          status: 'POSTED',
          branchId: dto.branchId,
          purchaseOrderId: purchaseOrder.id,
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
          lines: true,
        },
      });

      return { ...purchaseOrder, journalEntry };
    });
  }
}
