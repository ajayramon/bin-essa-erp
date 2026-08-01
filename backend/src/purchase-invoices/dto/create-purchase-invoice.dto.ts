import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PurchaseInvoiceLineDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitCost: number;
}

export class CreatePurchaseInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseInvoiceLineDto)
  lines: PurchaseInvoiceLineDto[];
}
