import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { PaymentMethod } from '../../../generated/prisma/client';

export class SalesInvoiceLineDto {
  @IsString()
  itemId: string;

  @IsNumber()
  @Min(0.001)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateSalesInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsString()
  branchId: string;

  @IsString()
  userId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SalesInvoiceLineDto)
  lines: SalesInvoiceLineDto[];
}
