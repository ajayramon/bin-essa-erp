import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCommissionRuleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  minAmount!: number;

  @IsNumber()
  @Min(0)
  maxAmount!: number;

  @IsNumber()
  @Min(0)
  commissionPercent!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedBonus?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
