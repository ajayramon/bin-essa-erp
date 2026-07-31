import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';

@Injectable()
export class SalesInvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.salesInvoice.findMany({
      include: {
        customer: true,
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

  async create(dto: CreateSalesInvoiceDto) {
    const lineData = dto.lines.map((line) => {
      const lineTotal = line.quantity * line.unitPrice;
      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal,
      };
    });

    const subtotal = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
    const taxAmount = dto.taxAmount ?? 0;
    const totalAmount = subtotal + taxAmount;

    return this.prisma.$transaction(async (tx) => {
      // Parallelize account lookups
      const [cashAccount, salesRevenueAccount] = await Promise.all([
        tx.account.findUnique({ where: { code: '1000' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '1000', name: 'Cash', type: 'ASSET' } });
        }),
        tx.account.findUnique({ where: { code: '4000' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '4000', name: 'Sales Revenue', type: 'REVENUE' } });
        }),
      ]);

      // 1. Create the invoice with its lines
      const invoice = await tx.salesInvoice.create({
        data: {
          invoiceNumber: dto.invoiceNumber,
          customerId: dto.customerId,
          branchId: dto.branchId,
          userId: dto.userId,
          paymentMethod: dto.paymentMethod,
          subtotal,
          taxAmount,
          totalAmount,
          lines: {
            create: lineData,
          },
        },
        include: {
          lines: true,
        },
      });

      // 2. Decrease stock for all line items concurrently in parallel
      await Promise.all(
        dto.lines.flatMap((line) => [
          tx.item.update({
            where: { id: line.itemId },
            data: { stockQuantity: { decrement: Math.round(line.quantity) } },
          }),
          tx.itemStock.upsert({
            where: {
              itemId_branchId: { itemId: line.itemId, branchId: dto.branchId },
            },
            update: { quantity: { decrement: line.quantity } },
            create: { itemId: line.itemId, branchId: dto.branchId, quantity: -line.quantity },
          }),
        ]),
      );

      // 3. Auto-post journal entry: debit Cash, credit Sales Revenue
      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: `JE-${dto.invoiceNumber}`,
          description: `Auto-posted from sales invoice ${dto.invoiceNumber}`,
          status: 'POSTED',
          branchId: dto.branchId,
          salesInvoiceId: invoice.id,
          lines: {
            create: [
              {
                accountId: cashAccount.id,
                debit: totalAmount,
                credit: 0,
              },
              {
                accountId: salesRevenueAccount.id,
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

      return { ...invoice, journalEntry };
    });
  }
}
