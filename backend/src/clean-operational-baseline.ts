import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function cleanOperationalBaseline() {
  console.log('=== Cleaning Database to Pristine Operational Zero State ===');

  // 1. Delete transactional lines and records in foreign key dependency order
  console.log('Clearing sales invoices & lines...');
  await prisma.salesInvoiceLine.deleteMany({});
  await prisma.salesInvoice.deleteMany({});

  console.log('Clearing purchase invoices & lines...');
  await prisma.purchaseInvoiceLine.deleteMany({});
  await prisma.purchaseInvoice.deleteMany({});

  console.log('Clearing purchase orders & lines...');
  await prisma.purchaseOrderLine.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});

  console.log('Clearing stock transfers & lines...');
  await prisma.stockTransferLine.deleteMany({});
  await prisma.stockTransfer.deleteMany({});

  console.log('Clearing customer payments & receipts...');
  await prisma.customerPayment.deleteMany({});

  console.log('Clearing POS shifts...');
  await prisma.posShift.deleteMany({});

  console.log('Clearing general ledger journal entries & lines...');
  await prisma.journalEntryLine.deleteMany({});
  await prisma.journalEntry.deleteMany({});

  console.log('Clearing audit logs...');
  await prisma.discountAuditLog.deleteMany({});
  await prisma.auditLog.deleteMany({});

  console.log('Clearing inventory stock balances & items...');
  await prisma.itemStock.deleteMany({});
  await prisma.itemBarcode.deleteMany({});
  await prisma.itemUom.deleteMany({});
  await prisma.itemVariant.deleteMany({});
  await prisma.itemSerial.deleteMany({});
  await prisma.itemBatch.deleteMany({});
  await prisma.item.deleteMany({});

  console.log('Clearing test customers and suppliers...');
  await prisma.customer.deleteMany({});
  await prisma.supplier.deleteMany({});

  console.log('=== Verifying Zero Operational State ===');
  const [
    salesCount,
    purchasesCount,
    ordersCount,
    jeCount,
    itemsCount,
    custCount,
    suppCount,
    branchesCount,
    usersCount,
    accountsCount,
  ] = await Promise.all([
    prisma.salesInvoice.count(),
    prisma.purchaseInvoice.count(),
    prisma.purchaseOrder.count(),
    prisma.journalEntry.count(),
    prisma.item.count(),
    prisma.customer.count(),
    prisma.supplier.count(),
    prisma.branch.count(),
    prisma.user.count(),
    prisma.account.count(),
  ]);

  console.log({
    SalesInvoices: salesCount,
    PurchaseInvoices: purchasesCount,
    PurchaseOrders: ordersCount,
    JournalEntries: jeCount,
    Items: itemsCount,
    Customers: custCount,
    Suppliers: suppCount,
    PreservedBranches: branchesCount,
    PreservedUsers: usersCount,
    PreservedAccounts: accountsCount,
  });

  if (
    salesCount === 0 &&
    purchasesCount === 0 &&
    ordersCount === 0 &&
    jeCount === 0 &&
    itemsCount === 0 &&
    custCount === 0 &&
    suppCount === 0 &&
    branchesCount === 14 &&
    usersCount >= 6 &&
    accountsCount >= 8
  ) {
    console.log('SUCCESS: Operational zero state verified with full master data preserved.');
  } else {
    console.warn('WARNING: Some counts did not match expected zero baseline.');
  }
}

cleanOperationalBaseline()
  .catch((e) => {
    console.error('Error during operational baseline cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
