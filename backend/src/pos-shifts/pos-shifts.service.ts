import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenPosShiftDto } from './dto/create-pos-shift.dto';
import { ClosePosShiftDto } from './dto/close-pos-shift.dto';
import { ReopenPosShiftDto } from './dto/reopen-pos-shift.dto';
import { AdjustPosShiftDto } from './dto/adjust-pos-shift.dto';

@Injectable()
export class PosShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentShift(userId?: string, branchId?: string) {
    if (!userId || !branchId) return null;
    const shift = await this.prisma.posShift.findFirst({
      where: {
        userId,
        branchId,
        status: 'OPEN',
      },
      include: {
        user: { select: { id: true, fullName: true, username: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
    });
    return shift;
  }

  async openShift(dto: OpenPosShiftDto) {
    const existing = await this.getCurrentShift(dto.userId, dto.branchId);
    if (existing) {
      throw new BadRequestException(
        `Cashier already has an active open shift (${existing.shiftNumber})`,
      );
    }

    const count = await this.prisma.posShift.count();
    const shiftNumber = `SHIFT-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.posShift.create({
      data: {
        shiftNumber,
        userId: dto.userId,
        branchId: dto.branchId,
        openingFloat: dto.openingFloat,
        status: 'OPEN',
      },
      include: {
        user: { select: { id: true, fullName: true, username: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async closeShift(id: string, dto: ClosePosShiftDto) {
    const shift = await this.prisma.posShift.findUnique({
      where: { id },
      include: {
        user: true,
        branch: true,
      },
    });

    if (!shift) throw new NotFoundException(`POS Shift ${id} not found`);
    if (shift.status === 'CLOSED') {
      throw new BadRequestException(`POS Shift ${shift.shiftNumber} is already closed`);
    }

    // Find all invoices associated with this shift
    const invoices = await this.prisma.salesInvoice.findMany({
      where: {
        OR: [
          { posShiftId: shift.id },
          {
            branchId: shift.branchId,
            userId: shift.userId,
            createdAt: {
              gte: shift.openedAt,
            },
          },
        ],
      },
      include: {
        lines: true,
      },
    });

    let cashSalesTotal = 0;
    let knetSalesTotal = 0;
    let hesabiSalesTotal = 0;
    let tabbySalesTotal = 0;
    let cardSalesTotal = 0;
    let creditSalesTotal = 0;
    let otherSalesTotal = 0;
    let totalSales = 0;
    let returnsTotal = 0;
    let cashReturnsTotal = 0;
    let discountsTotal = 0;
    let giftsTotal = 0;
    let giftsCount = 0;

    for (const inv of invoices) {
      const amount = Number(inv.totalAmount);
      const discount = Number(inv.discountAmount || 0);
      discountsTotal += discount;

      if (inv.isReturn) {
        returnsTotal += amount;
        if (inv.paymentMethod === 'CASH') {
          cashReturnsTotal += amount;
        }
      } else {
        totalSales += amount;
        if (inv.paymentMethod === 'CASH') {
          cashSalesTotal += amount;
        } else if (inv.paymentMethod === 'KNET') {
          knetSalesTotal += amount;
        } else if (inv.paymentMethod === 'HESABI') {
          hesabiSalesTotal += amount;
        } else if (inv.paymentMethod === 'TABBY') {
          tabbySalesTotal += amount;
        } else if (inv.paymentMethod === 'CARD') {
          cardSalesTotal += amount;
        } else if (inv.paymentMethod === 'CREDIT') {
          creditSalesTotal += amount;
        } else {
          otherSalesTotal += amount;
        }
      }

      // Check gift items in line items
      for (const line of inv.lines) {
        if (Number(line.unitPrice) === 0) {
          giftsCount += Number(line.quantity);
          giftsTotal += Number(line.originalUnitPrice || 0) * Number(line.quantity);
        }
      }
    }

    const openingFloat = Number(shift.openingFloat);
    // Expected Cash = Opening Cash + Cash Sales - Cash Returns
    const closingCashExpected = openingFloat + cashSalesTotal - cashReturnsTotal;
    const closingCashActual = dto.closingCashActual !== undefined ? Number(dto.closingCashActual) : Number(dto.actualCash ?? 0);
    const cashVariance = closingCashActual - closingCashExpected;

    return this.prisma.$transaction(async (tx) => {
      // Link untagged invoices to this shift
      await tx.salesInvoice.updateMany({
        where: {
          branchId: shift.branchId,
          userId: shift.userId,
          createdAt: {
            gte: shift.openedAt,
          },
          posShiftId: null,
        },
        data: {
          posShiftId: shift.id,
        },
      });

      return tx.posShift.update({
        where: { id },
        data: {
          cashSalesTotal,
          knetSalesTotal,
          hesabiSalesTotal,
          tabbySalesTotal,
          cardSalesTotal,
          creditSalesTotal,
          otherSalesTotal,
          totalSales,
          returnsTotal,
          discountsTotal,
          giftsTotal,
          giftsCount,
          closingCashExpected,
          closingCashActual,
          cashVariance,
          notes: dto.notes,
          status: 'CLOSED',
          closedAt: new Date(),
        },
        include: {
          user: { select: { id: true, fullName: true, username: true } },
          branch: { select: { id: true, name: true, code: true } },
        },
      });
    });
  }

  async reopenShift(id: string, dto: ReopenPosShiftDto) {
    // Only Admin or Branch Manager can reopen
    const normalizedRole = (dto.userRole || '').toUpperCase();
    if (normalizedRole !== 'ADMIN' && normalizedRole !== 'MANAGER' && normalizedRole !== 'BRANCH_MANAGER') {
      throw new ForbiddenException(
        'Permission denied: Only Admin or authorized Manager can reopen a closed shift.',
      );
    }

    const shift = await this.prisma.posShift.findUnique({
      where: { id },
      include: { user: true, branch: true },
    });

    if (!shift) throw new NotFoundException(`POS Shift ${id} not found`);
    if (shift.status === 'OPEN') {
      throw new BadRequestException(`POS Shift ${shift.shiftNumber} is already open`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: dto.userId,
          action: 'SHIFT_REOPEN',
          entity: 'PosShift',
          entityId: shift.id,
          details: JSON.stringify({
            shiftNumber: shift.shiftNumber,
            reason: dto.reason,
            reopenedByUserId: dto.userId,
            reopenedByRole: dto.userRole,
            previousClosedAt: shift.closedAt,
            closingCashExpected: shift.closingCashExpected,
            closingCashActual: shift.closingCashActual,
            cashVariance: shift.cashVariance,
          }),
        },
      });

      return tx.posShift.update({
        where: { id },
        data: {
          status: 'OPEN',
          reopenedAt: new Date(),
          reopenedByUserId: dto.userId,
          adjustmentReason: dto.reason,
        },
        include: {
          user: { select: { id: true, fullName: true, username: true } },
          branch: { select: { id: true, name: true, code: true } },
        },
      });
    });
  }

  async adjustShift(id: string, dto: AdjustPosShiftDto) {
    // Only Admin or Branch Manager can adjust
    const normalizedRole = (dto.userRole || '').toUpperCase();
    if (normalizedRole !== 'ADMIN' && normalizedRole !== 'MANAGER' && normalizedRole !== 'BRANCH_MANAGER') {
      throw new ForbiddenException(
        'Permission denied: Only Admin or authorized Manager can adjust a closed shift.',
      );
    }

    const shift = await this.prisma.posShift.findUnique({
      where: { id },
      include: { user: true, branch: true },
    });

    if (!shift) throw new NotFoundException(`POS Shift ${id} not found`);

    const newClosingActual = Number(dto.closingCashActual);
    const expected = Number(shift.closingCashExpected);
    const newVariance = newClosingActual - expected;

    return this.prisma.$transaction(async (tx) => {
      // Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: dto.userId,
          action: 'SHIFT_ADJUSTMENT',
          entity: 'PosShift',
          entityId: shift.id,
          details: JSON.stringify({
            shiftNumber: shift.shiftNumber,
            reason: dto.reason,
            adjustedByUserId: dto.userId,
            adjustedByRole: dto.userRole,
            oldClosingCashActual: shift.closingCashActual,
            newClosingCashActual: newClosingActual,
            oldCashVariance: shift.cashVariance,
            newCashVariance: newVariance,
          }),
        },
      });

      return tx.posShift.update({
        where: { id },
        data: {
          closingCashActual: newClosingActual,
          cashVariance: newVariance,
          adjustedAt: new Date(),
          adjustedByUserId: dto.userId,
          adjustmentReason: dto.reason,
        },
        include: {
          user: { select: { id: true, fullName: true, username: true } },
          branch: { select: { id: true, name: true, code: true } },
        },
      });
    });
  }

  async findAllShifts(branchId?: string) {
    return this.prisma.posShift.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        user: { select: { id: true, fullName: true, username: true } },
        branch: { select: { id: true, name: true, code: true } },
      },
      orderBy: { openedAt: 'desc' },
    });
  }
}
