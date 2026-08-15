import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StockCountLineDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsNumber()
  countedQuantity!: number;

  @IsOptional()
  @IsNumber()
  systemQuantity?: number;
}

export class CreateStockCountDto {
  @IsString()
  @IsNotEmpty()
  countNumber!: string;

  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockCountLineDto)
  lines!: StockCountLineDto[];
}
