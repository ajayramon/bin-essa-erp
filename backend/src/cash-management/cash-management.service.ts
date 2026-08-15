import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCashAccountDto } from './dto/create-cash-account.dto';
import { CreateCashTransferDto } from './dto/create-cash-transfer.dto';

@Injectable()
export class CashManagementService {
  constructor(private prisma: PrismaService) {}

  async findAllAccounts(branchId?: string) {
    return this.prisma.cashAccount.findMany({
      where: branchId ? { OR: [{ branchId }, { isMain: true }] } : undefined,
      include: { branch: true },
      orderBy: { isMain: 'desc' },
    });
  }

  async createAccount(dto: CreateCashAccountDto) {
    return this.prisma.cashAccount.create({
      data: {
        code: dto.code,
        name: dto.name,
        branchId: dto.branchId,
        balance: dto.balance || 0,
        isMain: dto.isMain ?? false,
      },
    });
  }

  async findAllTransfers(branchId?: string) {
    return this.prisma.cashTransfer.findMany({
      where: branchId
        ? {
            OR: [
              { fromCashAccount: { branchId } },
              { toCashAccount: { branchId } },
            ],
          }
        : undefined,
      include: {
        fromCashAccount: { include: { branch: true } },
        toCashAccount: { include: { branch: true } },
        journalEntry: {
          include: {
            lines: { include: { account: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTransfer(dto: CreateCashTransferDto) {
    if (dto.fromCashAccountId === dto.toCashAccountId) {
      throw new BadRequestException('Source and destination cash accounts must be different');
    }

    return this.prisma.$transaction(async (tx) => {
      const fromAcc = await tx.cashAccount.findUnique({ where: { id: dto.fromCashAccountId } });
      const toAcc = await tx.cashAccount.findUnique({ where: { id: dto.toCashAccountId } });

      if (!fromAcc) throw new NotFoundException('Source cash account not found');
      if (!toAcc) throw new NotFoundException('Destination cash account not found');

      if (Number(fromAcc.balance) < dto.amount) {
        throw new BadRequestException(`Insufficient funds in source account (${Number(fromAcc.balance).toFixed(3)} KD available)`);
      }

      await tx.cashAccount.update({
        where: { id: fromAcc.id },
        data: { balance: { decrement: dto.amount } },
      });

      await tx.cashAccount.update({
        where: { id: toAcc.id },
        data: { balance: { increment: dto.amount } },
      });

      const transfer = await tx.cashTransfer.create({
        data: {
          transferNumber: dto.transferNumber,
          fromCashAccountId: dto.fromCashAccountId,
          toCashAccountId: dto.toCashAccountId,
          amount: dto.amount,
          notes: dto.notes,
          status: 'COMPLETED',
        },
      });

      // GL accounts
      let cashAccount = await tx.account.findUnique({ where: { code: '1000' } });
      if (!cashAccount) {
        cashAccount = await tx.account.create({
          data: { code: '1000', name: 'Cash on Hand', type: 'ASSET' },
        });
      }

      // Create Balanced Double Entry
      await tx.journalEntry.create({
        data: {
          reference: `JE-CTX-${dto.transferNumber}`,
          description: `Cash Transfer: ${fromAcc.name} -> ${toAcc.name} (${dto.transferNumber})`,
          branchId: fromAcc.branchId || toAcc.branchId,
          cashTransferId: transfer.id,
          lines: {
            create: [
              {
                accountId: cashAccount.id,
                debit: dto.amount,
                credit: 0,
              },
              {
                accountId: cashAccount.id,
                debit: 0,
                credit: dto.amount,
              },
            ],
          },
        },
      });

      return tx.cashTransfer.findUnique({
        where: { id: transfer.id },
        include: {
          fromCashAccount: true,
          toCashAccount: true,
          journalEntry: {
            include: { lines: { include: { account: true } } },
          },
        },
      });
    });
  }
}
