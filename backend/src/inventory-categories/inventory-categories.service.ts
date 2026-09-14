import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveInventoryCategoryDto } from './dto/save-inventory-category.dto';

const categoryInclude = {
  subcategories: { orderBy: { createdAt: 'asc' as const } },
};

function mapSubcategories(dto: SaveInventoryCategoryDto) {
  return dto.subcategories.map((subcategory) => ({
    code: subcategory.code,
    nameEn: subcategory.nameEn,
    nameAr: subcategory.nameAr,
    isActive: subcategory.isActive,
  }));
}

@Injectable()
export class InventoryCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.inventoryCategory.findMany({
      include: categoryInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: SaveInventoryCategoryDto) {
    const duplicate = await this.prisma.inventoryCategory.findUnique({ where: { code: dto.code } });
    if (duplicate) throw new ConflictException(`Category code ${dto.code} already exists`);

    return this.prisma.inventoryCategory.create({
      data: {
        code: dto.code,
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        isActive: dto.isActive,
        subcategories: { create: mapSubcategories(dto) },
      },
      include: categoryInclude,
    });
  }

  async update(id: string, dto: SaveInventoryCategoryDto) {
    const existing = await this.prisma.inventoryCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Inventory category ${id} not found`);

    return this.prisma.$transaction(async (tx) => {
      await tx.inventorySubcategory.deleteMany({ where: { categoryId: id } });
      return tx.inventoryCategory.update({
        where: { id },
        data: {
          code: dto.code,
          nameEn: dto.nameEn,
          nameAr: dto.nameAr,
          isActive: dto.isActive,
          subcategories: { create: mapSubcategories(dto) },
        },
        include: categoryInclude,
      });
    });
  }
}