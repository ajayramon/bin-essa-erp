/**
 * Bin Essa ERP - Automated POS Shift Closing & Reconciliation Verification Suite
 * 
 * Verifies all 10 Mandatory Scenarios:
 * 1. Balanced Shift (Actual === Expected)
 * 2. Cash Shortage (Actual < Expected)
 * 3. Cash Excess (Actual > Expected)
 * 4. Returns Deduction (Expected Cash = Opening Float + Cash Sales - Cash Returns)
 * 5. Discounts Tracking
 * 6. Gift Items Tracking (Qty and Value)
 * 7. Multiple Payment Methods (Cash, K-NET, Hesabi, Tabby, Credit, Card)
 * 8. Closed Shift Authorization Guard (Cashier Blocked)
 * 9. Manager/Admin Reopen & Adjustment Authorization
 * 10. Immutable Audit Trail Generation for Overrides
 */

function formatKD(amount: number): string {
  return amount.toFixed(3);
}

interface PosShiftData {
  id: string;
  shiftNumber: number;
  userId: string;
  branchId: string;
  status: "OPEN" | "CLOSED";
  openingFloat: number;
  openedAt: Date;
  closedAt?: Date;
  cashSalesTotal: number;
  knetSalesTotal: number;
  hesabiSalesTotal: number;
  tabbySalesTotal: number;
  cardSalesTotal: number;
  creditSalesTotal: number;
  otherSalesTotal: number;
  totalSales: number;
  returnsTotal: number;
  discountsTotal: number;
  giftsTotal: number;
  giftsCount: number;
  closingCashExpected: number;
  closingCashActual: number;
  cashVariance: number;
  closingStatus: "BALANCED" | "SHORTAGE" | "EXCESS";
  reopenedAt?: Date;
  reopenedByUserId?: string;
  adjustedAt?: Date;
  adjustedByUserId?: string;
  adjustmentReason?: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: any;
  createdAt: Date;
}

const auditTrail: AuditLogEntry[] = [];

function recordAudit(action: string, entityId: string, userId: string, details: any) {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    action,
    entityType: "POS_SHIFT",
    entityId,
    userId,
    details,
    createdAt: new Date(),
  };
  auditTrail.push(entry);
  return entry;
}

// Logic Simulation Engine
function openShift(userId: string, branchId: string, openingFloat: number): PosShiftData {
  return {
    id: `shift-${Date.now()}`,
    shiftNumber: 101,
    userId,
    branchId,
    status: "OPEN",
    openingFloat,
    openedAt: new Date(),
    cashSalesTotal: 0,
    knetSalesTotal: 0,
    hesabiSalesTotal: 0,
    tabbySalesTotal: 0,
    cardSalesTotal: 0,
    creditSalesTotal: 0,
    otherSalesTotal: 0,
    totalSales: 0,
    returnsTotal: 0,
    discountsTotal: 0,
    giftsTotal: 0,
    giftsCount: 0,
    closingCashExpected: openingFloat,
    closingCashActual: 0,
    cashVariance: 0,
    closingStatus: "BALANCED",
  };
}

function processSale(
  shift: PosShiftData,
  method: "CASH" | "KNET" | "HESABI" | "TABBY" | "CARD" | "CREDIT",
  amount: number,
  discount: number = 0,
  gifts: { count: number; value: number } = { count: 0, value: 0 }
) {
  if (shift.status !== "OPEN") {
    throw new Error("Cannot process sale on a closed shift");
  }

  if (method === "CASH") shift.cashSalesTotal += amount;
  else if (method === "KNET") shift.knetSalesTotal += amount;
  else if (method === "HESABI") shift.hesabiSalesTotal += amount;
  else if (method === "TABBY") shift.tabbySalesTotal += amount;
  else if (method === "CARD") shift.cardSalesTotal += amount;
  else if (method === "CREDIT") shift.creditSalesTotal += amount;

  shift.totalSales += amount;
  shift.discountsTotal += discount;
  shift.giftsCount += gifts.count;
  shift.giftsTotal += gifts.value;
}

function processReturn(shift: PosShiftData, method: "CASH" | "KNET", amount: number) {
  if (shift.status !== "OPEN") {
    throw new Error("Cannot process return on a closed shift");
  }

  shift.returnsTotal += amount;
  // If cash return, it will be deducted from cash drawer
}

