import { Role } from "@/lib/types";

export type ModuleKey =
  | "dashboard"
  | "groupDashboard"
  | "pos"
  | "inventory"
  | "customers"
  | "sales-ops"
  | "purchasing"
  | "accounting"
  | "promotions-group"
  | "hr"
  | "b2b"
  | "settings";

export interface RolePermission {
  role: Role;
  roleNameEn: string;
  roleNameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  modules: ModuleKey[];
  allowedSubmodules?: Record<string, string[]>;
}

export const rolePermissions: RolePermission[] = [
  {
    role: "admin",
    roleNameEn: "System Administrator",
    roleNameAr: "مدير النظام العام",
    descriptionEn: "Full enterprise access across all 14 branches, group consolidation, accounting, settings, and role management.",
    descriptionAr: "صلاحيات كاملة على كافة الفروع ولوحة المجموعة والحسابات والإعدادات وإدارة الأدوار.",
    modules: [
      "dashboard",
      "groupDashboard",
      "pos",
      "inventory",
      "customers",
      "sales-ops",
      "purchasing",
      "accounting",
      "promotions-group",
      "hr",
      "b2b",
      "settings",
    ],
  },
  {
    role: "branch_manager",
    roleNameEn: "Branch Operations Manager",
    roleNameAr: "مدير عمليات الفرع",
    descriptionEn: "Branch operations, POS cash drawer oversight & manager overrides, stock audits, purchasing requisitions/POs, and team attendance.",
    descriptionAr: "إدارة عمليات الفرع واعتمادات نقاط البيع والرقابة على المخزون وطلبات الشراء ومتابعة الموظفين.",
    modules: [
      "dashboard",
      "pos",
      "inventory",
      "customers",
      "sales-ops",
      "purchasing",
      "promotions-group",
      "hr",
    ],
    allowedSubmodules: {
      purchasing: ["purchase-requisitions", "purchase-orders-list", "goods-receipts"],
      "sales-ops": ["sales-quotations", "sales-orders", "delivery-notes", "customer-receipts"],
      "promotions-group": ["promotions", "loyalty-program"],
      hr: ["employees", "payroll"],
    },
  },
  {
    role: "accountant",
    roleNameEn: "Financial Accountant",
    roleNameAr: "المحاسب المالي",
    descriptionEn: "General ledger, Chart of Accounts, journal entries, trial balance, financial statements, AR/AP aging, cash/bank vaults, expenses, vendor bills & vouchers.",
    descriptionAr: "دفتر الأستاذ ودليل الحسابات والقيود وميزان المراجعة والقوائم المالية وأعمار الديون وفواتير وسندات الموردين والعملاء.",
    modules: [
      "dashboard",
      "customers",
      "sales-ops",
      "purchasing",
      "accounting",
    ],
    allowedSubmodules: {
      "sales-ops": ["customer-receipts"],
      purchasing: ["purchase-invoices-list", "supplier-payments"],
      accounting: [
        "financial-statements",
        "chart-of-accounts",
        "cash-management",
        "bank-management",
        "expenses-mgmt",
        "cost-centers-mgmt",
        "journal-entry",
        "trial-balance",
        "general-ledger",
        "pdc-tracking",
      ],
    },
  },
  {
    role: "cashier",
    roleNameEn: "Retail POS Cashier",
    roleNameAr: "كاشير نقطة البيع",
    descriptionEn: "Retail POS sales counter terminal, customer lookup, barcode checkout, split tender payments, and daily shift cash reconciliation.",
    descriptionAr: "شاشة الكاشير والمبيعات السريعة، مسح الباركود، الدفع المتعدد، والتقفيل اليومي للعهدة.",
    modules: ["pos", "customers"],
  },
  {
    role: "storekeeper",
    roleNameEn: "Warehouse Storekeeper",
    roleNameAr: "أمين المستودع",
    descriptionEn: "Physical inventory handling, stock transfer dispatch & receipt, damage/shrinkage adjustments, physical stock counts, and Goods Receipt Notes (GRN).",
    descriptionAr: "الاستلام والتسليم الفعلي، سندات استلام البضاعة (GRN)، سندات التسليم (DN)، تحويلات وجرد وتعديل المخزون.",
    modules: ["inventory", "purchasing", "sales-ops"],
    allowedSubmodules: {
      purchasing: ["goods-receipts"],
      "sales-ops": ["delivery-notes"],
    },
  },
  {
    role: "sales_rep",
    roleNameEn: "Wholesale Sales Representative",
    roleNameAr: "مندوب مبيعات الجملة",
    descriptionEn: "B2B wholesale sales lifecycle: client price quotations, sales orders, delivery tracking, customer payment collections (RV), and loyalty lookup.",
    descriptionAr: "مبيعات الجملة: إصدار عروض الأسعار وأوامر البيع ومتابعة التسليم وسندات تحصيل الدفعات من عملاء الجملة.",
    modules: ["customers", "sales-ops", "promotions-group"],
    allowedSubmodules: {
      "sales-ops": ["sales-quotations", "sales-orders", "delivery-notes", "customer-receipts"],
      "promotions-group": ["promotions", "loyalty-program"],
    },
  },
];

