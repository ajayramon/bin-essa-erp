import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAllCategories() {
    return this.prisma.expenseCategory.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async createCategory(dto: CreateExpenseCategoryDto) {
    return this.prisma.expenseCategory.create({
      data: {
        code: dto.code,
        name: dto.name,
        accountId: dto.accountId,
      },
    });
  }

  async findAll(branchId?: string) {
    return this.prisma.expense.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        branch: true,
        category: true,
        costCenter: true,
        journalEntry: {
          include: {
            lines: { include: { account: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const exp = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        branch: true,
        category: true,
        costCenter: true,
        journalEntry: {
          include: {
            lines: { include: { account: true } },
          },
        },
      },
    });
    if (!exp) throw new NotFoundException(`Expense ${id} not found`);
    return exp;
  }

  async create(dto: CreateExpenseDto) {
    return this.prisma.$transaction(async (tx) => {
      const category = await tx.expenseCategory.findUnique({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Expense category not found');

      const expense = await tx.expense.create({
        data: {
          expenseNumber: dto.expenseNumber,
          branchId: dto.branchId,
          categoryId: dto.categoryId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod || 'CASH',
          costCenterId: dto.costCenterId,
          notes: dto.notes,
          status: 'POSTED',
        },
      });

      // GL Accounts
      let expenseAccount = await tx.account.findUnique({ where: { code: '6000' } });
      if (!expenseAccount) {
        expenseAccount = await tx.account.create({
          data: { code: '6000', name: 'Operating & Administrative Expenses', type: 'EXPENSE' },
        });
      }

      const isBank = dto.paymentMethod === 'CARD' || dto.paymentMethod === 'KNET' || dto.paymentMethod === 'BANK_TRANSFER';
      const creditAccountCode = isBank ? '1010' : '1000';
      const creditAccountName = isBank ? 'Bank / K-Net Account' : 'Cash on Hand';

      let creditAccount = await tx.account.findUnique({ where: { code: creditAccountCode } });
      if (!creditAccount) {
        creditAccount = await tx.account.create({
          data: { code: creditAccountCode, name: creditAccountName, type: 'ASSET' },
        });
      }

      // Post Balanced Double Entry
      await tx.journalEntry.create({
        data: {
          reference: `JE-EXP-${dto.expenseNumber}`,
          description: `Expense: ${category.name} (${dto.expenseNumber})`,
          branchId: dto.branchId,
          expenseId: expense.id,
          lines: {
            create: [
              {
                accountId: expenseAccount.id,
                debit: dto.amount,
                credit: 0,
              },
              {
                accountId: creditAccount.id,
                debit: 0,
                credit: dto.amount,
              },
            ],
          },
        },
      });

      return tx.expense.findUnique({
        where: { id: expense.id },
        include: {
          category: true,
          branch: true,
          costCenter: true,
          journalEntry: {
            include: { lines: { include: { account: true } } },
          },
        },
      });
    });
  }
}
