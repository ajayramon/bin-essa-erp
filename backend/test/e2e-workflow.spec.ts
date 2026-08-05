import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { TrialBalanceService } from '../src/trial-balance/trial-balance.service';

describe('Bin Essa ERP - End-to-End Operational Lifecycle (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let trialBalanceService: TrialBalanceService;

  let mainWarehouseId: string;
  let salmiyaBranchId: string;
  let supplierId: string;
  let customerId: string;
  let userId: string;
  let itemId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    trialBalanceService = app.get(TrialBalanceService);

    // Clean up test data before running suite
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "JournalEntryLine", "JournalEntry", "SalesInvoiceLine", "SalesInvoice", "PurchaseInvoiceLine", "PurchaseInvoice", "PurchaseOrderLine", "PurchaseOrder", "StockTransferLine", "StockTransfer", "ItemStock", "Item", "Customer", "Supplier", "User", "Branch", "Account" CASCADE;`);

    // Setup initial seed branches, supplier, customer, and user
    const mainBranch = await prisma.branch.create({
      data: {
        code: 'BR-MAIN',
        name: 'Main Central Warehouse',
        brandId: 'BIN_ESSA_SMOKING_CENTER',
      },
    });
    mainWarehouseId = mainBranch.id;

    const branch2 = await prisma.branch.create({
      data: {
        code: 'BR-SALMIYA',
        name: 'Salmiya Branch',
        brandId: 'BIN_ESSA_SMOKING_CENTER',
      },
    });
    salmiyaBranchId = branch2.id;

    const supplier = await prisma.supplier.create({
      data: {
        code: 'SUPP-001',
        name: 'Global Tobacco & Accessories Corp',
        phone: '+965-22001122',
      },
    });
    supplierId = supplier.id;

    const customer = await prisma.customer.create({
      data: {
        code: 'CUST-001',
        name: 'Mr. Ali (VIP Client)',
        phone: '+965-99887766',
      },
    });
    customerId = customer.id;

    const user = await prisma.user.create({
      data: {
        username: 'cashier_salmiya',
        passwordHash: '$2b$10$e8wM5k8eW.z/x...', // dummy hash
        fullName: 'Salmiya Retail Cashier',
        role: 'CASHIER',
        branchId: salmiyaBranchId,
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('Stage 1: Create a new inventory item', async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .send({
        sku: 'SKU-CIGAR-HUMIDOR-01',
        barcode: '6291000998811',
        name: 'Cedar Cigar Humidor Deluxe',
        category: 'ACCESSORIES',
        price: 12.5, // 12.500 KWD
        cost: 7.0,   // 7.000 KWD
        unit: 'pcs',
      })
      .expect(211);

    expect(res.body).toHaveProperty('id');
    expect(res.body.sku).toBe('SKU-CIGAR-HUMIDOR-01');
    expect(Number(res.body.price)).toBe(12.5);
    expect(Number(res.body.cost)).toBe(7.0);

    itemId = res.body.id;
  });

  it('Stage 2 & 3: Purchase item & receive 100 units into Main Warehouse', async () => {
    const res = await request(app.getHttpServer())
      .post('/purchase-invoices')
      .send({
        invoiceNumber: 'PINV-2026-001',
        supplierId,
        branchId: mainWarehouseId,
        paymentTerms: 'IMMEDIATE',
        lines: [
          {
            itemId,
            quantity: 100,
            unitCost: 7.0, // 7.000 KWD
          },
        ],
      })
      .expect(201);

    expect(res.body.invoiceNumber).toBe('PINV-2026-001');
    expect(Number(res.body.totalAmount)).toBe(700.0);

    // Verify Main Warehouse stock
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    expect(item?.stockQuantity).toBe(100);

    const mainStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: mainWarehouseId } },
    });
    expect(Number(mainStock?.quantity)).toBe(100);
  });

  it('Stage 4 & 5: Transfer 30 units from Main Warehouse to Salmiya Branch', async () => {
    const res = await request(app.getHttpServer())
      .post('/stock-transfers')
      .send({
        transferNumber: 'TR-2026-001',
        fromBranchId: mainWarehouseId,
        toBranchId: salmiyaBranchId,
        notes: 'Replenish Salmiya retail store stock',
        lines: [
          {
            itemId,
            quantity: 30,
          },
        ],
      })
      .expect(201);

    expect(res.body.transferNumber).toBe('TR-2026-001');

    // Verify Main Warehouse stock decremented to 70
    const mainStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: mainWarehouseId } },
    });
    expect(Number(mainStock?.quantity)).toBe(70);

    // Verify Salmiya Branch stock incremented to 30
    const branchStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: salmiyaBranchId } },
    });
    expect(Number(branchStock?.quantity)).toBe(30);

    // Total system item quantity remains 100
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    expect(item?.stockQuantity).toBe(100);
  });

  it('Stage 6: Sell 5 units through POS at Salmiya Branch', async () => {
    const res = await request(app.getHttpServer())
      .post('/sales-invoices')
      .send({
        invoiceNumber: 'INV-2026-001',
        customerId,
        branchId: salmiyaBranchId,
        userId,
        paymentMethod: 'CASH',
        lines: [
          {
            itemId,
            quantity: 5,
            unitPrice: 12.5, // 5 * 12.500 = 62.500 KWD
          },
        ],
      })
      .expect(201);

    expect(res.body.invoiceNumber).toBe('INV-2026-001');
    expect(Number(res.body.totalAmount)).toBe(62.5);

    // Verify Salmiya Branch stock decremented to 25 (30 - 5)
    const branchStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: salmiyaBranchId } },
    });
    expect(Number(branchStock?.quantity)).toBe(25);

    // Total system stock decremented to 95 (100 - 5)
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    expect(item?.stockQuantity).toBe(95);
  });

  it('Stage 7: Process customer return of 2 units at POS', async () => {
    const res = await request(app.getHttpServer())
      .post('/sales-invoices/returns')
      .send({
        invoiceNumber: 'RET-2026-001',
        customerId,
        branchId: salmiyaBranchId,
        userId,
        paymentMethod: 'CASH',
        lines: [
          {
            itemId,
            quantity: 2,
            unitPrice: 12.5, // 2 * 12.500 = 25.000 KWD refund
          },
        ],
      })
      .expect(201);

    expect(res.body.invoiceNumber).toBe('RET-2026-001');
    expect(Number(res.body.totalAmount)).toBe(25.0);

    // Verify Salmiya Branch stock incremented to 27 (25 + 2)
    const branchStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: salmiyaBranchId } },
    });
    expect(Number(branchStock?.quantity)).toBe(27);

    // Total system stock restored to 97 (95 + 2)
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    expect(item?.stockQuantity).toBe(97);
  });

  it('Stage 8 & 9: Verify Double-Entry Journal Entries balance perfectly (Debit === Credit)', async () => {
    const entries = await prisma.journalEntry.findMany({
      include: { lines: true },
    });

    expect(entries.length).toBeGreaterThanOrEqual(3); // Purchase, Sale, Return

    for (const entry of entries) {
      const sumDebit = entry.lines.reduce((acc, l) => acc + Number(l.debit), 0);
      const sumCredit = entry.lines.reduce((acc, l) => acc + Number(l.credit), 0);
      expect(Math.abs(sumDebit - sumCredit)).toBeLessThan(0.001); // Debit === Credit
    }
  });

  it('Stage 10: Verify Trial Balance, GL, AP & Cash Balances', async () => {
    const tb = await trialBalanceService.getTrialBalance();

    expect(tb.isBalanced).toBe(true);
    expect(Math.abs(tb.totalDebit - tb.totalCredit)).toBeLessThan(0.001);

    // Find accounts
    const cashAcc = tb.rows.find((r) => r.code === '1000');
    const invAcc = tb.rows.find((r) => r.code === '1200');
    const apAcc = tb.rows.find((r) => r.code === '2000');
    const revAcc = tb.rows.find((r) => r.code === '4000');
    const cogsAcc = tb.rows.find((r) => r.code === '5000');

    // Cash = 62.500 (Sale) - 25.000 (Return) = 37.500 KWD Net Cash
    expect(cashAcc?.debit).toBeCloseTo(37.5, 3);

    // Revenue = 62.500 (Sale) - 25.000 (Return) = 37.500 KWD Net Sales Revenue
    expect(revAcc?.credit).toBeCloseTo(37.5, 3);

    // Cost of Goods Sold = (5 * 7.000) - (2 * 7.000) = 21.000 KWD Net COGS
    expect(cogsAcc?.debit).toBeCloseTo(21.0, 3);

    // Accounts Payable = 700.000 KWD
    expect(apAcc?.credit).toBeCloseTo(700.0, 3);

    // Inventory = 700.000 (Purchase) - 35.000 (COGS) + 14.000 (Return COGS) = 679.000 KWD
    expect(invAcc?.debit).toBeCloseTo(679.0, 3);
  });

  it('Stage 11: Refresh system & re-verify state persistence and numeric precision', async () => {
    // Re-fetch all balances directly from PostgreSQL DB to ensure data persistence
    const reloadedTb = await trialBalanceService.getTrialBalance();
    expect(reloadedTb.isBalanced).toBe(true);

    const mainStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: mainWarehouseId } },
    });
    const salmiyaStock = await prisma.itemStock.findUnique({
      where: { itemId_branchId: { itemId, branchId: salmiyaBranchId } },
    });

    expect(Number(mainStock?.quantity)).toBe(70);
    expect(Number(salmiyaStock?.quantity)).toBe(27);

    const finalItem = await prisma.item.findUnique({ where: { id: itemId } });
    expect(finalItem?.stockQuantity).toBe(97);
  });
});
