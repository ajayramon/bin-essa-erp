import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function verifyCleanBaseline() {
  console.log('=== Verifying Clean Real-Business Baseline ===');

  const [
    salesCount,
    salesLinesCount,
    purchasesCount,
    purchaseLinesCount,
    ordersCount,
    orderLinesCount,
    jeCount,
    jeLinesCount,
    itemsCount,
    customersCount,
    suppliersCount,
    shiftsCount,
    paymentsCount,
    transfersCount,
    branchesCount,
    usersCount,
    accountsCount,
  ] = await Promise.all([
    prisma.salesInvoice.count(),
    prisma.salesInvoiceLine.count(),
    prisma.purchaseInvoice.count(),
    prisma.purchaseInvoiceLine.count(),
    prisma.purchaseOrder.count(),
    prisma.purchaseOrderLine.count(),
    prisma.journalEntry.count(),
    prisma.journalEntryLine.count(),
    prisma.item.count(),
    prisma.customer.count(),
    prisma.supplier.count(),
    prisma.posShift.count(),
    prisma.customerPayment.count(),
    prisma.stockTransfer.count(),
    prisma.branch.count(),
    prisma.user.count(),
    prisma.account.count(),
  ]);

  console.log('--- Operational Transaction Counts ---');
  console.log(`Sales Invoices:        ${salesCount}`);
  console.log(`Sales Invoice Lines:   ${salesLinesCount}`);
  console.log(`Purchase Invoices:     ${purchasesCount}`);
  console.log(`Purchase Invoice Lines:${purchaseLinesCount}`);
  console.log(`Purchase Orders:       ${ordersCount}`);
  console.log(`Purchase Order Lines:  ${orderLinesCount}`);
  console.log(`GL Journal Entries:    ${jeCount}`);
  console.log(`GL Journal Lines:      ${jeLinesCount}`);
  console.log(`Active Items:          ${itemsCount}`);
  console.log(`Customers:             ${customersCount}`);
  console.log(`Suppliers:             ${suppliersCount}`);
  console.log(`POS Shifts:            ${shiftsCount}`);
  console.log(`Customer Payments:     ${paymentsCount}`);
  console.log(`Stock Transfers:       ${transfersCount}`);

  console.log('--- Master Infrastructure Data ---');
  console.log(`Branches:              ${branchesCount}`);
  console.log(`System Users:          ${usersCount}`);
  console.log(`Chart of Accounts:     ${accountsCount}`);

  // Query trial balance balances
  const accounts = await prisma.account.findMany();

  console.log('--- GL Accounts Initial Balances ---');
  let totalDebit = 0;
  let totalCredit = 0;
  for (const acc of accounts) {
    const lines = await prisma.journalEntryLine.findMany({
      where: { accountId: acc.id },
    });
    const d = lines.reduce((s, l) => s + Number(l.debit || 0), 0);
    const c = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    totalDebit += d;
    totalCredit += c;
    console.log(`[${acc.code}] ${acc.name} (${acc.type}) -> Debit: ${d.toFixed(3)} KD, Credit: ${c.toFixed(3)} KD`);
  }

  console.log(`Total Debit: ${totalDebit.toFixed(3)} KD | Total Credit: ${totalCredit.toFixed(3)} KD | Variance: ${(totalDebit - totalCredit).toFixed(3)} KD`);

  const isClean =
    salesCount === 0 &&
    purchasesCount === 0 &&
    ordersCount === 0 &&
    jeCount === 0 &&
    itemsCount === 0 &&
    customersCount === 0 &&
    suppliersCount === 0 &&
    shiftsCount === 0 &&
    paymentsCount === 0 &&
    transfersCount === 0 &&
    totalDebit === 0 &&
    totalCredit === 0 &&
    branchesCount >= 14 &&
    usersCount >= 6 &&
    accountsCount >= 8;

  if (isClean) {
    console.log('\n>>> STATUS: 100% CLEAN BASELINE CONFIRMED <<<');
  } else {
    console.warn('\n>>> STATUS: BASELINE HAS NON-ZERO VALUES <<<');
  }
}

verifyCleanBaseline()
  .catch((e) => {
    console.error('Error verifying baseline:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
