import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { LeaveType } from '../../../generated/prisma/client';

export class CreateLeaveRequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsEnum(LeaveType)
  @IsOptional()
  leaveType?: LeaveType;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsInt()
  @Min(1)
  daysCount!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
