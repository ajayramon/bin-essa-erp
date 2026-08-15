import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';

@Injectable()
export class HrPayrollService {
  constructor(private prisma: PrismaService) {}

  // Employees
  async findAllEmployees(branchId?: string) {
    return this.prisma.employee.findMany({
      where: branchId ? { branchId } : undefined,
      include: { branch: true },
      orderBy: { code: 'asc' },
    });
  }

  async findOneEmployee(id: string) {
    const emp = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        branch: true,
        attendances: { take: 30, orderBy: { date: 'desc' } },
        leaveRequests: { orderBy: { startDate: 'desc' } },
        payrollSlips: { take: 12, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!emp) throw new NotFoundException(`Employee ${id} not found`);
    return emp;
  }

  async createEmployee(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        code: dto.code,
        name: dto.name,
        civilId: dto.civilId,
        position: dto.position,
        department: dto.department,
        branchId: dto.branchId,
        basicSalary: dto.basicSalary,
        housingAllowance: dto.housingAllowance || 0,
        transportAllowance: dto.transportAllowance || 0,
        otherAllowances: dto.otherAllowances || 0,
        hireDate: dto.hireDate ? new Date(dto.hireDate) : new Date(),
      },
    });
  }

  // Attendance
  async recordAttendance(dto: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: {
        employeeId: dto.employeeId,
        date: new Date(dto.date),
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        hoursWorked: dto.hoursWorked || 8.0,
        overtimeHours: dto.overtimeHours || 0,
        status: dto.status || 'PRESENT',
      },
    });
  }

  // Leave Requests
  async createLeaveRequest(dto: CreateLeaveRequestDto) {
    return this.prisma.leaveRequest.create({
      data: {
        employeeId: dto.employeeId,
        leaveType: dto.leaveType || 'ANNUAL',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        daysCount: dto.daysCount,
        status: 'APPROVED',
        notes: dto.notes,
      },
    });
  }

  // Payroll
  async findAllPayrollPeriods() {
    return this.prisma.payrollPeriod.findMany({
      include: {
        slips: { include: { employee: true } },
        journalEntry: {
          include: { lines: { include: { account: true } } },
        },
      },
      orderBy: { year: 'desc', month: 'desc' },
    });
  }

  async generatePayrollPeriod(dto: CreatePayrollPeriodDto) {
    const employees = await this.prisma.employee.findMany({
      where: {
        isActive: true,
        branchId: dto.branchId ? dto.branchId : undefined,
      },
    });

    if (employees.length === 0) {
      throw new BadRequestException('No active employees found for this payroll period');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;

      const slipData: any[] = [];

      for (const emp of employees) {
        const basic = Number(emp.basicSalary);
        const allowances = Number(emp.housingAllowance) + Number(emp.transportAllowance) + Number(emp.otherAllowances);
        const deductions = 0;
        const overtimeAmount = 0;
        const commissionAmount = 0;
        const net = basic + allowances + overtimeAmount + commissionAmount - deductions;

        totalGross += basic + allowances + overtimeAmount + commissionAmount;
        totalDeductions += deductions;
        totalNet += net;

        slipData.push({
          employeeId: emp.id,
          basicSalary: basic,
          allowances,
          deductions,
          overtimeAmount,
          commissionAmount,
          netSalary: net,
          status: 'PAID',
        });
      }

      const payroll = await tx.payrollPeriod.create({
        data: {
          periodName: dto.periodName,
          month: dto.month,
          year: dto.year,
          totalGross,
          totalDeductions,
          totalNet,
          status: 'POSTED',
          slips: {
            create: slipData,
          },
        },
      });

      // Ensure GL accounts exist
      let salaryExpenseAccount = await tx.account.findUnique({ where: { code: '5100' } });
      if (!salaryExpenseAccount) {
        salaryExpenseAccount = await tx.account.create({
          data: { code: '5100', name: 'Salaries & Wages Expense', type: 'EXPENSE' },
        });
      }

      let cashAccount = await tx.account.findUnique({ where: { code: '1000' } });
      if (!cashAccount) {
        cashAccount = await tx.account.create({
          data: { code: '1000', name: 'Cash on Hand', type: 'ASSET' },
        });
      }

      // Auto-post balanced journal entry
      await tx.journalEntry.create({
        data: {
          reference: `JE-PAYROLL-${dto.year}-${String(dto.month).padStart(2, '0')}-${payroll.id.slice(0, 8)}`,
          description: `Payroll Posting: ${dto.periodName}`,
          payrollPeriodId: payroll.id,
          lines: {
            create: [
              {
                accountId: salaryExpenseAccount.id,
                debit: totalNet,
                credit: 0,
              },
              {
                accountId: cashAccount.id,
                debit: 0,
                credit: totalNet,
              },
            ],
          },
        },
      });

      return tx.payrollPeriod.findUnique({
        where: { id: payroll.id },
        include: {
          slips: { include: { employee: true } },
          journalEntry: {
            include: { lines: { include: { account: true } } },
          },
        },
      });
    });
  }
}
