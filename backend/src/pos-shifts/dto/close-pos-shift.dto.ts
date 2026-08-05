import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ClosePosShiftDto {
  @IsNumber()
  @Min(0)
  closingCashActual: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
