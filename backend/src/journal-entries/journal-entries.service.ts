import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';

@Injectable()
export class JournalEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateJournalEntryDto) {
    const totalDebit = dto.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = dto.lines.reduce((sum, l) => sum + l.credit, 0);

    const diff = Math.round((totalDebit - totalCredit) * 1000) / 1000;
    if (diff !== 0) {
      throw new BadRequestException(
        `Journal entry is not balanced: total debit ${totalDebit} does not equal total credit ${totalCredit}`,
      );
    }

    if (totalDebit === 0) {
      throw new BadRequestException('Journal entry cannot have zero total debit/credit');
    }

    return this.prisma.$transaction(async (tx) => {
      const count = await tx.journalEntry.count({
        where: { reference: { startsWith: 'JE-', not: { startsWith: 'JE-INV-' } } },
      });
      const reference = `JE-${String(count + 1).padStart(4, '0')}`;

      return tx.journalEntry.create({
        data: {
          reference,
          date: dto.date ? new Date(dto.date) : undefined,
          description: dto.description,
          lines: {
            create: dto.lines.map((l) => ({
              accountId: l.accountId,
              debit: l.debit,
              credit: l.credit,
            })),
          },
        },
        include: { lines: true },
      });
    });
  }

  async findAll(branchId?: string) {
    return this.prisma.journalEntry.findMany({
      where: branchId ? { branchId } : undefined,
      include: { lines: { include: { account: true } } },
      orderBy: { date: 'desc' },
    });
  }
}