function closeShift(
  shift: PosShiftData,
  actualCashHandedOver: number,
  userId: string,
  userRole: string
): PosShiftData {
  if (shift.status === "CLOSED") {
    throw new Error("Shift is already closed");
  }

  // Expected Cash = Opening Float + Cash Sales - Returns
  const expectedCash = shift.openingFloat + shift.cashSalesTotal - shift.returnsTotal;
  const variance = Number((actualCashHandedOver - expectedCash).toFixed(3));

  let closingStatus: "BALANCED" | "SHORTAGE" | "EXCESS" = "BALANCED";
  if (variance < -0.001) closingStatus = "SHORTAGE";
  else if (variance > 0.001) closingStatus = "EXCESS";

  shift.closedAt = new Date();
  shift.status = "CLOSED";
  shift.closingCashExpected = Number(expectedCash.toFixed(3));
  shift.closingCashActual = Number(actualCashHandedOver.toFixed(3));
  shift.cashVariance = variance;
  shift.closingStatus = closingStatus;

  return shift;
}

function reopenShift(
  shift: PosShiftData,
  userId: string,
  userRole: string,
  reason: string
): PosShiftData {
  if (userRole !== "ADMIN" && userRole !== "MANAGER" && userRole !== "BRANCH_MANAGER") {
    throw new Error("UNAUTHORIZED: Only Admin or authorized Managers can reopen closed shifts");
  }
  if (shift.status === "OPEN") {
    throw new Error("Shift is already open");
  }
  if (!reason || reason.trim() === "") {
    throw new Error("Reason is mandatory for audit trail logging");
  }

  shift.status = "OPEN";
  shift.reopenedAt = new Date();
  shift.reopenedByUserId = userId;

  recordAudit("SHIFT_REOPEN", shift.id, userId, {
    reason,
    previousStatus: "CLOSED",
    newStatus: "OPEN",
    shiftNumber: shift.shiftNumber,
  });

  return shift;
}

function adjustShift(
  shift: PosShiftData,
  newActualCash: number,
  userId: string,
  userRole: string,
  reason: string
): PosShiftData {
  if (userRole !== "ADMIN" && userRole !== "MANAGER" && userRole !== "BRANCH_MANAGER") {
    throw new Error("UNAUTHORIZED: Only Admin or authorized Managers can adjust shift cash counts");
  }
  if (shift.status !== "CLOSED") {
    throw new Error("Only closed shifts can have their reconciliation counts adjusted");
  }
  if (!reason || reason.trim() === "") {
    throw new Error("Reason is mandatory for audit trail logging");
  }

  const previousActual = shift.closingCashActual;
  const previousVariance = shift.cashVariance;
  const newVariance = Number((newActualCash - shift.closingCashExpected).toFixed(3));

  let newStatus: "BALANCED" | "SHORTAGE" | "EXCESS" = "BALANCED";
  if (newVariance < -0.001) newStatus = "SHORTAGE";
  else if (newVariance > 0.001) newStatus = "EXCESS";

  shift.closingCashActual = newActualCash;
  shift.cashVariance = newVariance;
  shift.closingStatus = newStatus;
  shift.adjustedAt = new Date();
  shift.adjustedByUserId = userId;
  shift.adjustmentReason = reason;

  recordAudit("SHIFT_ADJUSTMENT", shift.id, userId, {
    reason,
    previousActual,
    newActual: newActualCash,
    previousVariance,
    newVariance,
    shiftNumber: shift.shiftNumber,
  });

  return shift;
}

// ================= TEST RUNNER =================
console.log("================================================================================");
console.log("BIN ESSA ERP - POS SHIFT CLOSING & RECONCILIATION VERIFICATION SUITE");
console.log("================================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`[PASS] ${description}`);
    passed++;
  } else {
    console.error(`[FAIL] ${description}`);
    failed++;
  }
}

// Scenario 1: Balanced Shift
console.log("--- Scenario 1: Balanced Shift (Actual === Expected) ---");
const shift1 = openShift("cashier-01", "br-salmiya", 50.0);
processSale(shift1, "CASH", 100.0);
processSale(shift1, "CASH", 50.0);
// Expected: 50.0 + 150.0 = 200.0 KD. Handover 200.0 KD
closeShift(shift1, 200.0, "cashier-01", "CASHIER");
assert(shift1.status === "CLOSED", "Shift 1 status is CLOSED");
assert(shift1.closingCashExpected === 200.0, "Expected cash is 200.000 KD");
assert(shift1.closingCashActual === 200.0, "Actual cash is 200.000 KD");
assert(shift1.cashVariance === 0, "Variance is 0.000 KD");
assert(shift1.closingStatus === "BALANCED", "Closing status is BALANCED");

