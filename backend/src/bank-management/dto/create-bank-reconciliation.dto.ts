import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBankReconciliationDto {
  @IsString()
  @IsNotEmpty()
  bankAccountId!: string;

  @IsNumber()
  statementEndingBalance!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  matchedTransactionIds?: string[];
}
