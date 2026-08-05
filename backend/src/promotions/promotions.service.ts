import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePromotionDto) {
    const { itemIds, branchIds, customerIds, ...promoData } = dto;

    return this.prisma.promotion.create({
      data: {
        ...promoData,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        items: itemIds?.length
          ? {
              create: itemIds.map((itemId) => ({ itemId })),
            }
          : undefined,
        branches: branchIds?.length
          ? {
              create: branchIds.map((branchId) => ({ branchId })),
            }
          : undefined,
        customers: customerIds?.length
          ? {
              create: customerIds.map((customerId) => ({ customerId })),
            }
          : undefined,
      },
      include: {
        items: { include: { item: true } },
        branches: { include: { branch: true } },
        customers: { include: { customer: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { item: true } },
        branches: { include: { branch: true } },
        customers: { include: { customer: true } },
      },
    });
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        items: { include: { item: true } },
        branches: { include: { branch: true } },
        customers: { include: { customer: true } },
      },
    });
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async update(id: string, dto: Partial<CreatePromotionDto>) {
    await this.findOne(id);
    const { itemIds, branchIds, customerIds, ...promoData } = dto;

    if (itemIds !== undefined) {
      await this.prisma.promotionItem.deleteMany({ where: { promotionId: id } });
    }
    if (branchIds !== undefined) {
      await this.prisma.promotionBranch.deleteMany({ where: { promotionId: id } });
    }
    if (customerIds !== undefined) {
      await this.prisma.promotionCustomer.deleteMany({ where: { promotionId: id } });
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...promoData,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        items: itemIds?.length
          ? {
              create: itemIds.map((itemId) => ({ itemId })),
            }
          : undefined,
        branches: branchIds?.length
          ? {
              create: branchIds.map((branchId) => ({ branchId })),
            }
          : undefined,
        customers: customerIds?.length
          ? {
              create: customerIds.map((customerId) => ({ customerId })),
            }
          : undefined,
      },
      include: {
        items: { include: { item: true } },
        branches: { include: { branch: true } },
        customers: { include: { customer: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.promotion.delete({ where: { id } });
  }

  async getAuditLogs() {
    return this.prisma.discountAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async evaluatePromotions(params: {
    branchId: string;
    customerId?: string;
    lines: Array<{ itemId: string; quantity: number; unitPrice: number }>;
  }) {
    const { branchId, customerId, lines } = params;
    const now = new Date();

    const activePromotions = await this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        items: true,
        branches: true,
        customers: true,
      },
    });

    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const validPromotions = activePromotions.filter((p) => {
      // Check time of day filter
      if (p.startTime && p.endTime) {
        if (currentTimeStr < p.startTime || currentTimeStr > p.endTime) return false;
      }
      // Check branch scope
      if (p.branchScope === 'SPECIFIC_BRANCHES') {
        const allowedBranch = p.branches.some((b) => b.branchId === branchId);
        if (!allowedBranch) return false;
      }
      // Check customer scope
      if (p.customerScope === 'SPECIFIC_CUSTOMER' && customerId) {
        const allowedCustomer = p.customers.some((c) => c.customerId === customerId);
        if (!allowedCustomer) return false;
      }
      return true;
    });

    let totalDiscount = 0;
    const lineDiscounts: Record<string, { discountAmount: number; promotionId: string; promotionName: string }> = {};

    lines.forEach((line) => {
      const eligiblePromo = validPromotions.find((p) => {
        if (p.targetType === 'ALL_PRODUCTS') return true;
        if (p.targetType === 'PRODUCT') {
          return p.items.some((itemRel) => itemRel.itemId === line.itemId);
        }
        return false;
      });

      if (eligiblePromo) {
        let discount = 0;
        const lineTotal = line.quantity * line.unitPrice;
        if (eligiblePromo.discountType === 'PERCENTAGE') {
          discount = (lineTotal * Number(eligiblePromo.discountValue)) / 100;
        } else {
          discount = Math.min(Number(eligiblePromo.discountValue), lineTotal);
        }
        discount = Number(discount.toFixed(3));
        lineDiscounts[line.itemId] = {
          discountAmount: discount,
          promotionId: eligiblePromo.id,
          promotionName: eligiblePromo.nameEn,
        };
        totalDiscount += discount;
      }
    });

    return {
      totalDiscount: Number(totalDiscount.toFixed(3)),
      lineDiscounts,
      appliedPromotionsCount: Object.keys(lineDiscounts).length,
    };
  }
}
