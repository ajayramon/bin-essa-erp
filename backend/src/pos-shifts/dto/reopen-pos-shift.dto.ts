import { IsNotEmpty, IsString } from 'class-validator';

export class ReopenPosShiftDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userRole: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
