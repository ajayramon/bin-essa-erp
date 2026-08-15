import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLoyaltyProgramDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0.1)
  pointsPerKwd!: number;

  @IsNumber()
  @Min(0.001)
  kwdPerPoint!: number;

  @IsNumber()
  @Min(1)
  minPointsToRedeem!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
