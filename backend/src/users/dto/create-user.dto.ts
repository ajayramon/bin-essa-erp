import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Role } from '../../../generated/prisma/client';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
