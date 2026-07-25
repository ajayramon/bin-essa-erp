import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';

const CASH_ACCOUNT_ID = '77519a05-d63e-4f9e-88fe-6e1088111a9b';
const SALES_REVENUE_ACCOUNT_ID = 'd64c9aa7-a5a4-4ddf-92d1-d244d7d6791c';

@Injectable()
export class SalesInvoicesService {
  constructor(private prisma: PrismaService) {}

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

      // 2. Decrease stock for each line item at this branch
      for (const line of dto.lines) {
        await tx.itemStock.upsert({
          where: {
            itemId_branchId: {
              itemId: line.itemId,
              branchId: dto.branchId,
            },
          },
          update: {
            quantity: { decrement: line.quantity },
          },
          create: {
            itemId: line.itemId,
            branchId: dto.branchId,
            quantity: -line.quantity,
          },
        });
      }

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
                accountId: CASH_ACCOUNT_ID,
                debit: totalAmount,
                credit: 0,
              },
              {
                accountId: SALES_REVENUE_ACCOUNT_ID,
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
