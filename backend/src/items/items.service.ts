import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        sku: dto.sku,
        barcode: dto.barcode,
        name: dto.name,
        category: dto.category,
        visibility: dto.visibility,
        price: dto.price,
        cost: dto.cost,
        unit: dto.unit,
        isActive: dto.isActive,
      },
    });
  }

  async findAll() {
    return this.prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.item.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return this.prisma.item.delete({ where: { id } });
  }
}