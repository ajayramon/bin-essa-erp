import { IsString, IsNumber, Min } from 'class-validator';

export class OpenPosShiftDto {
  @IsString()
  userId: string;

  @IsString()
  branchId: string;

  @IsNumber()
  @Min(0)
  openingFloat: number;
}
