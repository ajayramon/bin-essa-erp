import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ClosePosShiftDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  closingCashActual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actualCash?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actualKnet?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  closingNotes?: string;
}
