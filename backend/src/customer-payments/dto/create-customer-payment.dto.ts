import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../../../generated/prisma/client';

export class CreateCustomerPaymentDto {
  @IsString()
  @IsNotEmpty()
  receiptNumber!: string;

  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsNumber()
  @Min(0.001)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
