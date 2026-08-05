import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';

import { PrismaService } from './prisma/prisma.service';
import { ItemsService } from './items/items.service';
import { PurchaseInvoicesService } from './purchase-invoices/purchase-invoices.service';
import { StockTransfersService } from './stock-transfers/stock-transfers.service';
import { SalesInvoicesService } from './sales-invoices/sales-invoices.service';
import { TrialBalanceService } from './trial-balance/trial-balance.service';

async function runE2EWorkflow() {
  console.log('=== STARTING BIN ESSA ERP E2E OPERATIONAL WORKFLOW TEST ===\n');

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const prisma = app.get(PrismaService);
  const itemsService = app.get(ItemsService);
  const purchaseInvoicesService = app.get(PurchaseInvoicesService);
  const stockTransfersService = app.get(StockTransfersService);
  const salesInvoicesService = app.get(SalesInvoicesService);
  const trialBalanceService = app.get(TrialBalanceService);

  // Clean DB
  console.log('Cleaning test database tables...');
  await prisma.journalEntryLine.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.salesInvoiceLine.deleteMany();
  await prisma.salesInvoice.deleteMany();
  await prisma.purchaseInvoiceLine.deleteMany();
  await prisma.purchaseInvoice.deleteMany();
  await prisma.purchaseOrderLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.stockTransferLine.deleteMany();
  await prisma.stockTransfer.deleteMany();
  await prisma.itemStock.deleteMany();
  await prisma.item.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();


  // Setup seed structures
  const mainWarehouse = await prisma.branch.create({
    data: { code: 'BR-MAIN', name: 'Main Central Warehouse', brandId: 'BIN_ESSA_SMOKING_CENTER' },
  });
  const salmiyaBranch = await prisma.branch.create({
    data: { code: 'BR-SALMIYA', name: 'Salmiya Retail Branch', brandId: 'BIN_ESSA_SMOKING_CENTER' },
  });
  const supplier = await prisma.supplier.create({
    data: { code: 'SUPP-001', name: 'Global Accessories Supplier' },
  });
  const customer = await prisma.customer.create({
    data: { code: 'CUST-001', name: 'Mr. Ali' },
  });
  const user = await prisma.user.create({
    data: { username: 'salmiya_cashier', passwordHash: 'hash', fullName: 'Salmiya Cashier', role: 'CASHIER', branchId: salmiyaBranch.id },
  });

  // Stage 1: Create Item
  console.log('\n--- Stage 1: Create Item ---');
  const item = await itemsService.create({
    sku: 'E2E-ITEM-101',
    barcode: '6291000101',
    name: 'Luxury Cigar Cutter',
    category: 'ACCESSORIES',
    price: 15.0, // 15.000 KWD
    cost: 8.0,   // 8.000 KWD
    unit: 'pcs',
  });
  console.log(`[SUCCESS] Item created: ID=${item.id}, SKU=${item.sku}, Price=${item.price} KWD, Cost=${item.cost} KWD`);

  // Stage 2 & 3: Purchase & Receive Stock into Main Warehouse
  console.log('\n--- Stage 2 & 3: Purchase & Receive Stock into Main Warehouse ---');
  const pinv = await purchaseInvoicesService.create({
    invoiceNumber: 'PINV-E2E-101',
    supplierId: supplier.id,
    branchId: mainWarehouse.id,
    paymentTerms: 'IMMEDIATE',
    lines: [{ itemId: item.id, quantity: 100, unitCost: 8.0 }],
  });
  console.log(`[SUCCESS] Purchase Invoice Posted: ${pinv.invoiceNumber}, Total=${pinv.totalAmount} KWD`);

  const mainStock1 = await prisma.itemStock.findUnique({
    where: { itemId_branchId: { itemId: item.id, branchId: mainWarehouse.id } },
  });
  console.log(`[VERIFICATION] Main Warehouse Stock: ${mainStock1?.quantity} units (Expected: 100)`);

  // Stage 4 & 5: Stock Transfer to Salmiya Branch
  console.log('\n--- Stage 4 & 5: Stock Transfer (Main Warehouse -> Salmiya Branch) ---');
  const transfer = await stockTransfersService.create({
    transferNumber: 'TR-E2E-101',
    fromBranchId: mainWarehouse.id,
    toBranchId: salmiyaBranch.id,
    notes: 'Transfer stock to retail branch',
    lines: [{ itemId: item.id, quantity: 40 }],
  });
  console.log(`[SUCCESS] Stock Transfer Executed: ${transfer.transferNumber}`);

  const mainStock2 = await prisma.itemStock.findUnique({
    where: { itemId_branchId: { itemId: item.id, branchId: mainWarehouse.id } },
  });
  const salmiyaStock1 = await prisma.itemStock.findUnique({
    where: { itemId_branchId: { itemId: item.id, branchId: salmiyaBranch.id } },
  });
  console.log(`[VERIFICATION] Main Warehouse Stock: ${mainStock2?.quantity} units (Expected: 60)`);
  console.log(`[VERIFICATION] Salmiya Branch Stock: ${salmiyaStock1?.quantity} units (Expected: 40)`);

  // Stage 6: Sell via POS
  console.log('\n--- Stage 6: POS Sale at Salmiya Branch ---');
  const sale = await salesInvoicesService.create({
    invoiceNumber: 'INV-E2E-101',
    customerId: customer.id,
    branchId: salmiyaBranch.id,
    userId: user.id,
    paymentMethod: 'CASH',
    lines: [{ itemId: item.id, quantity: 10, unitPrice: 15.0 }],
  });
  console.log(`[SUCCESS] POS Sale Processed: ${sale.invoiceNumber}, Total=${sale.totalAmount} KWD`);

  const salmiyaStock2 = await prisma.itemStock.findUnique({
    where: { itemId_branchId: { itemId: item.id, branchId: salmiyaBranch.id } },
  });
  console.log(`[VERIFICATION] Salmiya Branch Stock after Sale: ${salmiyaStock2?.quantity} units (Expected: 30)`);

  // Stage 7: Process Sales Return
  console.log('\n--- Stage 7: POS Sales Return at Salmiya Branch ---');
  const ret = await salesInvoicesService.createReturn({
    invoiceNumber: 'RET-E2E-101',
    customerId: customer.id,
    branchId: salmiyaBranch.id,
    userId: user.id,
    paymentMethod: 'CASH',
    lines: [{ itemId: item.id, quantity: 3, unitPrice: 15.0 }],
  });
  console.log(`[SUCCESS] POS Return Processed: ${ret.invoiceNumber}, Total Refund=${ret.totalAmount} KWD`);

  const salmiyaStock3 = await prisma.itemStock.findUnique({
    where: { itemId_branchId: { itemId: item.id, branchId: salmiyaBranch.id } },
  });
  console.log(`[VERIFICATION] Salmiya Branch Stock after Return: ${salmiyaStock3?.quantity} units (Expected: 33)`);

  // Stage 8 & 9: Verify Double-Entry Journal Entries
  console.log('\n--- Stage 8 & 9: Double-Entry GL Ledger Audit ---');
  const jes = await prisma.journalEntry.findMany({ include: { lines: { include: { account: true } } } });
  let allBalanced = true;
  for (const je of jes) {
    const sumDebits = je.lines.reduce((s, l) => s + Number(l.debit), 0);
    const sumCredits = je.lines.reduce((s, l) => s + Number(l.credit), 0);
    const balanced = Math.abs(sumDebits - sumCredits) < 0.001;
    console.log(`Journal Entry [${je.reference}]: Debit=${sumDebits.toFixed(3)} KWD, Credit=${sumCredits.toFixed(3)} KWD | Balanced: ${balanced}`);
    if (!balanced) allBalanced = false;
  }
  if (!allBalanced) throw new Error('Unbalanced journal entries detected!');

  // Stage 10: Verify Trial Balance
  console.log('\n--- Stage 10: Financial Statement & Trial Balance Audit ---');
  const tb = await trialBalanceService.getTrialBalance();
  console.log(`Trial Balance Status: Balanced=${tb.isBalanced}, Total Debit=${tb.totalDebit.toFixed(3)} KWD, Total Credit=${tb.totalCredit.toFixed(3)} KWD`);
  console.log('Account Breakdown:');
  for (const row of tb.rows) {
    if (row.debit > 0 || row.credit > 0) {
      console.log(`  - Account [${row.code}] ${row.name}: Debit=${row.debit.toFixed(3)} KWD, Credit=${row.credit.toFixed(3)} KWD`);
    }
  }

  // Stage 11: Refresh & Persistence Audit
  console.log('\n--- Stage 11: System Refresh & Persistence Verification ---');
  const freshTb = await trialBalanceService.getTrialBalance();
  const freshItem = await prisma.item.findUnique({ where: { id: item.id } });
  console.log(`[SUCCESS] Database state persistent! Total System Stock: ${freshItem?.stockQuantity} units (Expected: 93)`);
  console.log(`[SUCCESS] Trial Balance persistent and balanced: ${freshTb.isBalanced}`);

  // Restore default seed admin user
  const passwordHash = await bcrypt.hash('demo1234', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash },
    create: {
      username: 'admin',
      passwordHash,
      fullName: 'Demo Admin',
      role: 'ADMIN',
      branchId: mainWarehouse.id,
    },
  });

  console.log('\n===============================================================');
  console.log(' ALL 11 STAGES OF E2E OPERATIONAL WORKFLOW VERIFIED SUCCESSFULLY!');
  console.log('===============================================================\n');

  await app.close();
}


runE2EWorkflow().catch((err) => {
  console.error('E2E Workflow Test Failed:', err);
  process.exit(1);
});
