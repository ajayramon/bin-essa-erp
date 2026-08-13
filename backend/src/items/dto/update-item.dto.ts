import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min } from 'class-validator';
import { ItemCategory, ItemVisibility } from '../../../generated/prisma/client';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsEnum(ItemCategory)
  category?: ItemCategory;

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

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

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
}
