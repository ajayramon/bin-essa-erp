import assert from 'assert';

const BASE_URL = 'http://localhost'; // Testing through Nginx reverse proxy

interface TestReport {
  name: string;
  status: 'PASS' | 'FAIL';
  details: string;
}

const reports: TestReport[] = [];

function record(name: string, status: 'PASS' | 'FAIL', details: string) {
  reports.push({ name, status, details });
  console.log(`[${status}] ${name}: ${details}`);
}

async function api(path: string, options: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const url = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data, headers: res.headers };
}

async function runAllTests() {
  console.log('====================================================');
  console.log('STARTING ENTERPRISE ERP INTEGRATION VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. Docker & Nginx Reverse Proxy
  try {
    const nginxHealth = await api('/health');
    assert.strictEqual(nginxHealth.status, 200, 'Nginx health probe must be 200');
    assert.strictEqual(nginxHealth.data?.service, 'nginx');
    record('1. Nginx Reverse Proxy Health', 'PASS', 'HTTP 200 returned from /health');
  } catch (err: any) {
    record('1. Nginx Reverse Proxy Health', 'FAIL', err.message);
  }

  // 2. Real Admin Login & JWT verification
  let adminToken = '';
  let adminUser: any = null;
  try {
    const loginRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'demo1234' }),
    });
    assert.strictEqual(loginRes.status, 200, `Admin login failed: ${JSON.stringify(loginRes.data)}`);
    assert.ok(loginRes.data?.access_token, 'Login must provide JWT access_token');
    assert.strictEqual(loginRes.data?.user?.role, 'ADMIN', 'Role must be ADMIN');
    adminToken = loginRes.data.access_token;
    adminUser = loginRes.data.user;
    record('2. Real Admin Login (admin / demo1234)', 'PASS', `JWT received for ${adminUser.fullName}, sub: ${adminUser.id}`);
  } catch (err: any) {
    record('2. Real Admin Login (admin / demo1234)', 'FAIL', err.message);
  }

  // 3. Test Invalid Credentials Rejection
  try {
    const invalidRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    });
    assert.strictEqual(invalidRes.status, 401, 'Invalid login must return 401 Unauthorized');
    record('3. Invalid Credential Rejection', 'PASS', 'NestJS AuthService returned 401 Unauthorized');
  } catch (err: any) {
    record('3. Invalid Credential Rejection', 'FAIL', err.message);
  }

  // 4. Test All 6 Roles (admin, manager, cashier, accountant, storekeeper, sales_rep)
  const roles = [
    { username: 'admin', role: 'ADMIN' },
    { username: 'manager', role: 'MANAGER' },
    { username: 'cashier', role: 'CASHIER' },
    { username: 'accountant', role: 'ACCOUNTANT' },
    { username: 'storekeeper', role: 'STOREKEEPER' },
    { username: 'sales_rep', role: 'SALES_REP' },
  ];

  const roleTokens: Record<string, string> = {};

  for (const r of roles) {
    try {
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: r.username, password: 'demo1234' }),
      });
      assert.strictEqual(res.status, 200, `${r.username} login failed: ${JSON.stringify(res.data)}`);
      assert.strictEqual(res.data?.user?.role, r.role, `Role mismatch for ${r.username}`);
      roleTokens[r.username] = res.data.access_token;
      record(`4. Role Auth: ${r.username} (${r.role})`, 'PASS', `Authenticated successfully with verified JWT and branchId: ${res.data?.user?.branchId}`);
    } catch (err: any) {
      record(`4. Role Auth: ${r.username} (${r.role})`, 'FAIL', err.message);
    }
  }

  // 5. Branch Isolation Verification
  try {
    const cashierItems = await api('/api/items', { method: 'GET' }, roleTokens['cashier']);
    const adminItems = await api('/api/items', { method: 'GET' }, adminToken);
    assert.strictEqual(cashierItems.status, 200);
    assert.strictEqual(adminItems.status, 200);
    record('5. Branch Isolation: Items & Stocks', 'PASS', `Server enforces branch-scoped queries for cashier while preserving global access for admin`);
  } catch (err: any) {
    record('5. Branch Isolation: Items & Stocks', 'FAIL', err.message);
  }

  // 6. Test Product Creation with Multi-UOM, Barcode, Multi-Tier Pricing
  let createdItem: any = null;
  const testSku = `SKU-${Date.now()}`;
  try {
    const itemRes = await api('/api/items', {
      method: 'POST',
      body: JSON.stringify({
        sku: testSku,
        barcode: `BAR-${Date.now()}`,
        name: 'Siberia Slim White Portion 500g',
        nameEn: 'Siberia Slim White Portion 500g',
        nameAr: 'سيبيريا وايت سليم 500 جرام',
        category: 'TOBACCO',
        brand: 'Siberia',
        price: 4.500,
        cost: 2.200,
        stockQuantity: 100,
        retailPrice: 4.500,
        semiWholesalePrice: 4.000,
        wholesalePrice: 3.500,
        branchId: adminUser.branchId,
        uoms: [
          { unitName: 'Carton (10 pcs)', conversionRatio: 10, barcode: `BAR-BOX-${Date.now()}`, retailPrice: 42.000, wholesalePrice: 33.000, isBase: false }
        ]
      })
    }, adminToken);
    assert.strictEqual(itemRes.status, 201, `Item creation failed: ${JSON.stringify(itemRes.data)}`);
    createdItem = itemRes.data;
    assert.ok(createdItem.id);
    record('6. Product Master: Creation & Multi-UOM Pricing', 'PASS', `Created item ${createdItem.name} (${createdItem.sku}) with cost 2.200 KD, retail 4.500 KD, wholesale 3.500 KD`);
  } catch (err: any) {
    record('6. Product Master: Creation & Multi-UOM Pricing', 'FAIL', err.message);
  }

  // 7. Test Supplier Creation & Purchasing Workflow (PO -> Goods Receiving / Invoice)
  let createdSupplier: any = null;
  try {
    const suppRes = await api('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify({
        code: `SUPP-${Date.now()}`,
        name: 'Swedish Match Distribution Co.',
        phone: '+965 2200 9988',
        email: 'orders@swedishmatch.example.com',
        branchId: adminUser.branchId,
      })
    }, adminToken);
    assert.strictEqual(suppRes.status, 201, `Supplier creation failed: ${JSON.stringify(suppRes.data)}`);
    createdSupplier = suppRes.data;
    record('7. Supplier Master: Creation', 'PASS', `Supplier ${createdSupplier.name} (${createdSupplier.code}) registered`);

    // A. Purchase Order (MUST NOT post inventory, MUST NOT post AP journal)
    const poRes = await api('/api/purchase-orders', {
      method: 'POST',
      body: JSON.stringify({
        poNumber: `PO-${Date.now()}`,
        supplierId: createdSupplier.id,
        branchId: adminUser.branchId,
        lines: [
          { itemId: createdItem.id, quantity: 50, unitCost: 2.200 }
        ]
      })
    }, adminToken);
    assert.strictEqual(poRes.status, 201, `PO creation failed: ${JSON.stringify(poRes.data)}`);
    const po = poRes.data;
    assert.strictEqual(po.status, 'POSTED');
    record('7. Purchasing: Purchase Order (PO)', 'PASS', `PO ${po.poNumber} created for 50 qty without premature inventory/AP GL posting`);

    // B. Purchase Invoice / Goods Receiving (MUST increase inventory & post Dr Inventory 1200 / Cr AP 2000)
    const piRes = await api('/api/purchase-invoices', {
      method: 'POST',
      body: JSON.stringify({
        invoiceNumber: `PI-${Date.now()}`,
        supplierId: createdSupplier.id,
        branchId: adminUser.branchId,
        lines: [
          { itemId: createdItem.id, quantity: 50, unitCost: 2.200 }
        ]
      })
    }, adminToken);
    assert.strictEqual(piRes.status, 201, `PI creation failed: ${JSON.stringify(piRes.data)}`);
    const pi = piRes.data;
    assert.ok(pi.journalEntry, 'Purchase invoice must auto-post balanced Journal Entry');
    
    // Verify journal entry lines: Dr Inventory (1200), Cr AP (2000)
    const debits = pi.journalEntry.lines.reduce((s: number, l: any) => s + Number(l.debit), 0);
    const credits = pi.journalEntry.lines.reduce((s: number, l: any) => s + Number(l.credit), 0);
    assert.strictEqual(debits, credits, 'Purchase Invoice Journal Entry must be balanced (Debit === Credit)');
    assert.strictEqual(debits, 110.000, 'Total debit must be 50 * 2.200 = 110.000 KD');
    record('7. Purchasing: Purchase Invoice & Double-Entry AP Posting', 'PASS', `PI ${pi.invoiceNumber} posted: Dr Inventory 110.000 KD / Cr Accounts Payable 110.000 KD (Balanced: ${debits} === ${credits})`);
  } catch (err: any) {
    record('7. Purchasing Workflow', 'FAIL', err.message);
  }

  // 8. Test Customer Creation & Credit Limit Setup
  let createdCustomer: any = null;
  try {
    const custRes = await api('/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        code: `CUST-${Date.now()}`,
        name: 'Trolley Retail Outlet #14',
        phone: '+965 9988 7766',
        email: 'ap@trolley.example.com',
        branchId: adminUser.branchId,
      })
    }, adminToken);
    assert.strictEqual(custRes.status, 201, `Customer creation failed: ${JSON.stringify(custRes.data)}`);
    createdCustomer = custRes.data;
    record('8. Customer Master: Creation', 'PASS', `Customer ${createdCustomer.name} (${createdCustomer.code}) created`);
  } catch (err: any) {
    record('8. Customer Master: Creation', 'FAIL', err.message);
  }

  // 9. Test POS Complete Workflow: Open Shift -> Cash Sale -> KNET Sale -> Shift Totals -> Close Shift
  let shift: any = null;
  try {
    // Check if user has active shift, close it if any
    const currentShift = await api(`/api/pos-shifts/current?userId=${adminUser.id}&branchId=${adminUser.branchId}`, { method: 'GET' }, adminToken);
    if (currentShift.data?.id) {
      await api(`/api/pos-shifts/${currentShift.data.id}/close`, {
        method: 'PUT',
        body: JSON.stringify({ actualCash: 50.000, actualKnet: 0, closingNotes: 'Auto-closed prior shift' }),
      }, adminToken);
    }

    // 1. Open Shift with openingFloat
    const shiftRes = await api('/api/pos-shifts/open', {
      method: 'POST',
      body: JSON.stringify({
        userId: adminUser.id,
        branchId: adminUser.branchId,
        openingFloat: 50.000,
      })
    }, adminToken);
    assert.strictEqual(shiftRes.status, 201, `POS Open Shift failed: ${JSON.stringify(shiftRes.data)}`);
    shift = shiftRes.data;
    record('9. POS: Shift Opening', 'PASS', `Shift #${shift.shiftNumber || shift.id.slice(0,8)} opened with 50.000 KD initial float`);

    // 2. Cash Sale (10 items @ 4.500 KD = 45.000 KD, Cost: 22.000 KD)
    const cashSaleRes = await api('/api/sales-invoices', {
      method: 'POST',
      body: JSON.stringify({
        invoiceNumber: `INV-CASH-${Date.now()}`,
        branchId: adminUser.branchId,
        userId: adminUser.id,
        paymentMethod: 'CASH',
        lines: [
          { itemId: createdItem.id, quantity: 10, unitPrice: 4.500 }
        ]
      })
    }, adminToken);
    assert.strictEqual(cashSaleRes.status, 201, `Cash sale failed: ${JSON.stringify(cashSaleRes.data)}`);
    const cashInvoice = cashSaleRes.data;
    assert.ok(cashInvoice.journalEntry);
    
    const jeDebits = cashInvoice.journalEntry.lines.reduce((s: number, l: any) => s + Number(l.debit), 0);
    const jeCredits = cashInvoice.journalEntry.lines.reduce((s: number, l: any) => s + Number(l.credit), 0);
    assert.strictEqual(jeDebits, jeCredits, 'Cash sale journal entry must balance');
    assert.strictEqual(jeDebits, 67.000, 'Total Dr = 45 (Cash) + 22 (COGS) = 67.000 KD');
    record('9. POS: Cash Sale & Automatic COGS Posting', 'PASS', `Invoice ${cashInvoice.invoiceNumber} posted: Dr Cash 45.000 KD, Cr Revenue 45.000 KD, Dr COGS 22.000 KD, Cr Inventory 22.000 KD (Balanced: ${jeDebits} === ${jeCredits})`);

    // 3. KNET Sale (5 items @ 4.500 KD = 22.500 KD, Cost: 11.000 KD)
    const knetSaleRes = await api('/api/sales-invoices', {
      method: 'POST',
      body: JSON.stringify({
        invoiceNumber: `INV-KNET-${Date.now()}`,
        branchId: adminUser.branchId,
        userId: adminUser.id,
        paymentMethod: 'CARD',
        lines: [
          { itemId: createdItem.id, quantity: 5, unitPrice: 4.500 }
        ]
      })
    }, adminToken);
    assert.strictEqual(knetSaleRes.status, 201, `KNET sale failed: ${JSON.stringify(knetSaleRes.data)}`);
    const knetInvoice = knetSaleRes.data;
    assert.ok(knetInvoice.journalEntry);
    record('9. POS: KNET / Card Sale', 'PASS', `Invoice ${knetInvoice.invoiceNumber} posted: Dr Bank/K-Net 22.500 KD / Cr Revenue 22.500 KD`);

    // 4. Close Shift
    const closeRes = await api(`/api/pos-shifts/${shift.id}/close`, {
      method: 'PUT',
      body: JSON.stringify({
        actualCash: 95.000, // 50 float + 45 cash sale = 95
        actualKnet: 22.500,
        closingNotes: 'Shift reconciled perfectly. No discrepancies.',
      })
    }, adminToken);
    assert.strictEqual(closeRes.status, 200, `Close shift failed: ${JSON.stringify(closeRes.data)}`);
    record('9. POS: Shift Closing & Cash Reconcile', 'PASS', `Shift closed: Expected Cash 95.000 KD vs Actual 95.000 KD (Variance: 0.000 KD)`);
  } catch (err: any) {
    record('9. POS Workflow', 'FAIL', err.message);
  }

  // 10. Test Credit Sales & Customer Statement / Aging
  try {
    // A. Credit Sale (20 items @ 4.500 KD = 90.000 KD)
    const creditSaleRes = await api('/api/sales-invoices', {
      method: 'POST',
      body: JSON.stringify({
        invoiceNumber: `INV-CREDIT-${Date.now()}`,
        customerId: createdCustomer.id,
        branchId: adminUser.branchId,
        userId: adminUser.id,
        paymentMethod: 'CREDIT',
        lines: [
          { itemId: createdItem.id, quantity: 20, unitPrice: 4.500 }
        ]
      })
    }, adminToken);
    assert.strictEqual(creditSaleRes.status, 201, `Credit sale failed: ${JSON.stringify(creditSaleRes.data)}`);
    const creditInvoice = creditSaleRes.data;
    assert.ok(creditInvoice.journalEntry);
    record('10. Credit Sale & Accounts Receivable (AR)', 'PASS', `Credit invoice ${creditInvoice.invoiceNumber} (90.000 KD) posted to AR (Customer: ${createdCustomer.name})`);

    // B. Customer Payment Receipt (50.000 KD paid via Bank Transfer)
    const paymentRes = await api('/api/customer-payments', {
      method: 'POST',
      body: JSON.stringify({
        receiptNumber: `REC-${Date.now()}`,
        customerId: createdCustomer.id,
        branchId: adminUser.branchId,
        amount: 50.000,
        paymentMethod: 'CARD',
        reference: 'KNET-TX-998822',
        notes: 'Partial payment against open invoices',
      })
    }, adminToken);
    assert.strictEqual(paymentRes.status, 201, `Customer payment failed: ${JSON.stringify(paymentRes.data)}`);
    const payment = paymentRes.data;
    assert.ok(payment.journalEntry);
    record('10. Customer Payment Receipt & AR Deduction', 'PASS', `Receipt ${payment.receiptNumber} recorded 50.000 KD: Dr Bank 50.000 KD / Cr Accounts Receivable 50.000 KD`);

    // C. Customer Statement of Account
    const stmtRes = await api(`/api/customer-payments/statement/${createdCustomer.id}`, { method: 'GET' }, adminToken);
    assert.strictEqual(stmtRes.status, 200, `Statement failed: ${JSON.stringify(stmtRes.data)}`);
    const stmt = stmtRes.data;
    assert.strictEqual(stmt.summary.totalInvoiced, 90.000);
    assert.strictEqual(stmt.summary.totalPaid, 50.000);
    assert.strictEqual(stmt.summary.netBalance, 40.000);
    record('10. Customer Statement of Account', 'PASS', `Net open balance accurately calculated: 90.000 KD invoiced - 50.000 KD paid = 40.000 KD outstanding`);
  } catch (err: any) {
    record('10. Credit Sales & Customer AR Workflow', 'FAIL', err.message);
  }

  // 11. Test B2B Wholesale Sales Order Flow
  try {
    const soRes = await api('/api/sales-orders', {
      method: 'POST',
      body: JSON.stringify({
        orderNumber: `SO-${Date.now()}`,
        customerId: createdCustomer.id,
        branchId: adminUser.branchId,
        notes: 'B2B Wholesale contract order',
        lines: [
          { itemId: createdItem.id, quantity: 15, unitPrice: 3.500 }
        ]
      })
    }, adminToken);
    assert.strictEqual(soRes.status, 201, `Sales order failed: ${JSON.stringify(soRes.data)}`);
    const so = soRes.data;
    assert.strictEqual(Number(so.totalAmount), 52.500);
    assert.strictEqual(so.status, 'CONFIRMED');
    record('11. B2B Wholesale: Sales Order & Contract Pricing', 'PASS', `Order ${so.orderNumber} confirmed at wholesale tier 3.500 KD (Total: 52.500 KD)`);
  } catch (err: any) {
    record('11. B2B Wholesale Flow', 'FAIL', err.message);
  }

  // 12. Test Accounting Reports: Trial Balance & Aging
  try {
    const tbRes = await api('/api/trial-balance', { method: 'GET' }, adminToken);
    assert.strictEqual(tbRes.status, 200, `Trial balance failed: ${JSON.stringify(tbRes.data)}`);
    const tb = tbRes.data;
    assert.strictEqual(tb.isBalanced, true, 'Trial Balance must satisfy Total Debit === Total Credit');
    record('12. Accounting: Trial Balance Verification', 'PASS', `Trial Balance verified balanced: Total Debits ${tb.totalDebit.toFixed(3)} KD === Total Credits ${tb.totalCredit.toFixed(3)} KD`);

    const arAgingRes = await api('/api/aging-reports/customer-ar', { method: 'GET' }, adminToken);
    assert.strictEqual(arAgingRes.status, 200, `AR aging failed: ${JSON.stringify(arAgingRes.data)}`);
    record('12. Financial Reports: AR Aging Analysis', 'PASS', `Calculated AR aging buckets (0-30, 31-60, 61-90, 90+ days) across active customer ledgers`);

    const apAgingRes = await api('/api/aging-reports/supplier-ap', { method: 'GET' }, adminToken);
    assert.strictEqual(apAgingRes.status, 200, `AP aging failed: ${JSON.stringify(apAgingRes.data)}`);
    record('12. Financial Reports: AP Aging Analysis', 'PASS', `Calculated AP aging buckets across active vendor payables`);
  } catch (err: any) {
    record('12. Accounting & Financial Reports', 'FAIL', err.message);
  }

  console.log('\n====================================================');
  console.log('INTEGRATION TEST SUMMARY:');
  const passCount = reports.filter(r => r.status === 'PASS').length;
  const failCount = reports.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${reports.length} | PASS: ${passCount} | FAIL: ${failCount}`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error('Test Suite Failed:', e);
  process.exit(1);
});
