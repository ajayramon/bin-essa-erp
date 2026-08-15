import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';

@Injectable()
export class CostCentersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.costCenter.findMany({
      include: {
        expenses: { take: 10, orderBy: { date: 'desc' } },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string) {
    const cc = await this.prisma.costCenter.findUnique({
      where: { id },
      include: {
        expenses: { include: { category: true } },
      },
    });
    if (!cc) throw new NotFoundException(`Cost center ${id} not found`);
    return cc;
  }

  async create(dto: CreateCostCenterDto) {
    return this.prisma.costCenter.create({
      data: {
        code: dto.code,
        name: dto.name,
        type: dto.type || 'BRANCH',
        parentCostCenterId: dto.parentCostCenterId,
      },
    });
  }
}
