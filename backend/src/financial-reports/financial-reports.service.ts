import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinancialReportsService {
  constructor(private prisma: PrismaService) {}

  async getIncomeStatement(startDate?: Date, endDate?: Date, branchId?: string) {
    const journalLines = await this.prisma.journalEntryLine.findMany({
      where: {
        journalEntry: {
          branchId: branchId ? branchId : undefined,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        account: true,
      },
    });

    let revenue = 0;
    let cogs = 0;
    let operatingExpenses = 0;

    for (const line of journalLines) {
      const code = line.account.code;
      const type = line.account.type;
      const netCredit = Number(line.credit) - Number(line.debit);
      const netDebit = Number(line.debit) - Number(line.credit);

      if (type === 'REVENUE' || code.startsWith('4')) {
        revenue += netCredit;
      } else if (code.startsWith('50') || line.account.name.toLowerCase().includes('cost of goods')) {
        cogs += netDebit;
      } else if (type === 'EXPENSE' || code.startsWith('5') || code.startsWith('6')) {
        operatingExpenses += netDebit;
      }
    }

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    return {
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit,
      currency: 'KWD',
    };
  }

  async getBalanceSheet(asOfDate?: Date, branchId?: string) {
    const journalLines = await this.prisma.journalEntryLine.findMany({
      where: {
        journalEntry: {
          branchId: branchId ? branchId : undefined,
          date: asOfDate ? { lte: asOfDate } : undefined,
        },
      },
      include: {
        account: true,
      },
    });

    let currentAssets = 0;
    let totalLiabilities = 0;
    let equity = 0;

    for (const line of journalLines) {
      const type = line.account.type;
      const netDebit = Number(line.debit) - Number(line.credit);
      const netCredit = Number(line.credit) - Number(line.debit);

      if (type === 'ASSET') {
        currentAssets += netDebit;
      } else if (type === 'LIABILITY') {
        totalLiabilities += netCredit;
      } else if (type === 'EQUITY') {
        equity += netCredit;
      }
    }

    // Include calculated net income into Retained Earnings
    const pnl = await this.getIncomeStatement(undefined, asOfDate, branchId);
    const totalEquity = equity + pnl.netProfit;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    return {
      assets: {
        currentAssets,
        totalAssets: currentAssets,
      },
      liabilities: {
        currentLiabilities: totalLiabilities,
        totalLiabilities,
      },
      equity: {
        capital: equity,
        retainedEarnings: pnl.netProfit,
        totalEquity,
      },
      totalLiabilitiesAndEquity,
      isBalanced: Math.abs(currentAssets - totalLiabilitiesAndEquity) < 0.01,
      currency: 'KWD',
    };
  }

  async getCashFlowStatement(startDate?: Date, endDate?: Date, branchId?: string) {
    const cashInvoices = await this.prisma.salesInvoice.findMany({
      where: {
        branchId: branchId ? branchId : undefined,
        createdAt: { gte: startDate, lte: endDate },
        isReturn: false,
      },
    });

    const cashReceipts = await this.prisma.receiptVoucher.findMany({
      where: {
        branchId: branchId ? branchId : undefined,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const expenses = await this.prisma.expense.findMany({
      where: {
        branchId: branchId ? branchId : undefined,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const payments = await this.prisma.paymentVoucher.findMany({
      where: {
        branchId: branchId ? branchId : undefined,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const salesInflow = cashInvoices.reduce((s, i) => s + Number(i.totalAmount), 0);
    const receiptInflow = cashReceipts.reduce((s, r) => s + Number(r.amount), 0);
    const totalInflow = salesInflow + receiptInflow;

    const expenseOutflow = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const paymentOutflow = payments.reduce((s, p) => s + Number(p.amount), 0);
    const totalOutflow = expenseOutflow + paymentOutflow;

    const netCashFlow = totalInflow - totalOutflow;

    return {
      operatingInflows: {
        salesCollections: salesInflow,
        customerReceipts: receiptInflow,
        totalInflow,
      },
      operatingOutflows: {
        operatingExpenses: expenseOutflow,
        supplierPayments: paymentOutflow,
        totalOutflow,
      },
      netCashFlow,
      currency: 'KWD',
    };
  }

  async getInventoryValuation(branchId?: string) {
    const items = await this.prisma.item.findMany({
      where: { isActive: true },
      include: {
        stocks: branchId ? { where: { branchId } } : true,
      },
    });

    let totalValuation = 0;
    let totalItemsCount = 0;

    const valuationList = items.map((item) => {
      const quantity = item.stocks.reduce((s, st) => s + Number(st.quantity), 0);
      const unitCost = Number(item.cost);
      const valuation = quantity * unitCost;

      totalValuation += valuation;
      totalItemsCount += quantity;

      return {
        id: item.id,
        sku: item.sku,
        barcode: item.barcode,
        name: item.name,
        category: item.category,
        quantity,
        unitCost,
        valuation,
      };
    });

    return {
      totalValuation,
      totalItemsCount,
      items: valuationList,
      currency: 'KWD',
    };
  }

  async getProductVelocityReport(startDate?: Date, endDate?: Date) {
    const invoiceLines = await this.prisma.salesInvoiceLine.findMany({
      where: {
        salesInvoice: {
          createdAt: { gte: startDate, lte: endDate },
          isReturn: false,
        },
      },
      include: {
        item: true,
      },
    });

    const itemMap = new Map<string, { item: any; unitsSold: number; totalRevenue: number }>();

    for (const line of invoiceLines) {
      const current = itemMap.get(line.itemId) || { item: line.item, unitsSold: 0, totalRevenue: 0 };
      current.unitsSold += Number(line.quantity);
      current.totalRevenue += Number(line.lineTotal);
      itemMap.set(line.itemId, current);
    }

    const sorted = Array.from(itemMap.values()).sort((a, b) => b.unitsSold - a.unitsSold);

    return {
      fastMoving: sorted.slice(0, 10),
      slowMoving: sorted.slice(-10).reverse(),
      totalProductsAnalyzed: itemMap.size,
    };
  }
}
