import type { Account } from "@/lib/types";

// STAGE 1 SAMPLE DATA — this is a realistic placeholder chart of accounts,
// not the client's actual chart. Replace once he provides his real account
// list/codes. Scoped per brand (each company keeps its own set of accounts);
// flag to the user if the client wants one shared/consolidated chart instead.
export const accounts: Account[] = [
  // --- Bin Essa Smoking Center ---
  { id: "acc-s-1000", code: "1000", nameEn: "Cash on Hand", nameAr: "النقد في الصندوق", type: "asset", brandId: "smoking", balanceKd: 4250.500 },
  { id: "acc-s-1010", code: "1010", nameEn: "Bank Account - NBK", nameAr: "حساب بنكي - بنك الكويت الوطني", type: "asset", brandId: "smoking", balanceKd: 18420.750 },
  { id: "acc-s-1200", code: "1200", nameEn: "Accounts Receivable", nameAr: "ذمم مدينة", type: "asset", brandId: "smoking", balanceKd: 6120.000 },
  { id: "acc-s-1400", code: "1400", nameEn: "Inventory", nameAr: "المخزون", type: "asset", brandId: "smoking", balanceKd: 52300.000 },
  { id: "acc-s-2000", code: "2000", nameEn: "Accounts Payable", nameAr: "ذمم دائنة", type: "liability", brandId: "smoking", balanceKd: 9840.250 },
  { id: "acc-s-2100", code: "2100", nameEn: "Accrued Expenses", nameAr: "مصروفات مستحقة", type: "liability", brandId: "smoking", balanceKd: 1150.000 },
  { id: "acc-s-3000", code: "3000", nameEn: "Owner's Capital", nameAr: "رأس مال المالك", type: "equity", brandId: "smoking", balanceKd: 60000.000 },
  { id: "acc-s-3100", code: "3100", nameEn: "Retained Earnings", nameAr: "الأرباح المحتجزة", type: "equity", brandId: "smoking", balanceKd: 12400.000 },
  { id: "acc-s-4000", code: "4000", nameEn: "Retail Sales", nameAr: "مبيعات التجزئة", type: "revenue", brandId: "smoking", balanceKd: 84500.000 },
  { id: "acc-s-4010", code: "4010", nameEn: "Wholesale Sales", nameAr: "مبيعات الجملة", type: "revenue", brandId: "smoking", balanceKd: 31200.000 },
  { id: "acc-s-5000", code: "5000", nameEn: "Cost of Goods Sold", nameAr: "تكلفة البضاعة المباعة", type: "expense", brandId: "smoking", balanceKd: 62100.000 },
  { id: "acc-s-5100", code: "5100", nameEn: "Rent Expense", nameAr: "مصروف الإيجار", type: "expense", brandId: "smoking", balanceKd: 14400.000 },
  { id: "acc-s-5200", code: "5200", nameEn: "Salaries & Wages", nameAr: "الرواتب والأجور", type: "expense", brandId: "smoking", balanceKd: 28600.000 },

  // --- Bin Essa Khiran ---
  { id: "acc-k-1000", code: "1000", nameEn: "Cash on Hand", nameAr: "النقد في الصندوق", type: "asset", brandId: "khiran", balanceKd: 1120.000 },
  { id: "acc-k-1010", code: "1010", nameEn: "Bank Account - NBK", nameAr: "حساب بنكي - بنك الكويت الوطني", type: "asset", brandId: "khiran", balanceKd: 5230.000 },
  { id: "acc-k-1400", code: "1400", nameEn: "Inventory", nameAr: "المخزون", type: "asset", brandId: "khiran", balanceKd: 18400.000 },
  { id: "acc-k-2000", code: "2000", nameEn: "Accounts Payable", nameAr: "ذمم دائنة", type: "liability", brandId: "khiran", balanceKd: 2100.000 },
  { id: "acc-k-3000", code: "3000", nameEn: "Owner's Capital", nameAr: "رأس مال المالك", type: "equity", brandId: "khiran", balanceKd: 15000.000 },
  { id: "acc-k-4000", code: "4000", nameEn: "Retail Sales", nameAr: "مبيعات التجزئة", type: "revenue", brandId: "khiran", balanceKd: 19800.000 },
  { id: "acc-k-5000", code: "5000", nameEn: "Cost of Goods Sold", nameAr: "تكلفة البضاعة المباعة", type: "expense", brandId: "khiran", balanceKd: 12600.000 },
  { id: "acc-k-5100", code: "5100", nameEn: "Rent Expense", nameAr: "مصروف الإيجار", type: "expense", brandId: "khiran", balanceKd: 3600.000 },

  // --- JM Art Zone ---
  { id: "acc-j-1000", code: "1000", nameEn: "Cash on Hand", nameAr: "النقد في الصندوق", type: "asset", brandId: "jmart", balanceKd: 980.000 },
  { id: "acc-j-1010", code: "1010", nameEn: "Bank Account - NBK", nameAr: "حساب بنكي - بنك الكويت الوطني", type: "asset", brandId: "jmart", balanceKd: 7640.000 },
  { id: "acc-j-1400", code: "1400", nameEn: "Inventory", nameAr: "المخزون", type: "asset", brandId: "jmart", balanceKd: 9200.000 },
  { id: "acc-j-2000", code: "2000", nameEn: "Accounts Payable", nameAr: "ذمم دائنة", type: "liability", brandId: "jmart", balanceKd: 1340.000 },
  { id: "acc-j-3000", code: "3000", nameEn: "Owner's Capital", nameAr: "رأس مال المالك", type: "equity", brandId: "jmart", balanceKd: 10000.000 },
  { id: "acc-j-4000", code: "4000", nameEn: "Custom Gifts Sales", nameAr: "مبيعات الهدايا المخصصة", type: "revenue", brandId: "jmart", balanceKd: 14200.000 },
  { id: "acc-j-5000", code: "5000", nameEn: "Cost of Goods Sold", nameAr: "تكلفة البضاعة المباعة", type: "expense", brandId: "jmart", balanceKd: 8100.000 },
  { id: "acc-j-5100", code: "5100", nameEn: "Rent Expense", nameAr: "مصروف الإيجار", type: "expense", brandId: "jmart", balanceKd: 2400.000 },
];
