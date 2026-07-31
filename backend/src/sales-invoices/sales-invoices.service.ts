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
      // Fetch sold items to calculate COGS (Cost of Goods Sold)
      const itemIds = dto.lines.map((l) => l.itemId);
      const items = await tx.item.findMany({
        where: { id: { in: itemIds } },
      });

      const itemCostMap = new Map(items.map((i) => [i.id, Number(i.cost) || 0]));
      const totalCogs = dto.lines.reduce((sum, line) => {
        const itemCost = itemCostMap.get(line.itemId) ?? 0;
        return sum + line.quantity * itemCost;
      }, 0);

      // Determine Debit Account Code based on Payment Method:
      // CASH -> 1000 Cash, CREDIT -> 1100 Accounts Receivable, CARD/BANK_TRANSFER -> 1010 Bank/K-Net
      let debitCode = '1000';
      let debitName = 'Cash';
      if (dto.paymentMethod === 'CREDIT') {
        debitCode = '1100';
        debitName = 'Accounts Receivable';
      } else if (dto.paymentMethod === 'CARD' || dto.paymentMethod === 'BANK_TRANSFER') {
        debitCode = '1010';
        debitName = 'Bank / K-Net';
      }

      // Parallelize account lookups/creations
      const [debitAccount, salesRevenueAccount, inventoryAccount, cogsAccount] = await Promise.all([
        tx.account.findUnique({ where: { code: debitCode } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: debitCode, name: debitName, type: 'ASSET' } });
        }),
        tx.account.findUnique({ where: { code: '4000' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '4000', name: 'Sales Revenue', type: 'REVENUE' } });
        }),
        tx.account.findUnique({ where: { code: '1200' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '1200', name: 'Inventory', type: 'ASSET' } });
        }),
        tx.account.findUnique({ where: { code: '5000' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE' } });
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

      // 3. Auto-post journal entry lines:
      // a. Revenue entry: Debit Cash/AR (Asset), Credit Revenue
      // b. COGS entry: Debit 5000 COGS (Expense), Credit 1200 Inventory (Asset)
      const jeLines = [
        {
          accountId: debitAccount.id,
          debit: totalAmount,
          credit: 0,
        },
        {
          accountId: salesRevenueAccount.id,
          debit: 0,
          credit: totalAmount,
        },
      ];

      if (totalCogs > 0) {
        jeLines.push(
          {
            accountId: cogsAccount.id,
            debit: totalCogs,
            credit: 0,
          },
          {
            accountId: inventoryAccount.id,
            debit: 0,
            credit: totalCogs,
          },
        );
      }

      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: `JE-${dto.invoiceNumber}`,
          description: `Auto-posted from sales invoice ${dto.invoiceNumber} (${dto.paymentMethod})`,
          status: 'POSTED',
          branchId: dto.branchId,
          salesInvoiceId: invoice.id,
          lines: {
            create: jeLines,
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
