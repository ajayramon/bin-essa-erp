import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenPosShiftDto } from './dto/create-pos-shift.dto';
import { ClosePosShiftDto } from './dto/close-pos-shift.dto';

@Injectable()
export class PosShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentShift(userId: string, branchId: string) {
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
      throw new BadRequestException(`Cashier already has an active open shift (${existing.shiftNumber})`);
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

    // Calculate total sales for this shift from SalesInvoice
    const invoices = await this.prisma.salesInvoice.findMany({
      where: {
        branchId: shift.branchId,
        userId: shift.userId,
        createdAt: {
          gte: shift.openedAt,
        },
      },
    });

    let cashSalesTotal = 0;
    let cardSalesTotal = 0;
    let creditSalesTotal = 0;

    for (const inv of invoices) {
      const amount = Number(inv.totalAmount);
      if (inv.paymentMethod === 'CASH') {
        cashSalesTotal += amount;
      } else if (inv.paymentMethod === 'CARD') {
        cardSalesTotal += amount;
      } else if (inv.paymentMethod === 'CREDIT') {
        creditSalesTotal += amount;
      } else {
        cashSalesTotal += amount;
      }
    }

    const openingFloat = Number(shift.openingFloat);
    const closingCashExpected = openingFloat + cashSalesTotal;
    const cashVariance = dto.closingCashActual - closingCashExpected;

    return this.prisma.posShift.update({
      where: { id },
      data: {
        cashSalesTotal,
        cardSalesTotal,
        creditSalesTotal,
        closingCashExpected,
        closingCashActual: dto.closingCashActual,
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
