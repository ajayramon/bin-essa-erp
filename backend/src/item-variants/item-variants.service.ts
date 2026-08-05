import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemVariantDto } from './dto/create-item-variant.dto';

@Injectable()
export class ItemVariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByItem(itemId: string) {
    return this.prisma.itemVariant.findMany({
      where: { itemId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateItemVariantDto) {
    const existingSku = await this.prisma.itemVariant.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException(`Variant SKU ${dto.sku} already exists`);
    }

    const existingBarcode = await this.prisma.itemVariant.findUnique({
      where: { barcode: dto.barcode },
    });
    if (existingBarcode) {
      throw new ConflictException(`Variant barcode ${dto.barcode} already exists`);
    }

    return this.prisma.itemVariant.create({
      data: {
        itemId: dto.itemId,
        sku: dto.sku,
        barcode: dto.barcode,
        variantName: dto.variantName,
        price: dto.price,
        cost: dto.cost ?? 0,
        stock: dto.stock ?? 0,
      },
    });
  }

  async delete(id: string) {
    const variant = await this.prisma.itemVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant ${id} not found`);

    return this.prisma.itemVariant.delete({ where: { id } });
  }
}
