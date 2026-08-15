import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesTargetDto } from './dto/create-sales-target.dto';
import { CreateCommissionRuleDto } from './dto/create-commission-rule.dto';

@Injectable()
export class CommissionsService {
  constructor(private prisma: PrismaService) {}

  async findAllTargets(branchId?: string) {
    return this.prisma.salesTarget.findMany({
      where: branchId ? { branchId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTarget(dto: CreateSalesTargetDto) {
    return this.prisma.salesTarget.create({
      data: {
        userId: dto.userId,
        branchId: dto.branchId,
        targetPeriod: dto.targetPeriod || 'MONTHLY',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        targetAmount: dto.targetAmount,
      },
    });
  }

  async findAllRules() {
    return this.prisma.commissionRule.findMany({
      orderBy: { minAmount: 'asc' },
    });
  }

  async createRule(dto: CreateCommissionRuleDto) {
    return this.prisma.commissionRule.create({
      data: dto,
    });
  }

  async calculateUserCommission(userId: string, period: string, startDate: Date, endDate: Date) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const invoices = await this.prisma.salesInvoice.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalSales = 0;
    let returnsDeduction = 0;

    for (const inv of invoices) {
      const amount = Number(inv.totalAmount);
      if (inv.isReturn) {
        returnsDeduction += amount;
      } else {
        totalSales += amount;
      }
    }

    const netSales = Math.max(0, totalSales - returnsDeduction);

    // Fetch rules
    const rules = await this.prisma.commissionRule.findMany({
      where: { isActive: true },
      orderBy: { minAmount: 'asc' },
    });

    let commissionEarned = 0;
    for (const rule of rules) {
      if (netSales >= Number(rule.minAmount) && netSales <= Number(rule.maxAmount)) {
        commissionEarned = (netSales * Number(rule.commissionPercent)) / 100 + Number(rule.fixedBonus || 0);
        break;
      }
    }

    // Default fallback if no custom rule: 3% commission
    if (rules.length === 0) {
      commissionEarned = netSales * 0.03;
    }

    // Record calculation
    return this.prisma.commissionCalculation.create({
      data: {
        userId,
        period,
        totalSales,
        returnsDeduction,
        netSales,
        commissionEarned,
        status: 'APPROVED',
      },
    });
  }
}
