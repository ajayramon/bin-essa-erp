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
        customerId: c.id,
        customerCode: c.code,
        customerName: c.name,
        creditLimit: Number(c.creditLimit),
        current,
        days31to60,
        days61to90,
        days90Plus,
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
