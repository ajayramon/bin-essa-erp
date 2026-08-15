import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockCountDto } from './dto/create-stock-count.dto';

@Injectable()
export class StockCountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.stockCount.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        branch: true,
        lines: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const count = await this.prisma.stockCount.findUnique({
      where: { id },
      include: {
        branch: true,
        lines: {
          include: { item: true },
        },
      },
    });
    if (!count) throw new NotFoundException(`Stock count ${id} not found`);
    return count;
  }

  async create(dto: CreateStockCountDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Stock count must contain at least one line');
    }

    const lineData: any[] = [];

    for (const line of dto.lines) {
      const item = await this.prisma.item.findUnique({ where: { id: line.itemId } });
      if (!item) throw new NotFoundException(`Item ${line.itemId} not found`);

      const branchStock = await this.prisma.itemStock.findUnique({
        where: {
          itemId_branchId: {
            itemId: line.itemId,
            branchId: dto.branchId,
          },
        },
      });

      const systemQuantity = line.systemQuantity !== undefined ? Number(line.systemQuantity) : Number(branchStock?.quantity || 0);
      const variance = line.countedQuantity - systemQuantity;
      const unitCost = Number(item.cost);

      lineData.push({
        itemId: line.itemId,
        systemQuantity,
        countedQuantity: line.countedQuantity,
        variance,
        unitCost,
      });
    }

    return this.prisma.stockCount.create({
      data: {
        countNumber: dto.countNumber,
        branchId: dto.branchId,
        status: 'COMPLETED',
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
