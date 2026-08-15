import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCashTransferDto {
  @IsString()
  @IsNotEmpty()
  transferNumber!: string;

  @IsString()
  @IsNotEmpty()
  fromCashAccountId!: string;

  @IsString()
  @IsNotEmpty()
  toCashAccountId!: string;

  @IsNumber()
  @Min(0.001)
  amount!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
