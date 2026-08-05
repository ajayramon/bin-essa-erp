import { IsString, IsNumber, Min, IsDateString, IsOptional } from 'class-validator';

export class CreatePdcCheckDto {
  @IsString()
  checkNumber: string;

  @IsString()
  bankName: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  @Min(0.001)
  amount: number;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
