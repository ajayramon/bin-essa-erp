import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HrPayrollService } from './hr-payroll.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';

@Controller('hr')
@UseGuards(JwtAuthGuard)
export class HrPayrollController {
  constructor(private readonly hrService: HrPayrollService) {}

  @Get('employees')
  findAllEmployees(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.hrService.findAllEmployees(effectiveBranchId);
  }

  @Get('employees/:id')
  findOneEmployee(@Param('id') id: string) {
    return this.hrService.findOneEmployee(id);
  }

  @Post('employees')
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.hrService.createEmployee(dto);
  }

  @Post('attendance')
  recordAttendance(@Body() dto: CreateAttendanceDto) {
    return this.hrService.recordAttendance(dto);
  }

  @Post('leave-requests')
  createLeaveRequest(@Body() dto: CreateLeaveRequestDto) {
    return this.hrService.createLeaveRequest(dto);
  }

  @Get('payroll')
  findAllPayrollPeriods() {
    return this.hrService.findAllPayrollPeriods();
  }

  @Post('payroll/generate')
  generatePayrollPeriod(@Body() dto: CreatePayrollPeriodDto) {
    return this.hrService.generatePayrollPeriod(dto);
  }
}
