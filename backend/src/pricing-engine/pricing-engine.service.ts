import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PriceEvaluationRequest {
  itemId: string;
  customerId?: string;
  quantity: number;
  uomId?: string;
  branchId?: string;
}

export interface PriceEvaluationResult {
  unitPrice: number;
  originalPrice: number;
  appliedTier: string;
  minAllowedPrice: number;
  isMinPriceProtected: boolean;
}

@Injectable()
export class PricingEngineService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(req: PriceEvaluationRequest): Promise<PriceEvaluationResult> {
    const item = await this.prisma.item.findUnique({
      where: { id: req.itemId },
      include: {
        uoms: true,
      },
    });

    if (!item) throw new NotFoundException(`Item ${req.itemId} not found`);

    let resolvedPrice = Number(item.price);
    const originalPrice = resolvedPrice;
    let appliedTier = 'RETAIL';
    const cost = Number(item.cost);
    // Minimum price is at least cost
    const minAllowedPrice = cost;

    // 1. Customer-specific / Customer-Group Price
    if (req.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: req.customerId },
      });

      if (customer) {
        if (customer.customerGroup === 'WHOLESALE' && item.wholesalePrice) {
          resolvedPrice = Number(item.wholesalePrice);
          appliedTier = 'WHOLESALE_TIER';
        } else if (customer.customerGroup === 'VIP' && item.semiWholesalePrice) {
          resolvedPrice = Number(item.semiWholesalePrice);
          appliedTier = 'VIP_SEMI_WHOLESALE_TIER';
        }

        // Check explicit CustomerGroupPrice table
        if (customer.customerGroup) {
          const groupPrice = await this.prisma.customerGroupPrice.findFirst({
            where: {
              customerGroup: customer.customerGroup,
              itemId: req.itemId,
              minQuantity: { lte: req.quantity },
            },
            orderBy: { minQuantity: 'desc' },
          });
          if (groupPrice) {
            resolvedPrice = Number(groupPrice.unitPrice);
            appliedTier = `CUSTOMER_GROUP_${customer.customerGroup}`;
          }
        }
      }
    }

    // 2. Quantity Tier Price
    const priceTier = await this.prisma.itemPriceTier.findFirst({
      where: {
        itemId: req.itemId,
        minQuantity: { lte: req.quantity },
      },
      orderBy: { minQuantity: 'desc' },
    });

    if (priceTier && Number(priceTier.unitPrice) < resolvedPrice) {
      resolvedPrice = Number(priceTier.unitPrice);
      appliedTier = `BULK_TIER_${priceTier.tierName}`;
    }

    // 3. UOM specific conversion
    if (req.uomId) {
      const uom = item.uoms.find((u) => u.id === req.uomId);
      if (uom) {
        if (uom.retailPrice && appliedTier === 'RETAIL') {
          resolvedPrice = Number(uom.retailPrice);
          appliedTier = `UOM_${uom.unitName}`;
        } else if (uom.wholesalePrice && appliedTier.includes('WHOLESALE')) {
          resolvedPrice = Number(uom.wholesalePrice);
          appliedTier = `UOM_WHOLESALE_${uom.unitName}`;
        } else {
          resolvedPrice = resolvedPrice * Number(uom.conversionRatio);
          appliedTier = `UOM_SCALED_${uom.unitName}`;
        }
      }
    }

    // Enforce Minimum Selling Price Protection
    let isMinPriceProtected = false;
    if (resolvedPrice < minAllowedPrice) {
      resolvedPrice = minAllowedPrice;
      isMinPriceProtected = true;
    }

    return {
      unitPrice: resolvedPrice,
      originalPrice,
      appliedTier,
      minAllowedPrice,
      isMinPriceProtected,
    };
  }
}
