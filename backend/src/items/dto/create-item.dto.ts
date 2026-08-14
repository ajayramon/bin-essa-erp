import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min } from 'class-validator';
import { ItemCategory, ItemVisibility } from '../../../generated/prisma/client';

export class CreateItemDto {
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsEnum(ItemCategory)
  category: ItemCategory;

  @IsOptional()
  @IsString()
  subCategory?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  countryOfOrigin?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ItemVisibility)
  visibility?: ItemVisibility;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSale?: boolean;

  @IsOptional()
  @IsBoolean()
  allowPurchase?: boolean;

  @IsOptional()
  @IsBoolean()
  allowDiscount?: boolean;

  @IsOptional()
  @IsBoolean()
  allowGift?: boolean;

  @IsOptional()
  @IsBoolean()
  expiryRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  posVisibility?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsNumber()
  retailPrice?: number;

  @IsOptional()
  @IsNumber()
  semiWholesalePrice?: number;

  @IsOptional()
  @IsNumber()
  wholesalePrice?: number;

  @IsOptional()
  @IsBoolean()
  trackExpiry?: boolean;

  @IsOptional()
  @IsBoolean()
  blockFreeGift?: boolean;

  @IsOptional()
  @IsBoolean()
  blockDiscount?: boolean;

  @IsOptional()
  @IsNumber()
  maxDiscountPercent?: number;

  @IsOptional()
  additionalBarcodes?: string[];

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  uoms?: Array<{
    unitName: string;
    conversionRatio: number;
    barcode?: string;
    retailPrice?: number;
    wholesalePrice?: number;
    isBase?: boolean;
  }>;
}
