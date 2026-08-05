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

  @IsEnum(ItemCategory)
  category: ItemCategory;

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
  uoms?: Array<{
    unitName: string;
    conversionRatio: number;
    barcode?: string;
    retailPrice?: number;
    wholesalePrice?: number;
    isBase?: boolean;
  }>;
}
