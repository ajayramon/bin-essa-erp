import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { CreateBankTransactionDto } from './dto/create-bank-transaction.dto';
import { CreateBankReconciliationDto } from './dto/create-bank-reconciliation.dto';

@Injectable()
export class BankManagementService {
  constructor(private prisma: PrismaService) {}

  async findAllAccounts() {
    return this.prisma.bankAccount.findMany({
      include: {
        transactions: { take: 10, orderBy: { transactionDate: 'desc' } },
        reconciliations: { take: 5, orderBy: { statementDate: 'desc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOneAccount(id: string) {
    const acc = await this.prisma.bankAccount.findUnique({
      where: { id },
      include: {
        transactions: { orderBy: { transactionDate: 'desc' } },
        reconciliations: { orderBy: { statementDate: 'desc' } },
      },
    });
    if (!acc) throw new NotFoundException(`Bank account ${id} not found`);
    return acc;
  }

  async createAccount(dto: CreateBankAccountDto) {
    return this.prisma.bankAccount.create({
      data: {
        code: dto.code,
        name: dto.name,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        iban: dto.iban,
        balance: dto.balance || 0,
        currency: dto.currency || 'KWD',
      },
    });
  }

  async createTransaction(dto: CreateBankTransactionDto) {
    const bankAccount = await this.prisma.bankAccount.findUnique({ where: { id: dto.bankAccountId } });
    if (!bankAccount) throw new NotFoundException('Bank account not found');

    const isDeposit = dto.type === 'DEPOSIT' || dto.type === 'INTEREST';
    const amountChange = isDeposit ? dto.amount : -dto.amount;

    return this.prisma.$transaction(async (tx) => {
      await tx.bankAccount.update({
        where: { id: dto.bankAccountId },
        data: { balance: { increment: amountChange } },
      });

      return tx.bankTransaction.create({
        data: {
          bankAccountId: dto.bankAccountId,
          type: dto.type,
          amount: dto.amount,
          reference: dto.reference,
          notes: dto.notes,
        },
      });
    });
  }

  async createReconciliation(dto: CreateBankReconciliationDto) {
    const bankAccount = await this.prisma.bankAccount.findUnique({ where: { id: dto.bankAccountId } });
    if (!bankAccount) throw new NotFoundException('Bank account not found');

    const bookBalance = Number(bankAccount.balance);
    const difference = dto.statementEndingBalance - bookBalance;
    const isReconciled = Math.abs(difference) < 0.001;

    return this.prisma.$transaction(async (tx) => {
      const recon = await tx.bankReconciliation.create({
        data: {
          bankAccountId: dto.bankAccountId,
          statementDate: new Date(),
          statementEndingBalance: dto.statementEndingBalance,
          bookBalance,
          difference,
          status: isReconciled ? 'RECONCILED' : 'DRAFT',
          notes: dto.notes,
        },
      });

      if (dto.matchedTransactionIds && dto.matchedTransactionIds.length > 0) {
        for (const txId of dto.matchedTransactionIds) {
          await tx.bankReconciliationItem.create({
            data: {
              reconciliationId: recon.id,
              transactionId: txId,
              matched: true,
            },
          });
          await tx.bankTransaction.update({
            where: { id: txId },
            data: { isReconciled: true },
          });
        }
      }

      return tx.bankReconciliation.findUnique({
        where: { id: recon.id },
        include: {
          bankAccount: true,
          items: { include: { transaction: true } },
        },
      });
    });
  }
}
