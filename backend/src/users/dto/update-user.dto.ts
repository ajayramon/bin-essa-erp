import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Role } from '../../../generated/prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateRolePermissionDto {
  @IsEnum(Role)
  role: Role;

  @IsString({ each: true })
  modules: string[];
}
