import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StockTransferLineDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsNumber()
  @Min(0.001)
  quantity!: number;
}

export class CreateStockTransferDto {
  @IsString()
  @IsNotEmpty()
  transferNumber!: string;

  @IsString()
  @IsNotEmpty()
  fromBranchId!: string;

  @IsString()
  @IsNotEmpty()
  toBranchId!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockTransferLineDto)
  lines!: StockTransferLineDto[];
}
