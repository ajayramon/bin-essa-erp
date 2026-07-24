import { Injectable } from '@nestjs/common';
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
}
