import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '../../generated/prisma/client';

const DEBIT_NORMAL_TYPES: AccountType[] = [AccountType.ASSET, AccountType.EXPENSE];

@Injectable()
export class TrialBalanceService {
  constructor(private prisma: PrismaService) {}

  async getTrialBalance() {
    const accounts = await this.prisma.account.findMany({
      orderBy: { code: 'asc' },
    });

    const sums = await this.prisma.journalEntryLine.groupBy({
      by: ['accountId'],
      _sum: { debit: true, credit: true },
    });

    const sumsByAccount = new Map(
      sums.map((s) => [
        s.accountId,
        {
          totalDebit: Number(s._sum.debit ?? 0),
          totalCredit: Number(s._sum.credit ?? 0),
        },
      ]),
    );

    let totalDebitColumn = 0;
    let totalCreditColumn = 0;

    const rows = accounts.map((account) => {
      const { totalDebit, totalCredit } = sumsByAccount.get(account.id) ?? {
        totalDebit: 0,
        totalCredit: 0,
      };

      const isDebitNormal = DEBIT_NORMAL_TYPES.includes(account.type);
      const net = isDebitNormal
        ? totalDebit - totalCredit
        : totalCredit - totalDebit;

      const debitColumn = isDebitNormal ? Math.max(net, 0) : Math.max(-net, 0);
      const creditColumn = isDebitNormal ? Math.max(-net, 0) : Math.max(net, 0);

      totalDebitColumn += debitColumn;
      totalCreditColumn += creditColumn;

      return {
        accountId: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        debit: debitColumn,
        credit: creditColumn,
      };
    });

    return {
      rows,
      totalDebit: totalDebitColumn,
      totalCredit: totalCreditColumn,
      isBalanced: Math.abs(totalDebitColumn - totalCreditColumn) < 0.001,
    };
  }
}