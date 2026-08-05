import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';

export enum PromotionDiscountTypeDto {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum PromotionTargetTypeDto {
  PRODUCT = 'PRODUCT',
  PRODUCT_GROUP = 'PRODUCT_GROUP',
  CATEGORY = 'CATEGORY',
  ALL_PRODUCTS = 'ALL_PRODUCTS',
}

export enum PromotionBranchScopeDto {
  ALL_BRANCHES = 'ALL_BRANCHES',
  SPECIFIC_BRANCHES = 'SPECIFIC_BRANCHES',
}

export enum PromotionCustomerScopeDto {
  ALL_CUSTOMERS = 'ALL_CUSTOMERS',
  SPECIFIC_CUSTOMER = 'SPECIFIC_CUSTOMER',
  CUSTOMER_GROUP = 'CUSTOMER_GROUP',
}

export class CreatePromotionDto {
  @IsString()
  code: string;

  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PromotionDiscountTypeDto)
  discountType: PromotionDiscountTypeDto;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @IsOptional()
  @IsBoolean()
  isCombinable?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsEnum(PromotionTargetTypeDto)
  targetType: PromotionTargetTypeDto;

  @IsEnum(PromotionBranchScopeDto)
  branchScope: PromotionBranchScopeDto;

  @IsEnum(PromotionCustomerScopeDto)
  customerScope: PromotionCustomerScopeDto;

  @IsOptional()
  @IsString()
  customerGroup?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  itemIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  branchIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customerIds?: string[];
}
