import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseRequisitionDto } from './dto/create-purchase-requisition.dto';

@Injectable()
export class PurchaseRequisitionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.purchaseRequisition.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        branch: true,
        lines: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id },
      include: {
        branch: true,
        lines: { include: { item: true } },
      },
    });
    if (!pr) throw new NotFoundException(`Purchase requisition ${id} not found`);
    return pr;
  }

  async create(dto: CreatePurchaseRequisitionDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Purchase requisition must contain at least one line');
    }

    const lineData = dto.lines.map((l) => ({
      itemId: l.itemId,
      quantity: l.quantity,
      notes: l.notes,
    }));

    return this.prisma.purchaseRequisition.create({
      data: {
        prNumber: dto.prNumber,
        branchId: dto.branchId,
        requestedByUserId: dto.requestedByUserId,
        status: 'PENDING',
        notes: dto.notes,
        lines: {
          create: lineData,
        },
      },
      include: {
        branch: true,
        lines: { include: { item: true } },
      },
    });
  }
}
