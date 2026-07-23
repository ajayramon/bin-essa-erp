import type { Brand } from "@/lib/types";

// Group Dashboard mock data — realistic KD figures across all three
// companies. Stage 2 will replace this with live data from the backend.

export interface CompanySalesSummary {
  brandId: Brand["id"];
  todaySales: number;
  monthSales: number;
  monthTarget: number;
}

export const companySales: CompanySalesSummary[] = [
  { brandId: "smoking", todaySales: 8420, monthSales: 186500, monthTarget: 210000 },
  { brandId: "khiran", todaySales: 1150, monthSales: 24800, monthTarget: 30000 },
  { brandId: "jmart", todaySales: 640, monthSales: 15200, monthTarget: 18000 },
];

export interface BranchPerformance {
  branchId: string;
  branchNameEn: string;
  branchNameAr: string;
  brandId: Brand["id"];
  monthSales: number;
}

export const branchPerformance: BranchPerformance[] = [
  { branchId: "smoking-salmiya", branchNameEn: "Salmiya Branch", branchNameAr: "فرع السالمية", brandId: "smoking", monthSales: 32400 },
  { branchId: "smoking-hawally", branchNameEn: "Hawally Branch", branchNameAr: "فرع حولي", brandId: "smoking", monthSales: 29100 },
  { branchId: "smoking-farwaniya", branchNameEn: "Farwaniya Branch", branchNameAr: "فرع الفروانية", brandId: "smoking", monthSales: 27650 },
  { branchId: "smoking-jahra", branchNameEn: "Jahra Branch", branchNameAr: "فرع الجهراء", brandId: "smoking", monthSales: 11200 },
  { branchId: "smoking-fahaheel", branchNameEn: "Fahaheel Branch", branchNameAr: "فرع الفحيحيل", brandId: "smoking", monthSales: 9800 },
  { branchId: "khiran-main", branchNameEn: "Khiran Main Store", branchNameAr: "خيران - المعرض الرئيسي", brandId: "khiran", monthSales: 24800 },
  { branchId: "jmart-avenues", branchNameEn: "The Avenues", branchNameAr: "الأفنيوز", brandId: "jmart", monthSales: 9400 },
  { branchId: "jmart-marina", branchNameEn: "Marina Mall", branchNameAr: "مارينا مول", brandId: "jmart", monthSales: 5800 },
];

export interface LowStockAlert {
  itemNameEn: string;
  itemNameAr: string;
  branchNameEn: string;
  branchNameAr: string;
  qtyRemaining: number;
  reorderLevel: number;
}

export const lowStockAlerts: LowStockAlert[] = [
  { itemNameEn: "IQOS Terea Yellow", itemNameAr: "آيكوس تيريا أصفر", branchNameEn: "Salmiya Branch", branchNameAr: "فرع السالمية", qtyRemaining: 8, reorderLevel: 30 },
  { itemNameEn: "Velo Nicotine Pouches - Mint", itemNameAr: "فيلو أكياس نيكوتين - نعناع", branchNameEn: "Hawally Branch", branchNameAr: "فرع حولي", qtyRemaining: 5, reorderLevel: 25 },
  { itemNameEn: "Clipper Lighter - Assorted", itemNameAr: "ولاعة كليبر - متنوع", branchNameEn: "Farwaniya Branch", branchNameAr: "فرع الفروانية", qtyRemaining: 12, reorderLevel: 40 },
];

export interface CashPosition {
  brandId: Brand["id"];
  cashOnHand: number;
  bankBalance: number;
}

export const cashPosition: CashPosition[] = [
  { brandId: "smoking", cashOnHand: 4200, bankBalance: 68500 },
  { brandId: "khiran", cashOnHand: 950, bankBalance: 12300 },
  { brandId: "jmart", cashOnHand: 380, bankBalance: 6100 },
];

export interface PendingPurchaseOrder {
  poNumber: string;
  supplierNameEn: string;
  supplierNameAr: string;
  brandId: Brand["id"];
  amount: number;
  daysWaiting: number;
}

export const pendingPurchaseOrders: PendingPurchaseOrder[] = [
  { poNumber: "PO-2026-0143", supplierNameEn: "Gulf Vape Distribution Co.", supplierNameAr: "شركة الخليج لتوزيع الفيب", brandId: "smoking", amount: 18400, daysWaiting: 3 },
  { poNumber: "PO-2026-0144", supplierNameEn: "Marine Gear International", supplierNameAr: "مارين جير إنترناشونال", brandId: "khiran", amount: 6200, daysWaiting: 1 },
  { poNumber: "PO-2026-0145", supplierNameEn: "Al Reem Printing Supplies", supplierNameAr: "الريم للوازم الطباعة", brandId: "jmart", amount: 2150, daysWaiting: 5 },
];
