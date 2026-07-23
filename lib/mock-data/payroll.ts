import { PayrollEntry } from "@/lib/types";

// STAGE 1 SAMPLE DATA — placeholder payroll for May–June 2025.
// Deduction figures are unconfirmed; no real formula from client yet.
// netPayKd = basicSalaryKd + allowancesKd - deductionsKd
export const payrollEntries: PayrollEntry[] = [
  { id: "pr-01", employeeId: "emp-01", month: "2025-06", basicSalaryKd: 900, allowancesKd: 150, deductionsKd: 50,  netPayKd: 1000, status: "paid" },
  { id: "pr-02", employeeId: "emp-02", month: "2025-06", basicSalaryKd: 500, allowancesKd: 80,  deductionsKd: 25,  netPayKd: 555,  status: "paid" },
  { id: "pr-03", employeeId: "emp-03", month: "2025-06", basicSalaryKd: 220, allowancesKd: 30,  deductionsKd: 0,   netPayKd: 250,  status: "processed" },
  { id: "pr-04", employeeId: "emp-04", month: "2025-06", basicSalaryKd: 220, allowancesKd: 30,  deductionsKd: 0,   netPayKd: 250,  status: "processed" },
  { id: "pr-05", employeeId: "emp-05", month: "2025-06", basicSalaryKd: 260, allowancesKd: 40,  deductionsKd: 0,   netPayKd: 300,  status: "draft" },
  { id: "pr-06", employeeId: "emp-06", month: "2025-06", basicSalaryKd: 250, allowancesKd: 60,  deductionsKd: 0,   netPayKd: 310,  status: "draft" },
  { id: "pr-07", employeeId: "emp-07", month: "2025-06", basicSalaryKd: 480, allowancesKd: 70,  deductionsKd: 25,  netPayKd: 525,  status: "paid" },
  { id: "pr-08", employeeId: "emp-08", month: "2025-06", basicSalaryKd: 220, allowancesKd: 30,  deductionsKd: 0,   netPayKd: 250,  status: "draft" },
  { id: "pr-09", employeeId: "emp-09", month: "2025-06", basicSalaryKd: 500, allowancesKd: 80,  deductionsKd: 25,  netPayKd: 555,  status: "paid" },
  { id: "pr-10", employeeId: "emp-10", month: "2025-06", basicSalaryKd: 250, allowancesKd: 50,  deductionsKd: 0,   netPayKd: 300,  status: "draft" },
  { id: "pr-11", employeeId: "emp-11", month: "2025-06", basicSalaryKd: 500, allowancesKd: 80,  deductionsKd: 25,  netPayKd: 555,  status: "paid" },
  { id: "pr-12", employeeId: "emp-12", month: "2025-06", basicSalaryKd: 220, allowancesKd: 30,  deductionsKd: 0,   netPayKd: 250,  status: "draft" },
  { id: "pr-13", employeeId: "emp-13", month: "2025-06", basicSalaryKd: 250, allowancesKd: 50,  deductionsKd: 0,   netPayKd: 300,  status: "draft" },
  { id: "pr-14", employeeId: "emp-01", month: "2025-05", basicSalaryKd: 900, allowancesKd: 150, deductionsKd: 50,  netPayKd: 1000, status: "paid" },
  { id: "pr-15", employeeId: "emp-02", month: "2025-05", basicSalaryKd: 500, allowancesKd: 80,  deductionsKd: 25,  netPayKd: 555,  status: "paid" },
  { id: "pr-16", employeeId: "emp-07", month: "2025-05", basicSalaryKd: 480, allowancesKd: 70,  deductionsKd: 25,  netPayKd: 525,  status: "paid" },
  { id: "pr-17", employeeId: "emp-09", month: "2025-05", basicSalaryKd: 500, allowancesKd: 80,  deductionsKd: 25,  netPayKd: 555,  status: "paid" },
  { id: "pr-18", employeeId: "emp-11", month: "2025-05", basicSalaryKd: 500, allowancesKd: 80,  deductionsKd: 25,  netPayKd: 555,  status: "paid" },
];
