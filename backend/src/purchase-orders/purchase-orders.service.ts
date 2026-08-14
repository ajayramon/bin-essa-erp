import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string) {
    return this.prisma.purchaseOrder.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        supplier: true,
        branch: true,
        lines: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: true,
        lines: {
          include: {
            item: true,
          },
        },
        journalEntry: {
          include: {
            lines: {
              include: {
                account: true,
              },
            },
          },
        },
      },
    });

    if (!po) {
      throw new NotFoundException(`Purchase order with ID "${id}" not found.`);
    }

    return po;
  }

  async create(dto: CreatePurchaseOrderDto) {
    const lineData = dto.lines.map((line) => {
      const lineTotal = line.quantity * line.unitCost;
      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitCost: line.unitCost,
        lineTotal,
      };
    });

    const subtotal = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
    const taxAmount = dto.taxAmount ?? 0;
    const totalAmount = subtotal + taxAmount;

    try {
      return await this.prisma.purchaseOrder.create({
        data: {
          poNumber: dto.poNumber,
          supplierId: dto.supplierId,
          branchId: dto.branchId,
          status: dto.status ?? 'POSTED',
          subtotal,
          taxAmount,
          totalAmount,
          lines: {
            create: lineData,
          },
        },
        include: {
          lines: {
            include: {
              item: true,
            },
          },
          supplier: true,
          branch: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Purchase order number "${dto.poNumber}" already exists.`,
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Invalid supplier or item reference — please check the IDs provided.',
          );
        }
      }
      throw error;
    }
  }
}
