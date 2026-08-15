import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLoyaltyProgramDto } from './dto/update-loyalty-program.dto';
import { CreateLoyaltyTransactionDto } from './dto/create-loyalty-transaction.dto';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getProgram() {
    let program = await this.prisma.loyaltyProgram.findFirst();
    if (!program) {
      program = await this.prisma.loyaltyProgram.create({
        data: {
          name: 'Bin Essa VIP Rewards',
          pointsPerKwd: 10.0,
          kwdPerPoint: 0.01,
          minPointsToRedeem: 100,
          isActive: true,
        },
      });
    }
    return program;
  }

  async updateProgram(dto: UpdateLoyaltyProgramDto) {
    const existing = await this.getProgram();
    return this.prisma.loyaltyProgram.update({
      where: { id: existing.id },
      data: dto,
    });
  }

  async getCustomerAccount(customerId: string) {
    let account = await this.prisma.loyaltyAccount.findUnique({
      where: { customerId },
      include: {
        transactions: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!account) {
      account = await this.prisma.loyaltyAccount.create({
        data: {
          customerId,
          pointsBalance: 0,
          tier: 'BRONZE',
        },
        include: {
          transactions: true,
        },
      });
    }

    return account;
  }

  async recordTransaction(dto: CreateLoyaltyTransactionDto) {
    const account = await this.getCustomerAccount(dto.customerId);

    const isAddition = dto.type === 'EARN' || dto.type === 'MANUAL_ADJUSTMENT';
    const pointDelta = isAddition ? Math.abs(dto.points) : -Math.abs(dto.points);

    if (!isAddition && account.pointsBalance < Math.abs(dto.points)) {
      throw new BadRequestException(`Insufficient loyalty points (${account.pointsBalance} points available)`);
    }

    return this.prisma.$transaction(async (tx) => {
      const newBalance = account.pointsBalance + pointDelta;

      // Tier computation
      let tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' = 'BRONZE';
      if (newBalance >= 5000) tier = 'PLATINUM';
      else if (newBalance >= 2000) tier = 'GOLD';
      else if (newBalance >= 500) tier = 'SILVER';

      await tx.loyaltyAccount.update({
        where: { id: account.id },
        data: {
          pointsBalance: newBalance,
          tier,
        },
      });

      return tx.loyaltyTransaction.create({
        data: {
          loyaltyAccountId: account.id,
          salesInvoiceId: dto.salesInvoiceId,
          points: Math.abs(dto.points),
          type: dto.type,
          notes: dto.notes,
        },
      });
    });
  }
}
