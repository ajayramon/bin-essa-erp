import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgingReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerArAging() {
    const customers = await this.prisma.customer.findMany({
      include: {
        salesInvoices: {
          where: {
            paymentMethod: 'CREDIT',
            status: 'POSTED',
          },
          orderBy: { date: 'asc' },
        },
        payments: {
          orderBy: { date: 'asc' },
        },
      },
    });

    const now = new Date();

    return customers.map((c) => {
      let current = 0;
      let days31to60 = 0;
      let days61to90 = 0;
      let days90Plus = 0;

      for (const inv of c.salesInvoices) {
        const amount = inv.isReturn ? -Number(inv.totalAmount) : Number(inv.totalAmount);
        const ageDays = Math.floor((now.getTime() - new Date(inv.date).getTime()) / (1000 * 60 * 60 * 24));

        if (ageDays <= 30) {
          current += amount;
        } else if (ageDays <= 60) {
          days31to60 += amount;
        } else if (ageDays <= 90) {
          days61to90 += amount;
        } else {
          days90Plus += amount;
        }
      }

      // Net payments chronologically against oldest debt (FIFO)
      let unallocatedPayment = c.payments.reduce((sum, p) => sum + Number(p.amount), 0);

      if (unallocatedPayment > 0) {
        const deduct90 = Math.min(Math.max(days90Plus, 0), unallocatedPayment);
        days90Plus = Math.max(0, days90Plus - deduct90);
        unallocatedPayment -= deduct90;
      }
      if (unallocatedPayment > 0) {
        const deduct61 = Math.min(Math.max(days61to90, 0), unallocatedPayment);
        days61to90 = Math.max(0, days61to90 - deduct61);
        unallocatedPayment -= deduct61;
      }
      if (unallocatedPayment > 0) {
        const deduct31 = Math.min(Math.max(days31to60, 0), unallocatedPayment);
        days31to60 = Math.max(0, days31to60 - deduct31);
        unallocatedPayment -= deduct31;
      }
      if (unallocatedPayment > 0) {
        const deductCurr = Math.min(Math.max(current, 0), unallocatedPayment);
        current = Math.max(0, current - deductCurr);
        unallocatedPayment -= deductCurr;
      }

      const totalOutstanding = Math.round((current + days31to60 + days61to90 + days90Plus) * 1000) / 1000;

      return {
        customerId: c.id,
        customerCode: c.code,
        customerName: c.name,
        creditLimit: Number(c.creditLimit),
        current: Math.round(current * 1000) / 1000,
        days31to60: Math.round(days31to60 * 1000) / 1000,
        days61to90: Math.round(days61to90 * 1000) / 1000,
        days90Plus: Math.round(days90Plus * 1000) / 1000,
        totalOutstanding,
      };
    });
  }

  async getSupplierApAging() {
    const suppliers = await this.prisma.supplier.findMany({
      include: {
        purchaseInvoices: {
          where: {
            status: 'POSTED',
          },
        },
      },
    });

    const now = new Date();

    return suppliers.map((s) => {
      let current = 0;
      let days31to60 = 0;
      let days61to90 = 0;
      let days90Plus = 0;

      for (const inv of s.purchaseInvoices) {
        const amount = Number(inv.totalAmount);
        const ageDays = Math.floor((now.getTime() - new Date(inv.date).getTime()) / (1000 * 60 * 60 * 24));

        if (ageDays <= 30) {
          current += amount;
        } else if (ageDays <= 60) {
          days31to60 += amount;
        } else if (ageDays <= 90) {
          days61to90 += amount;
        } else {
          days90Plus += amount;
        }
      }

      const totalOutstanding = current + days31to60 + days61to90 + days90Plus;

      return {
        supplierId: s.id,
        supplierCode: s.code,
        supplierName: s.name,
        current,
        days31to60,
        days61to90,
        days90Plus,
        totalOutstanding,
      };
    });
  }
}
