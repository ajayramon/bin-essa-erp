import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BankTxType } from '../../../generated/prisma/client';

export class CreateBankTransactionDto {
  @IsString()
  @IsNotEmpty()
  bankAccountId!: string;

  @IsEnum(BankTxType)
  type!: BankTxType;

  @IsNumber()
  @Min(0.001)
  amount!: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
