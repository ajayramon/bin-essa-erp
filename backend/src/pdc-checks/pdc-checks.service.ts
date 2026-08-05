import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdcCheckDto } from './dto/create-pdc-check.dto';

@Injectable()
export class PdcChecksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pdcCheck.findMany({
      include: {
        customer: { select: { id: true, name: true, code: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async create(dto: CreatePdcCheckDto) {
    const existing = await this.prisma.pdcCheck.findUnique({
      where: { checkNumber: dto.checkNumber },
    });
    if (existing) {
      throw new BadRequestException(`PDC Check number ${dto.checkNumber} already exists`);
    }

    return this.prisma.pdcCheck.create({
      data: {
        checkNumber: dto.checkNumber,
        bankName: dto.bankName,
        dueDate: new Date(dto.dueDate),
        amount: dto.amount,
        customerId: dto.customerId,
        notes: dto.notes,
        status: 'RECEIVED',
      },
      include: {
        customer: true,
      },
    });
  }

  async deposit(id: string) {
    const check = await this.prisma.pdcCheck.findUnique({ where: { id } });
    if (!check) throw new NotFoundException(`PDC Check ${id} not found`);

    return this.prisma.pdcCheck.update({
      where: { id },
      data: {
        status: 'DEPOSITED',
        depositedAt: new Date(),
      },
      include: { customer: true },
    });
  }

  async clear(id: string) {
    const check = await this.prisma.pdcCheck.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!check) throw new NotFoundException(`PDC Check ${id} not found`);

    const updated = await this.prisma.pdcCheck.update({
      where: { id },
      data: {
        status: 'CLEARED',
        clearedAt: new Date(),
      },
      include: { customer: true },
    });

    // Auto-post balanced Double-Entry Journal Entry
    try {
      const bankAccount = await this.prisma.account.findFirst({ where: { code: '1010' } });
      const pdcAccount = await this.prisma.account.findFirst({ where: { code: '1030' } });

      if (bankAccount && pdcAccount) {
        const count = await this.prisma.journalEntry.count();
        const reference = `JE-PDC-${String(count + 1).padStart(4, '0')}`;

        await this.prisma.journalEntry.create({
          data: {
            reference,
            date: new Date(),
            description: `PDC Check #${check.checkNumber} cleared for ${check.customer.name}`,
            lines: {
              create: [
                {
                  accountId: bankAccount.id,
                  debit: check.amount,
                  credit: 0,
                },
                {
                  accountId: pdcAccount.id,
                  debit: 0,
                  credit: check.amount,
                },
              ],
            },
          },
        });
      }
    } catch (e) {
      console.warn('Failed to auto-post PDC clearing journal entry', e);
    }

    return updated;
  }

  async bounce(id: string) {
    const check = await this.prisma.pdcCheck.findUnique({ where: { id } });
    if (!check) throw new NotFoundException(`PDC Check ${id} not found`);

    return this.prisma.pdcCheck.update({
      where: { id },
      data: {
        status: 'BOUNCED',
        bouncedAt: new Date(),
      },
      include: { customer: true },
    });
  }
}
