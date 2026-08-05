import { Injectable, NotFoundException } from '@nestjs/common';
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
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id },
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
      throw new NotFoundException(`Sales invoice with ID "${id}" not found.`);
    }

    return invoice;
  }

  async create(dto: CreateSalesInvoiceDto) {
    const lineData = dto.lines.map((line) => {
      const lineTotal = Number((line.quantity * line.unitPrice).toFixed(3));
      const lineDiscount = line.discountAmount ?? 0;
      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        originalUnitPrice: line.originalUnitPrice ?? line.unitPrice,
        discountAmount: lineDiscount,
        lineTotal,
        promotionId: line.promotionId,
      };
    });

    const grossSubtotal = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
    const lineDiscountsTotal = lineData.reduce((sum, l) => sum + l.discountAmount, 0);
    const headerDiscount = dto.discountAmount ?? 0;
    const totalDiscount = Number((lineDiscountsTotal + headerDiscount).toFixed(3));
    const subtotal = Number((grossSubtotal - lineDiscountsTotal).toFixed(3));
    const taxAmount = dto.taxAmount ?? 0;
    const totalAmount = Number((subtotal + taxAmount - headerDiscount).toFixed(3));

    return this.prisma.$transaction(async (tx) => {
      // Fetch user details for audit trail
      const user = await tx.user.findUnique({
        where: { id: dto.userId },
        select: { fullName: true, role: true },
      });

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
          subtotal: grossSubtotal,
          taxAmount,
          discountAmount: totalDiscount,
          totalAmount,
          manualDiscountReason: dto.manualDiscountReason,
          promotionId: dto.promotionId,
          lines: {
            create: lineData,
          },
        },
        include: {
          lines: true,
        },
      });

      // Log to Audit Trail if discount was granted
      if (totalDiscount > 0) {
        await tx.discountAuditLog.create({
          data: {
            userId: dto.userId,
            userName: user?.fullName || 'Cashier',
            userRole: user?.role || 'CASHIER',
            branchId: dto.branchId,
            invoiceNumber: dto.invoiceNumber,
            discountType: dto.promotionId ? 'PROMOTION' : 'MANUAL_HEADER',
            promotionId: dto.promotionId,
            originalAmount: grossSubtotal,
            discountAmount: totalDiscount,
            finalAmount: totalAmount,
            reason: dto.manualDiscountReason || (dto.promotionId ? 'Promotion Applied' : 'Manual Cashier Discount'),
            approvedByUserId: dto.approvedByUserId,
            approvedByName: dto.approvedByName,
          },
        });
      }

      // 2. Decrease stock for all line items concurrently in parallel
      await Promise.all(
        dto.lines.flatMap((line) => [
          tx.item.update({
            where: { id: line.itemId },
            data: { stockQuantity: { decrement: Math.max(1, Math.round(line.quantity)) } },
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

  async createReturn(dto: CreateSalesInvoiceDto) {
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
      const itemIds = dto.lines.map((l) => l.itemId);
      const items = await tx.item.findMany({
        where: { id: { in: itemIds } },
      });

      const itemCostMap = new Map(items.map((i) => [i.id, Number(i.cost) || 0]));
      const totalCogs = dto.lines.reduce((sum, line) => {
        const itemCost = itemCostMap.get(line.itemId) ?? 0;
        return sum + line.quantity * itemCost;
      }, 0);

      let refundCode = '1000';
      let refundName = 'Cash';
      if (dto.paymentMethod === 'CREDIT') {
        refundCode = '1100';
        refundName = 'Accounts Receivable';
      } else if (dto.paymentMethod === 'CARD' || dto.paymentMethod === 'BANK_TRANSFER') {
        refundCode = '1010';
        refundName = 'Bank / K-Net';
      }

      const [refundAccount, salesRevenueAccount, inventoryAccount, cogsAccount] = await Promise.all([
        tx.account.findUnique({ where: { code: refundCode } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: refundCode, name: refundName, type: 'ASSET' } });
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

      // 1. Create return invoice
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

      // 2. Increment stock (return items to inventory)
      await Promise.all(
        dto.lines.flatMap((line) => [
          tx.item.update({
            where: { id: line.itemId },
            data: { stockQuantity: { increment: Math.round(line.quantity) } },
          }),
          tx.itemStock.upsert({
            where: {
              itemId_branchId: { itemId: line.itemId, branchId: dto.branchId },
            },
            update: { quantity: { increment: line.quantity } },
            create: { itemId: line.itemId, branchId: dto.branchId, quantity: line.quantity },
          }),
        ]),
      );

      // 3. Auto-post reverse journal entry lines:
      // Debit Sales Revenue (4000) for totalAmount
      // Credit Cash / AR / Bank for totalAmount
      // Debit Inventory (1200) for totalCogs
      // Credit COGS (5000) for totalCogs
      const jeLines = [
        {
          accountId: salesRevenueAccount.id,
          debit: totalAmount,
          credit: 0,
        },
        {
          accountId: refundAccount.id,
          debit: 0,
          credit: totalAmount,
        },
      ];

      if (totalCogs > 0) {
        jeLines.push(
          {
            accountId: inventoryAccount.id,
            debit: totalCogs,
            credit: 0,
          },
          {
            accountId: cogsAccount.id,
            debit: 0,
            credit: totalCogs,
          },
        );
      }

      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: `JE-${dto.invoiceNumber}`,
          description: `Auto-posted from sales return ${dto.invoiceNumber} (${dto.paymentMethod})`,
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

