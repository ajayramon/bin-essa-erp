import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceiptVoucherDto } from './dto/create-receipt-voucher.dto';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  // Receipt Vouchers (AR Collections)
  async findAllReceiptVouchers(branchId?: string) {
    return this.prisma.receiptVoucher.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        customer: true,
        branch: true,
        journalEntry: {
          include: { lines: { include: { account: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createReceiptVoucher(dto: CreateReceiptVoucherDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.$transaction(async (tx) => {
      const voucher = await tx.receiptVoucher.create({
        data: {
          voucherNumber: dto.voucherNumber,
          customerId: dto.customerId,
          branchId: dto.branchId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod || 'CASH',
          reference: dto.reference,
          notes: dto.notes,
        },
      });

      // GL Accounts
      const isBank = dto.paymentMethod === 'CARD' || dto.paymentMethod === 'KNET' || dto.paymentMethod === 'BANK_TRANSFER';
      const debitCode = isBank ? '1010' : '1000';
      const debitName = isBank ? 'Bank / K-Net Account' : 'Cash on Hand';

      let debitAccount = await tx.account.findUnique({ where: { code: debitCode } });
      if (!debitAccount) {
        debitAccount = await tx.account.create({
          data: { code: debitCode, name: debitName, type: 'ASSET' },
        });
      }

      let arAccount = await tx.account.findUnique({ where: { code: '1100' } });
      if (!arAccount) {
        arAccount = await tx.account.create({
          data: { code: '1100', name: 'Accounts Receivable', type: 'ASSET' },
        });
      }

      // Auto-post balanced journal entry
      await tx.journalEntry.create({
        data: {
          reference: `JE-RV-${dto.voucherNumber}`,
          description: `Customer Receipt Voucher: ${customer.name} (${dto.voucherNumber})`,
          branchId: dto.branchId,
          receiptVoucherId: voucher.id,
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
      });

      return tx.receiptVoucher.findUnique({
        where: { id: voucher.id },
        include: {
          customer: true,
          branch: true,
          journalEntry: {
            include: { lines: { include: { account: true } } },
          },
        },
      });
    });
  }

  // Payment Vouchers (AP Settlements)
  async findAllPaymentVouchers(branchId?: string) {
    return this.prisma.paymentVoucher.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        supplier: true,
        branch: true,
        journalEntry: {
          include: { lines: { include: { account: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createPaymentVoucher(dto: CreatePaymentVoucherDto) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Supplier not found');

    return this.prisma.$transaction(async (tx) => {
      const voucher = await tx.paymentVoucher.create({
        data: {
          voucherNumber: dto.voucherNumber,
          supplierId: dto.supplierId,
          branchId: dto.branchId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod || 'CASH',
          reference: dto.reference,
          notes: dto.notes,
        },
      });

      // GL Accounts
      let apAccount = await tx.account.findUnique({ where: { code: '2000' } });
      if (!apAccount) {
        apAccount = await tx.account.create({
          data: { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
        });
      }

      const isBank = dto.paymentMethod === 'CARD' || dto.paymentMethod === 'KNET' || dto.paymentMethod === 'BANK_TRANSFER';
      const creditCode = isBank ? '1010' : '1000';
      const creditName = isBank ? 'Bank / K-Net Account' : 'Cash on Hand';

      let creditAccount = await tx.account.findUnique({ where: { code: creditCode } });
      if (!creditAccount) {
        creditAccount = await tx.account.create({
          data: { code: creditCode, name: creditName, type: 'ASSET' },
        });
      }

      // Auto-post balanced journal entry: Dr AP 2000 / Cr Cash/Bank
      await tx.journalEntry.create({
        data: {
          reference: `JE-PV-${dto.voucherNumber}`,
          description: `Supplier Payment Voucher: ${supplier.name} (${dto.voucherNumber})`,
          branchId: dto.branchId,
          paymentVoucherId: voucher.id,
          lines: {
            create: [
              {
                accountId: apAccount.id,
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

      return tx.paymentVoucher.findUnique({
        where: { id: voucher.id },
        include: {
          supplier: true,
          branch: true,
          journalEntry: {
            include: { lines: { include: { account: true } } },
          },
        },
      });
    });
  }
}