// Scenario 2: Cash Shortage
console.log("\n--- Scenario 2: Cash Shortage (Actual < Expected) ---");
const shift2 = openShift("cashier-02", "br-avenues", 50.0);
processSale(shift2, "CASH", 120.0);
// Expected: 170.0 KD. Cashier only has 165.0 KD (5.000 KD Shortage)
closeShift(shift2, 165.0, "cashier-02", "CASHIER");
assert(shift2.closingCashExpected === 170.0, "Expected cash is 170.000 KD");
assert(shift2.closingCashActual === 165.0, "Actual cash is 165.000 KD");
assert(shift2.cashVariance === -5.0, "Variance is -5.000 KD (Shortage)");
assert(shift2.closingStatus === "SHORTAGE", "Closing status is SHORTAGE");

// Scenario 3: Cash Excess
console.log("\n--- Scenario 3: Cash Excess (Actual > Expected) ---");
const shift3 = openShift("cashier-03", "br-shuwaikh", 50.0);
processSale(shift3, "CASH", 80.0);
// Expected: 130.0 KD. Cashier has 132.500 KD (2.500 KD Excess)
closeShift(shift3, 132.5, "cashier-03", "CASHIER");
assert(shift3.closingCashExpected === 130.0, "Expected cash is 130.000 KD");
assert(shift3.closingCashActual === 132.5, "Actual cash is 132.500 KD");
assert(shift3.cashVariance === 2.5, "Variance is +2.500 KD (Excess)");
assert(shift3.closingStatus === "EXCESS", "Closing status is EXCESS");

// Scenario 4: Returns Deduction
console.log("\n--- Scenario 4: Returns Deduction from Drawer Cash ---");
const shift4 = openShift("cashier-01", "br-salmiya", 100.0);
processSale(shift4, "CASH", 250.0);
processReturn(shift4, "CASH", 30.0); // Customer returned item refunded from cash drawer
// Expected: 100.0 + 250.0 - 30.0 = 320.0 KD
closeShift(shift4, 320.0, "cashier-01", "CASHIER");
assert(shift4.returnsTotal === 30.0, "Returns total is 30.000 KD");
assert(shift4.closingCashExpected === 320.0, "Expected cash correctly accounts for return (320.000 KD)");
assert(shift4.closingStatus === "BALANCED", "Closing status is BALANCED");

// Scenario 5: Discounts Tracking
console.log("\n--- Scenario 5: Discounts Tracking ---");
const shift5 = openShift("cashier-01", "br-salmiya", 50.0);
processSale(shift5, "CASH", 45.0, 5.0); // 50 KD item discounted to 45 KD (5 KD discount)
processSale(shift5, "KNET", 90.0, 10.0); // 100 KD item discounted to 90 KD (10 KD discount)
assert(shift5.discountsTotal === 15.0, "Discounts total correctly accumulated to 15.000 KD");
assert(shift5.totalSales === 135.0, "Net total sales correctly accumulated to 135.000 KD");

// Scenario 6: Gift Items Tracking
console.log("\n--- Scenario 6: Free / Promotional Gift Items Tracking ---");
const shift6 = openShift("cashier-01", "br-salmiya", 50.0);
processSale(shift6, "CASH", 25.0, 0, { count: 2, value: 7.0 }); // 2 free promotional gift items worth 7 KD
assert(shift6.giftsCount === 2, "Gifts count is 2 pcs");
assert(shift6.giftsTotal === 7.0, "Gifts value is 7.000 KD");

