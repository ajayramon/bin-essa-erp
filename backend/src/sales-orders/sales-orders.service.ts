import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';

@Injectable()
export class SalesOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSalesOrderDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Sales order must contain at least one line item.');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${dto.customerId}" not found.`);
    }

    const lineData = dto.lines.map((l) => ({
      itemId: l.itemId,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      lineTotal: l.quantity * l.unitPrice,
    }));

    const subtotal = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
    const taxAmount = 0;
    const totalAmount = subtotal + taxAmount;

    // Calculate current open AR balance for customer
    const totalInvoiced = await this.prisma.salesInvoice.aggregate({
      where: { customerId: dto.customerId, status: 'POSTED' },
      _sum: { totalAmount: true },
    });

    const totalPaid = await this.prisma.customerPayment.aggregate({
      where: { customerId: dto.customerId },
      _sum: { amount: true },
    });

    const currentBalance = (Number(totalInvoiced._sum.totalAmount) || 0) - (Number(totalPaid._sum.amount) || 0);
    const creditLimit = Number(customer.creditLimit) || 0;
    const projectedBalance = currentBalance + totalAmount;

    let status: 'CONFIRMED' | 'CREDIT_HOLD' = 'CONFIRMED';
    if (creditLimit > 0 && projectedBalance > creditLimit && !dto.overrideCreditHold) {
      status = 'CREDIT_HOLD';
    }

    const order = await this.prisma.salesOrder.create({
      data: {
        orderNumber: dto.orderNumber,
        customerId: dto.customerId,
        branchId: dto.branchId,
        status,
        subtotal,
        taxAmount,
        totalAmount,
        notes: dto.notes,
        lines: {
          create: lineData,
        },
      },
      include: {
        customer: true,
        branch: true,
        lines: {
          include: { item: true },
        },
      },
    });

    return {
      ...order,
      creditAudit: {
        creditLimit,
        currentBalance,
        projectedBalance,
        creditHoldTriggered: status === 'CREDIT_HOLD',
      },
    };
  }

  async findAll() {
    return this.prisma.salesOrder.findMany({
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Sales order with ID "${id}" not found.`);
    }

    return order;
  }
}
