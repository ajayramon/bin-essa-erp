import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TargetPeriod } from '../../../generated/prisma/client';

export class CreateSalesTargetDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsEnum(TargetPeriod)
  @IsOptional()
  targetPeriod?: TargetPeriod;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsNumber()
  @Min(0.001)
  targetAmount!: number;
}
