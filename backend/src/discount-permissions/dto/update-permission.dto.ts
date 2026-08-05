import { IsNumber, IsBoolean, IsArray, IsString, Min, Max } from 'class-validator';

export class UpdateDiscountPermissionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  maxDiscountPercent: number;

  @IsBoolean()
  canEditPrices: boolean;

  @IsBoolean()
  requiresManagerApproval: boolean;

  @IsArray()
  @IsString({ each: true })
  allowedBranchIds: string[];
}

export class VerifyManagerPinDto {
  @IsString()
  passcode: string;
}
