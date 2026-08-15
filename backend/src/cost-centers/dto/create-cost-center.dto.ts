import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CostCenterType } from '../../../generated/prisma/client';

export class CreateCostCenterDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(CostCenterType)
  @IsOptional()
  type?: CostCenterType;

  @IsOptional()
  @IsString()
  parentCostCenterId?: string;
}
