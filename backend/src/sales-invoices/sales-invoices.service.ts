import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';

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

    return this.prisma.salesInvoice.create({
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
  }
}
