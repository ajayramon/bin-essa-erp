import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.account.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async getLedger(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const lines = await this.prisma.journalEntryLine.findMany({
      where: { accountId },
      include: { journalEntry: true },
      orderBy: { journalEntry: { date: 'asc' } },
    });

    const debitNormal = account.type === 'ASSET' || account.type === 'EXPENSE';
    let runningBalance = 0;

    const entries = lines.map((line) => {
      const debit = Number(line.debit);
      const credit = Number(line.credit);
      runningBalance += debitNormal ? debit - credit : credit - debit;
      return {
        journalEntryId: line.journalEntryId,
        reference: line.journalEntry.reference,
        date: line.journalEntry.date,
        description: line.journalEntry.description,
        debit,
        credit,
        runningBalance,
      };
    });

    return {
      account: { id: account.id, code: account.code, name: account.name, type: account.type },
      entries,
    };
  }
}
