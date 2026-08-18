import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PaymentMethod } from '../../../generated/prisma/client';

export class CreateCustomerPaymentDto {
  @IsString()
  @IsNotEmpty()
  receiptNumber!: string;

  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsNumber()
  @Min(0.001)
  amount!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
