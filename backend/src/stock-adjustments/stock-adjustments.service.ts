import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';

@Injectable()
export class StockAdjustmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.stockAdjustment.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        branch: true,
        lines: {
          include: { item: true },
        },
        journalEntry: {
          include: {
            lines: { include: { account: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const adj = await this.prisma.stockAdjustment.findUnique({
      where: { id },
      include: {
        branch: true,
        lines: {
          include: { item: true },
        },
        journalEntry: {
          include: {
            lines: { include: { account: true } },
          },
        },
      },
    });
    if (!adj) throw new NotFoundException(`Stock adjustment ${id} not found`);
    return adj;
  }

  async create(dto: CreateStockAdjustmentDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Stock adjustment must contain at least one line');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalValue = 0;
      const lineCreates: any[] = [];

      for (const line of dto.lines) {
        const item = await tx.item.findUnique({ where: { id: line.itemId } });
        if (!item) throw new NotFoundException(`Item ${line.itemId} not found`);

        const unitCost = line.unitCost !== undefined ? Number(line.unitCost) : Number(item.cost);
        const lineTotal = Math.abs(line.quantityChange * unitCost);
        totalValue += lineTotal;

        // Update branch stock
        const currentStock = await tx.itemStock.findUnique({
          where: {
            itemId_branchId: {
              itemId: line.itemId,
              branchId: dto.branchId,
            },
          },
        });

        const newStockQty = Number(currentStock?.quantity || 0) + line.quantityChange;

        await tx.itemStock.upsert({
          where: {
            itemId_branchId: {
              itemId: line.itemId,
              branchId: dto.branchId,
            },
          },
          create: {
            itemId: line.itemId,
            branchId: dto.branchId,
            quantity: newStockQty,
          },
          update: {
            quantity: newStockQty,
          },
        });

        // Update overall item stock quantity
        await tx.item.update({
          where: { id: line.itemId },
          data: {
            stockQuantity: {
              increment: line.quantityChange,
            },
          },
        });

        // Create Inventory Movement
        await tx.inventoryMovement.create({
          data: {
            itemId: line.itemId,
            branchId: dto.branchId,
            movementType: line.quantityChange >= 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
            quantity: Math.abs(line.quantityChange),
            unitCost,
            totalCost: lineTotal,
            referenceType: 'StockAdjustment',
            referenceId: dto.adjustmentNumber,
            notes: dto.notes || `Stock adjustment: ${dto.reason || 'COUNT_CORRECTION'}`,
          },
        });

        lineCreates.push({
          itemId: line.itemId,
          quantityChange: line.quantityChange,
          unitCost,
          totalCost: lineTotal,
        });
      }

      // Create Stock Adjustment Record
      const adjustment = await tx.stockAdjustment.create({
        data: {
          adjustmentNumber: dto.adjustmentNumber,
          branchId: dto.branchId,
          reason: dto.reason || 'COUNT_CORRECTION',
          status: 'POSTED',
          totalValue,
          notes: dto.notes,
          lines: {
            create: lineCreates,
          },
        },
      });

      // Ensure GL Accounts exist for Inventory & Shrinkage / Inventory Adjustment
      let inventoryAccount = await tx.account.findUnique({ where: { code: '1200' } });
      if (!inventoryAccount) {
        inventoryAccount = await tx.account.create({
          data: { code: '1200', name: 'Inventory Asset', type: 'ASSET' },
        });
      }

      let adjustmentExpenseAccount = await tx.account.findUnique({ where: { code: '5200' } });
      if (!adjustmentExpenseAccount) {
        adjustmentExpenseAccount = await tx.account.create({
          data: { code: '5200', name: 'Inventory Shrinkage & Adjustment', type: 'EXPENSE' },
        });
      }

      // If totalValue > 0, post balanced double entry
      if (totalValue > 0) {
        const isNetLoss = dto.lines.reduce((s, l) => s + l.quantityChange, 0) < 0;

        await tx.journalEntry.create({
          data: {
            reference: `JE-ADJ-${dto.adjustmentNumber}`,
            description: `Stock Adjustment: ${dto.adjustmentNumber} (${dto.reason || 'COUNT_CORRECTION'})`,
            branchId: dto.branchId,
            stockAdjustmentId: adjustment.id,
            lines: {
              create: [
                {
                  accountId: isNetLoss ? adjustmentExpenseAccount.id : inventoryAccount.id,
                  debit: totalValue,
                  credit: 0,
                },
                {
                  accountId: isNetLoss ? inventoryAccount.id : adjustmentExpenseAccount.id,
                  debit: 0,
                  credit: totalValue,
                },
              ],
            },
          },
        });
      }

      return tx.stockAdjustment.findUnique({
        where: { id: adjustment.id },
        include: {
          lines: { include: { item: true } },
          journalEntry: {
            include: { lines: { include: { account: true } } },
          },
        },
      });
    });
  }
}
