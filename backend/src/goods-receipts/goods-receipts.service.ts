import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';

@Injectable()
export class GoodsReceiptsService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.goodsReceiptNote.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        supplier: true,
        branch: true,
        lines: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const grn = await this.prisma.goodsReceiptNote.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: true,
        lines: { include: { item: true } },
      },
    });
    if (!grn) throw new NotFoundException(`Goods receipt note ${id} not found`);
    return grn;
  }

  async create(dto: CreateGoodsReceiptDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Goods receipt must contain at least one line');
    }

    return this.prisma.$transaction(async (tx) => {
      const lineData: any[] = [];

      for (const line of dto.lines) {
        const item = await tx.item.findUnique({ where: { id: line.itemId } });
        if (!item) throw new NotFoundException(`Item ${line.itemId} not found`);

        const lineTotal = line.quantityReceived * line.unitCost;

        // Increase item stock
        await tx.item.update({
          where: { id: line.itemId },
          data: { stockQuantity: { increment: line.quantityReceived } },
        });

        // Increase branch stock
        const currentStock = await tx.itemStock.findUnique({
          where: {
            itemId_branchId: {
              itemId: line.itemId,
              branchId: dto.branchId,
            },
          },
        });

        const newStockQty = Number(currentStock?.quantity || 0) + line.quantityReceived;

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

        // Record Inventory Movement
        await tx.inventoryMovement.create({
          data: {
            itemId: line.itemId,
            branchId: dto.branchId,
            movementType: 'PURCHASE',
            quantity: line.quantityReceived,
            unitCost: line.unitCost,
            totalCost: lineTotal,
            referenceType: 'GoodsReceiptNote',
            referenceId: dto.grnNumber,
            notes: dto.notes || `Goods Receipt: ${dto.grnNumber}`,
          },
        });

        lineData.push({
          itemId: line.itemId,
          quantityReceived: line.quantityReceived,
          unitCost: line.unitCost,
          lineTotal,
        });
      }

      return tx.goodsReceiptNote.create({
        data: {
          grnNumber: dto.grnNumber,
          supplierId: dto.supplierId,
          branchId: dto.branchId,
          purchaseOrderId: dto.purchaseOrderId,
          status: 'RECEIVED',
          notes: dto.notes,
          lines: {
            create: lineData,
          },
        },
        include: {
          supplier: true,
          branch: true,
          lines: { include: { item: true } },
        },
      });
    });
  }
}
