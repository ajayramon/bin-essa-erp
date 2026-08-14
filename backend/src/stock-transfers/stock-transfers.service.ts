import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockTransferDto } from './dto/create-stock-transfer.dto';

@Injectable()
export class StockTransfersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStockTransferDto) {
    if (dto.fromBranchId === dto.toBranchId) {
      throw new BadRequestException('Source and destination branches must be different.');
    }

    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('Transfer must contain at least one line item.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Verify stock availability at source branch
      for (const line of dto.lines) {
        const sourceStock = await tx.itemStock.findUnique({
          where: {
            itemId_branchId: { itemId: line.itemId, branchId: dto.fromBranchId },
          },
        });

        const currentQty = sourceStock ? Number(sourceStock.quantity) : 0;
        if (currentQty < line.quantity) {
          throw new BadRequestException(
            `Insufficient stock for item ${line.itemId} at source branch. Available: ${currentQty}, Requested: ${line.quantity}`,
          );
        }
      }

      // 2. Perform atomic transfer updates on ItemStock
      for (const line of dto.lines) {
        // Decrement source branch stock
        await tx.itemStock.update({
          where: {
            itemId_branchId: { itemId: line.itemId, branchId: dto.fromBranchId },
          },
          data: {
            quantity: { decrement: line.quantity },
          },
        });

        // Increment destination branch stock
        await tx.itemStock.upsert({
          where: {
            itemId_branchId: { itemId: line.itemId, branchId: dto.toBranchId },
          },
          update: {
            quantity: { increment: line.quantity },
          },
          create: {
            itemId: line.itemId,
            branchId: dto.toBranchId,
            quantity: line.quantity,
          },
        });
      }

      // 3. Create StockTransfer record
      const transfer = await tx.stockTransfer.create({
        data: {
          transferNumber: dto.transferNumber,
          fromBranchId: dto.fromBranchId,
          toBranchId: dto.toBranchId,
          notes: dto.notes,
          status: 'RECEIVED',
          dispatchedAt: new Date(),
          receivedAt: new Date(),
          lines: {
            create: dto.lines.map((l) => ({
              itemId: l.itemId,
              quantityRequested: l.quantity,
              quantityDispatched: l.quantity,
              quantityReceived: l.quantity,
            })),
          },
        },
        include: {
          lines: {
            include: {
              item: true,
            },
          },
        },
      });

      return transfer;
    });
  }

  async findAll(branchId?: string) {
    return this.prisma.stockTransfer.findMany({
      where: branchId ? { OR: [{ fromBranchId: branchId }, { toBranchId: branchId }] } : undefined,
      include: {
        lines: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: {
        lines: {
          include: { item: true },
        },
      },
    });

    if (!transfer) {
      throw new NotFoundException(`Stock transfer with ID "${id}" not found.`);
    }

    return transfer;
  }
}
