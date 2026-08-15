import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AdjustmentReason } from '../../../generated/prisma/client';

export class StockAdjustmentLineDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsNumber()
  quantityChange!: number; // e.g. -5 (shrinkage) or +10 (found)

  @IsOptional()
  @IsNumber()
  unitCost?: number;
}

export class CreateStockAdjustmentDto {
  @IsString()
  @IsNotEmpty()
  adjustmentNumber!: string;

  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @IsEnum(AdjustmentReason)
  @IsOptional()
  reason?: AdjustmentReason;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockAdjustmentLineDto)
  lines!: StockAdjustmentLineDto[];
}
