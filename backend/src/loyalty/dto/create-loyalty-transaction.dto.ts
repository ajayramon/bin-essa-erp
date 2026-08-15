import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { LoyaltyTxType } from '../../../generated/prisma/client';

export class CreateLoyaltyTransactionDto {
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @IsNumber()
  points!: number;

  @IsEnum(LoyaltyTxType)
  type!: LoyaltyTxType;

  @IsOptional()
  @IsString()
  salesInvoiceId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
