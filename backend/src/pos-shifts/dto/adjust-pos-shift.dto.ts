import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AdjustPosShiftDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userRole: string;

  @IsNumber()
  @Min(0)
  closingCashActual: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
