import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';

@Injectable()
export class DeliveryNotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.deliveryNote.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const dn = await this.prisma.deliveryNote.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        lines: { include: { item: true } },
      },
    });
    if (!dn) throw new NotFoundException(`Delivery note ${id} not found`);
    return dn;
  }

  async create(dto: CreateDeliveryNoteDto) {
    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Delivery note must contain at least one line');
    }

    return this.prisma.$transaction(async (tx) => {
      const lineData: any[] = [];

      for (const line of dto.lines) {
        const item = await tx.item.findUnique({ where: { id: line.itemId } });
        if (!item) throw new NotFoundException(`Item ${line.itemId} not found`);

        // Decrement item stock
        await tx.item.update({
          where: { id: line.itemId },
          data: { stockQuantity: { decrement: line.quantity } },
        });

        // Decrement branch stock
        const currentStock = await tx.itemStock.findUnique({
          where: {
            itemId_branchId: {
              itemId: line.itemId,
              branchId: dto.branchId,
            },
          },
        });

        const newStockQty = Number(currentStock?.quantity || 0) - line.quantity;

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
            movementType: 'SALE',
            quantity: line.quantity,
            unitCost: Number(item.cost),
            totalCost: line.quantity * Number(item.cost),
            referenceType: 'DeliveryNote',
            referenceId: dto.deliveryNumber,
            notes: dto.notes || `Fulfillment: ${dto.deliveryNumber}`,
          },
        });

        lineData.push({
          itemId: line.itemId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        });
      }

      return tx.deliveryNote.create({
        data: {
          deliveryNumber: dto.deliveryNumber,
          customerId: dto.customerId,
          branchId: dto.branchId,
          salesOrderId: dto.salesOrderId,
          status: 'DELIVERED',
          notes: dto.notes,
          lines: {
            create: lineData,
          },
        },
        include: {
          customer: true,
          branch: true,
          lines: { include: { item: true } },
        },
      });
    });
  }
}
