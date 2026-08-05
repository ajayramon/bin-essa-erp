import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateItemVariantDto {
  @IsString()
  itemId: string;

  @IsString()
  sku: string;

  @IsString()
  barcode: string;

  @IsString()
  variantName: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