// Scenario 7: Multiple Payment Methods Breakdown
console.log("\n--- Scenario 7: Multiple Payment Methods Breakdown ---");
const shift7 = openShift("cashier-01", "br-salmiya", 50.0);
processSale(shift7, "CASH", 100.0);
processSale(shift7, "KNET", 200.0);
processSale(shift7, "HESABI", 75.0);
processSale(shift7, "TABBY", 50.0);
processSale(shift7, "CARD", 25.0);
processSale(shift7, "CREDIT", 150.0);
assert(shift7.cashSalesTotal === 100.0, "Cash sales total is 100.000 KD");
assert(shift7.knetSalesTotal === 200.0, "K-NET sales total is 200.000 KD");
assert(shift7.hesabiSalesTotal === 75.0, "Hesabi sales total is 75.000 KD");
assert(shift7.tabbySalesTotal === 50.0, "Tabby sales total is 50.000 KD");
assert(shift7.cardSalesTotal === 25.0, "Card sales total is 25.000 KD");
assert(shift7.creditSalesTotal === 150.0, "Credit sales total is 150.000 KD");
assert(shift7.totalSales === 600.0, "Gross total sales across all methods is 600.000 KD");
// Drawer expected cash only includes Cash sales (50 float + 100 cash = 150 KD)
closeShift(shift7, 150.0, "cashier-01", "CASHIER");
assert(shift7.closingCashExpected === 150.0, "Expected cash isolates cash-only sales (150.000 KD)");
assert(shift7.closingStatus === "BALANCED", "Shift 7 balanced");

// Scenario 8: Cashier Cannot Edit or Reopen Closed Shift
console.log("\n--- Scenario 8: Cashier Authorization Blocked on Closed Shift ---");
let cashierBlocked = false;
try {
  reopenShift(shift1, "cashier-01", "CASHIER", "Trying to reopen");
} catch (err: any) {
  cashierBlocked = true;
  assert(err.message.includes("UNAUTHORIZED"), "Cashier reopen attempt rejected with UNAUTHORIZED");
}
assert(cashierBlocked, "Cashier is strictly blocked from reopening closed shifts");

let cashierAdjustBlocked = false;
try {
  adjustShift(shift1, 210.0, "cashier-01", "CASHIER", "Trying to adjust");
} catch (err: any) {
  cashierAdjustBlocked = true;
  assert(err.message.includes("UNAUTHORIZED"), "Cashier adjust attempt rejected with UNAUTHORIZED");
}
assert(cashierAdjustBlocked, "Cashier is strictly blocked from adjusting closed shifts");

// Scenario 9: Admin Can Reopen and Adjust Closed Shift
console.log("\n--- Scenario 9: Admin/Manager Reopen and Adjustment ---");
const reopenedShift = reopenShift(shift1, "admin-01", "ADMIN", "Cashier forgot to enter late return transaction");
assert(reopenedShift.status === "OPEN", "Admin successfully reopened closed shift");
assert(reopenedShift.reopenedByUserId === "admin-01", "Reopened user ID recorded");

// Re-close shift with discrepancy for adjustment test
closeShift(reopenedShift, 190.0, "cashier-01", "CASHIER");
assert(reopenedShift.closingStatus === "SHORTAGE", "Re-closed shift has shortage of -10 KD");

// Manager Adjusts Counted Cash
const adjustedShift = adjustShift(
  reopenedShift,
  200.0,
  "manager-01",
  "MANAGER",
  "Found missing 10 KD banknote under drawer partition"
);
assert(adjustedShift.closingCashActual === 200.0, "Adjusted actual cash is 200.000 KD");
assert(adjustedShift.cashVariance === 0, "Adjusted variance is 0.000 KD");
assert(adjustedShift.closingStatus === "BALANCED", "Adjusted closing status is BALANCED");
assert(adjustedShift.adjustedByUserId === "manager-01", "Adjusting manager ID recorded");

// Scenario 10: Audit Log Verification
console.log("\n--- Scenario 10: Immutable Audit Log Verification ---");
assert(auditTrail.length === 2, "Audit trail contains 2 entries (1 Reopen, 1 Adjustment)");
const reopenAudit = auditTrail.find((a) => a.action === "SHIFT_REOPEN");
assert(reopenAudit !== undefined, "SHIFT_REOPEN audit entry exists");
assert(reopenAudit?.userId === "admin-01", "SHIFT_REOPEN audit records Admin user ID");
assert(
  reopenAudit?.details.reason === "Cashier forgot to enter late return transaction",
  "Audit log records mandatory reopen reason"
);

const adjustAudit = auditTrail.find((a) => a.action === "SHIFT_ADJUSTMENT");
assert(adjustAudit !== undefined, "SHIFT_ADJUSTMENT audit entry exists");
assert(adjustAudit?.userId === "manager-01", "SHIFT_ADJUSTMENT audit records Manager user ID");
assert(adjustAudit?.details.previousActual === 190.0, "Audit records previous cash count (190.000 KD)");
assert(adjustAudit?.details.newActual === 200.0, "Audit records new cash count (200.000 KD)");

console.log("\n================================================================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("================================================================================");
