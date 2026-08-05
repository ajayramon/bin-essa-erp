import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';

@Injectable()
export class CustomerPaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerPaymentDto) {
    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero.');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${dto.customerId}" not found.`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Determine Debit Account Code based on Payment Method:
      // CASH -> 1000 Cash, CARD / BANK_TRANSFER -> 1010 Bank / K-Net
      const debitCode = dto.paymentMethod === 'CASH' ? '1000' : '1010';
      const debitName = dto.paymentMethod === 'CASH' ? 'Cash' : 'Bank / K-Net';

      const [debitAccount, arAccount] = await Promise.all([
        tx.account.findUnique({ where: { code: debitCode } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: debitCode, name: debitName, type: 'ASSET' } });
        }),
        tx.account.findUnique({ where: { code: '1100' } }).then(async (acc) => {
          return acc ?? tx.account.create({ data: { code: '1100', name: 'Accounts Receivable', type: 'ASSET' } });
        }),
      ]);

      // 1. Create Payment Receipt
      const payment = await tx.customerPayment.create({
        data: {
          receiptNumber: dto.receiptNumber,
          customerId: dto.customerId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          reference: dto.reference,
          notes: dto.notes,
        },
        include: {
          customer: true,
        },
      });

      // 2. Auto-post balanced Journal Entry:
      // DEBIT Cash / Bank (1000 / 1010)
      // CREDIT Accounts Receivable (1100)
      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: `JE-${dto.receiptNumber}`,
          description: `Customer payment receipt ${dto.receiptNumber} (${customer.name})`,
          status: 'POSTED',
          branchId: dto.branchId || customer.branchId,
          customerPaymentId: payment.id,
          lines: {
            create: [
              {
                accountId: debitAccount.id,
                debit: dto.amount,
                credit: 0,
              },
              {
                accountId: arAccount.id,
                debit: 0,
                credit: dto.amount,
              },
            ],
          },
        },
        include: {
          lines: true,
        },
      });

      return { ...payment, journalEntry };
    });
  }

  async getStatementOfAccount(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${customerId}" not found.`);
    }

    const [invoices, payments] = await Promise.all([
      this.prisma.salesInvoice.findMany({
        where: { customerId, status: 'POSTED' },
        orderBy: { date: 'asc' },
      }),
      this.prisma.customerPayment.findMany({
        where: { customerId },
        orderBy: { date: 'asc' },
      }),
    ]);

    // Build chronological ledger entries
    const transactions = [
      ...invoices.map((inv) => ({
        date: inv.date,
        type: 'INVOICE',
        reference: inv.invoiceNumber,
        debit: Number(inv.totalAmount),
        credit: 0,
      })),
      ...payments.map((p) => ({
        date: p.date,
        type: 'PAYMENT',
        reference: p.receiptNumber,
        debit: 0,
        credit: Number(p.amount),
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    const ledger = transactions.map((t) => {
      runningBalance += t.debit - t.credit;
      return {
        ...t,
        runningBalance: Math.round(runningBalance * 1000) / 1000,
      };
    });

    const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const netBalance = totalInvoiced - totalPaid;
    const creditLimit = Number(customer.creditLimit) || 0;
    const availableCredit = creditLimit > 0 ? Math.max(creditLimit - netBalance, 0) : 0;

    return {
      customer: {
        id: customer.id,
        code: customer.code,
        name: customer.name,
        creditLimit,
        paymentTerms: customer.paymentTerms,
      },
      summary: {
        totalInvoiced,
        totalPaid,
        netBalance,
        availableCredit,
      },
      ledger,
    };
  }

  async findAll() {
    return this.prisma.customerPayment.findMany({
      include: {
        customer: true,
        journalEntry: { include: { lines: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
