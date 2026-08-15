import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.quotation.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const q = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
    });
    if (!q) throw new NotFoundException(`Quotation ${id} not found`);
    return q;
  }

  async create(dto: CreateQuotationDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Quotation must contain at least one line');
    }

    let subtotal = 0;
    const lineData: any[] = [];

    for (const line of dto.lines) {
      const lineTotal = line.quantity * line.unitPrice;
      subtotal += lineTotal;
      lineData.push({
        itemId: line.itemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal,
      });
    }

    return this.prisma.quotation.create({
      data: {
        quoteNumber: dto.quoteNumber,
        customerId: dto.customerId,
        branchId: dto.branchId,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        subtotal,
        taxAmount: 0,
        totalAmount: subtotal,
        notes: dto.notes,
        status: 'DRAFT',
        lines: {
          create: lineData,
        },
      },
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
    });
  }
}
