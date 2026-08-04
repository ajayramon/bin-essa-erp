// Core domain types shared across the app. Stage 1: shapes only, no persistence.

export type Locale = "en" | "ar";

export type BrandId = "smoking" | "khiran" | "jmart";

export interface Brand {
  id: BrandId;
  nameEn: string;
  nameAr: string;
  accent: string; // tailwind color token, e.g. "brand-khiran"
}

export interface Branch {
  id: string;
  brandId: BrandId;
  nameEn: string;
  nameAr: string;
  city: string;
  type: "retail" | "wholesale" | "retail-wholesale";
}

export type Role =
  | "admin"
  | "branch_manager"
  | "accountant"
  | "cashier"
  | "storekeeper"
  | "sales_rep"
  | "b2b_customer";

export interface User {
  id: string;
  nameEn: string;
  nameAr: string;
  role: Role;
  branchId: string | null; // null = head office / all-branch access
}

export type ItemCategory =
  | "disposable_vapes"
  | "pod_systems"
  | "nicotine_pouches"
  | "dokha_medwakh"
  | "cigarette_lighters"
  | "rolling_papers"
  | "rolling_tobacco_hbt"
  | "pipe_accessories"
  | "general_smoking_accessories"
  | "marine_outdoor"
  | "custom_gifts_signage"
  | "licensed_collectibles";

// Visibility controls which company/companies an item or category appears in.
// "inherit" = follow the category's default (see CategoryVisibilityMap).
// "override" = use this item's own companies list instead of the category default.
export interface ItemVisibility {
  mode: "inherit" | "override";
  companies: BrandId[]; // explicit list, only used when mode is "override"
}

export interface Item {
  id: string;
  sku: string;
  barcode: string;
  nameEn: string;
  nameAr: string;
  category: ItemCategory;
  brandId: BrandId;
  costPriceKd: number;
  sellPriceKd: number;
  wholesalePriceKd: number;
  stockByBranch: Record<string, number>; // branchId -> quantity
  hasVariants: boolean;
  hasSerials: boolean;
  visibility: ItemVisibility;
}

// Default visibility per category. Every category must have an entry here.
export type CategoryVisibilityMap = Record<ItemCategory, BrandId[]>;

export type PaymentMethod = "cash" | "card" | "knet" | "online";

export interface Customer {
  id: string;
  nameEn: string;
  nameAr: string;
  customerType: "retail" | "wholesale" | "b2b_portal";
  balanceKd: number;
  creditLimitKd: number;
}

export interface Supplier {
  id: string;
  nameEn: string;
  nameAr: string;
  contactPhone: string;
  contactEmail: string;
}

export interface PurchaseOrderLine {
  itemId: string;
  quantity: number;
  unitCostKd: number;
}

export interface PurchaseOrder {
  poNumber: string;
  supplierId: string;
  brandId: BrandId;
  lines: PurchaseOrderLine[];
  landedCostKd: number;
  status: "draft" | "pending_approval" | "approved" | "received";
}

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export interface Account {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  type: AccountType;
  brandId: BrandId;
  balanceKd: number;
}

export interface JournalEntryLine {
  accountId: string;
  debitKd: number;
  creditKd: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  brandId: BrandId;
  memo: string;
  lines: JournalEntryLine[];
}

export interface Employee {
  id: string;
  nameEn: string;
  nameAr: string;
  role: Role;
  brandId: BrandId;
  branchId: string | null; // null = head office / all-branch role
  phone: string;
  joinDate: string; // ISO date string, e.g. "2023-04-01"
  basicSalaryKd: number;
  allowancesKd: number; // STAGE 1 SAMPLE DATA: flat allowance figure, real structure unconfirmed
  status: "active" | "inactive";
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  month: string; // "YYYY-MM"
  basicSalaryKd: number;
  allowancesKd: number;
  deductionsKd: number; // STAGE 1 SAMPLE DATA: unconfirmed business rule, no real deduction formula from client yet
  netPayKd: number;
  status: "draft" | "processed" | "paid";
}
export * from "./sales-invoice";
