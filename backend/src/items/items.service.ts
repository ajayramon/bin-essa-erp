import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemDto) {
    const stockQty = dto.stockQuantity ?? 0;
    const item = await this.prisma.item.create({
      data: {
        sku: dto.sku,
        barcode: dto.barcode,
        name: dto.name,
        nameEn: dto.nameEn || dto.name,
        nameAr: dto.nameAr || dto.name,
        category: dto.category,
        subCategory: dto.subCategory,
        brand: dto.brand,
        countryOfOrigin: dto.countryOfOrigin,
        imageUrl: dto.imageUrl,
        visibility: dto.visibility,
        price: dto.price,
        cost: dto.cost,
        unit: dto.unit,
        isActive: dto.isActive ?? true,
        allowSale: dto.allowSale ?? true,
        allowPurchase: dto.allowPurchase ?? true,
        allowDiscount: dto.allowDiscount ?? !dto.blockDiscount,
        allowGift: dto.allowGift ?? !dto.blockFreeGift,
        expiryRequired: dto.expiryRequired ?? dto.trackExpiry ?? false,
        posVisibility: dto.posVisibility ?? true,
        stockQuantity: stockQty,
        retailPrice: dto.retailPrice ?? dto.price,
        semiWholesalePrice: dto.semiWholesalePrice ?? dto.price,
        wholesalePrice: dto.wholesalePrice ?? dto.price,
        trackExpiry: dto.expiryRequired ?? dto.trackExpiry ?? false,
        blockFreeGift: dto.allowGift !== undefined ? !dto.allowGift : (dto.blockFreeGift ?? false),
        blockDiscount: dto.allowDiscount !== undefined ? !dto.allowDiscount : (dto.blockDiscount ?? false),
        maxDiscountPercent: dto.maxDiscountPercent ?? 100.0,
        additionalBarcodes: dto.additionalBarcodes && dto.additionalBarcodes.length > 0
          ? {
              create: dto.additionalBarcodes.map((b) => ({ barcode: b })),
            }
          : undefined,
        uoms: dto.uoms && dto.uoms.length > 0
          ? {
              create: dto.uoms.map((u) => ({
                unitName: u.unitName,
                conversionRatio: u.conversionRatio,
                barcode: u.barcode,
                retailPrice: u.retailPrice,
                wholesalePrice: u.wholesalePrice,
                isBase: u.isBase ?? false,
              })),
            }
          : undefined,
      },
      include: {
        uoms: true,
        additionalBarcodes: true,
      },
    });

    try {
      const branches = await this.prisma.branch.findMany();
      if (branches.length > 0) {
        await Promise.all(
          branches.map((b) =>
            this.prisma.itemStock.upsert({
              where: { itemId_branchId: { itemId: item.id, branchId: b.id } },
              update: { quantity: stockQty },
              create: { itemId: item.id, branchId: b.id, quantity: stockQty },
            })
          )
        );
      }
    } catch {
      // Non-blocking branch sync fallback
    }

    return item;
  }

  async findAll() {
    return this.prisma.item.findMany({
      include: {
        uoms: true,
        additionalBarcodes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        uoms: true,
        additionalBarcodes: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    const updated = await this.prisma.item.update({
      where: { id },
      data: dto,
    });

    if (dto.stockQuantity !== undefined) {
      try {
        const branches = await this.prisma.branch.findMany();
        if (branches.length > 0) {
          await Promise.all(
            branches.map((b) =>
              this.prisma.itemStock.upsert({
                where: { itemId_branchId: { itemId: id, branchId: b.id } },
                update: { quantity: dto.stockQuantity },
                create: { itemId: id, branchId: b.id, quantity: dto.stockQuantity },
              })
            )
          );
        }
      } catch {
        // Non-blocking branch sync fallback
      }
    }

    return updated;
  }

  async remove(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.itemStock.deleteMany({ where: { itemId: id } });
      return tx.item.delete({ where: { id } });
    });
  }
}