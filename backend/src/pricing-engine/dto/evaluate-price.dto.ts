import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EvaluatePriceDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @IsOptional()
  @IsString()
  uomId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
