import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Calculator,
  Users,
  Settings,
  Clock,
  Building2,
  Store,
  BookOpen,
  Tag,
  Receipt,
  Gift,
  Award,
  Landmark,
  Layers,
  ArrowRightLeft,
  FileCheck,
  FileSpreadsheet,
  Plus,
} from "lucide-react";

export interface NavLeaf {
  key: string;
  labelEn: string;
  labelAr: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export interface NavGroup {
  key: string;
  labelEn: string;
  labelAr: string;
  icon: LucideIcon;
  children: NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

// Shared module set — rendered once per brand group, tinted with that brand's
// own accent color. Routes are identical across brands; selecting a link also
// switches the active brand/branch context (handled in the Sidebar itself).
export const brandModules: NavEntry[] = [
  {
    key: "dashboard",
    labelEn: "Dashboard",
    labelAr: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "customers",
    labelEn: "Customers Master",
    labelAr: "سجل العملاء",
    href: "/customers",
    icon: Users,
  },
  {
    key: "pos",
    labelEn: "Point of Sale",
    labelAr: "نقطة البيع",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    key: "sales-ops",
    labelEn: "Sales & Distribution",
    labelAr: "المبيعات والتوزيع",
    icon: Store,
    children: [
      {
        key: "sales-quotations",
        labelEn: "Quotations (QT)",
        labelAr: "عروض الأسعار",
        href: "/sales/quotations",
        icon: FileSpreadsheet,
      },
      {
        key: "sales-orders",
        labelEn: "Sales Orders (SO)",
        labelAr: "أوامر البيع",
        href: "/sales/orders",
        icon: ShoppingCart,
      },
      {
        key: "delivery-notes",
        labelEn: "Delivery Notes (DN)",
        labelAr: "سندات التسليم",
        href: "/sales/deliveries",
        icon: Truck,
      },
      {
        key: "customer-receipts",
        labelEn: "Receipt Vouchers (AR)",
        labelAr: "سندات قبض العملاء",
        href: "/sales/receipts",
        icon: Receipt,
      },
    ],
  },
  {
    key: "inventory-ops",
    labelEn: "Inventory & Stock",
    labelAr: "الأصناف والمخزون",
    icon: Package,
    children: [
      {
        key: "inventory-list",
        labelEn: "Item Master Catalog",
        labelAr: "سجل وكتالوج الأصناف",
        href: "/inventory",
        icon: Package,
      },
      {
        key: "inventory-new",
        labelEn: "Create New Item",
        labelAr: "إضافة صنف جديد",
        href: "/inventory/new",
        icon: Plus,
      },
      {
        key: "stock-transfers",
        labelEn: "Branch Transfers (TR)",
        labelAr: "التحويلات بين الفروع",
        href: "/inventory/transfers",
        icon: ArrowRightLeft,
      },
      {
        key: "stock-adjustments",
        labelEn: "Stock Adjustments",
        labelAr: "تسويات المخزون",
        href: "/inventory/adjustments",
        icon: Layers,
      },
      {
        key: "stock-counts",
        labelEn: "Physical Cycle Counts",
        labelAr: "الجرد الفعلي والدوري",
        href: "/inventory/counts",
        icon: FileCheck,
      },
      {
        key: "serial-tracking",
        labelEn: "Serial Tracking",
        labelAr: "تتبع الأرقام التسلسلية",
        href: "/inventory/serial-tracking",
        icon: Layers,
      },
      {
        key: "item-modifiers",
        labelEn: "Item Modifiers & Flavors",
        labelAr: "خيارات الأصناف والنكهات",
        href: "/inventory/item-modifiers",
        icon: Tag,
      },
    ],
  },
  {
    key: "purchasing",
    labelEn: "Purchasing & Invoices",
    labelAr: "المشتريات والموردين",
    icon: Truck,
    children: [
      {
        key: "purchase-requisitions",
        labelEn: "Purchase Requisitions (PR)",
        labelAr: "طلبات الشراء",
        href: "/purchasing/requisitions",
        icon: FileSpreadsheet,
      },
      {
        key: "purchase-orders-list",
        labelEn: "Purchase Orders (PO)",
        labelAr: "أوامر الشراء",
        href: "/purchasing/purchase-orders",
        icon: Truck,
      },
      {
        key: "goods-receipts",
        labelEn: "Goods Receipts (GRN)",
        labelAr: "سندات استلام البضاعة",
        href: "/purchasing/goods-receipts",
        icon: Package,
      },
      {
        key: "purchase-invoices-list",
        labelEn: "Vendor Bills (PI)",
        labelAr: "فواتير المشتريات",
        href: "/purchasing/purchase-invoices",
        icon: Receipt,
      },
      {
        key: "supplier-payments",
        labelEn: "Payment Vouchers (AP)",
        labelAr: "سندات صرف الموردين",
        href: "/purchasing/payments",
        icon: Landmark,
      },
    ],
  },
  {
    key: "accounting",
    labelEn: "Financial Accounting",
    labelAr: "المحاسبة والمالية",
    icon: Calculator,
    children: [
      {
        key: "financial-statements",
        labelEn: "Financial Statements (IFRS)",
        labelAr: "القوائم المالية",
        href: "/accounting/financial-statements",
        icon: FileSpreadsheet,
      },
      {
        key: "chart-of-accounts",
        labelEn: "Chart of Accounts",
        labelAr: "دليل الحسابات",
        href: "/accounting/chart-of-accounts",
        icon: Calculator,
      },
      {
        key: "cash-management",
        labelEn: "Cash & Vaults",
        labelAr: "الخزينة والنقدية",
        href: "/accounting/cash-management",
        icon: Landmark,
      },
      {
        key: "bank-management",
        labelEn: "Bank & Reconciliations",
        labelAr: "البنوك والتسويات",
        href: "/accounting/bank-management",
        icon: Building2,
      },
      {
        key: "expenses-mgmt",
        labelEn: "Operating Expenses",
        labelAr: "المصروفات التشغيلية",
        href: "/accounting/expenses",
        icon: Receipt,
      },
      {
        key: "cost-centers-mgmt",
        labelEn: "Cost Centers",
        labelAr: "مراكز التكلفة",
        href: "/accounting/cost-centers",
        icon: Layers,
      },
      {
        key: "journal-entry",
        labelEn: "Manual Journal Entry",
        labelAr: "قيد يومية يدوي",
        href: "/accounting/journal-entry",
        icon: Calculator,
      },
      {
        key: "trial-balance",
        labelEn: "Trial Balance",
        labelAr: "ميزان المراجعة",
        href: "/accounting/trial-balance",
        icon: Calculator,
      },
      {
        key: "general-ledger",
        labelEn: "General Ledger",
        labelAr: "دفتر الأستاذ العام",
        href: "/accounting/general-ledger",
        icon: BookOpen,
      },
      {
        key: "pdc-tracking",
        labelEn: "PDC Tracking",
        labelAr: "متابعة الشيكات الآجلة",
        href: "/accounting/pdc-tracking",
        icon: Clock,
      },
    ],
  },
  {
    key: "promotions-group",
    labelEn: "Promotions & Loyalty",
    labelAr: "العروض وبرامج الولاء",
    icon: Tag,
    children: [
      {
        key: "promotions",
        labelEn: "Promotions & Discounts",
        labelAr: "العروض والتخفيضات",
        href: "/promotions",
        icon: Tag,
      },
      {
        key: "loyalty-program",
        labelEn: "Customer Loyalty & Points",
        labelAr: "برنامج مكافآت العملاء",
        href: "/promotions/loyalty",
        icon: Gift,
      },
    ],
  },
  {
    key: "b2b",
    labelEn: "B2B Wholesale Portal",
    labelAr: "بوابة عملاء الجملة",
    href: "/b2b",
    icon: Store,
  },
  {
    key: "hr",
    labelEn: "HR & Payroll",
    labelAr: "الموارد البشرية والرواتب",
    icon: Users,
    children: [
      {
        key: "employees",
        labelEn: "Employees Directory",
        labelAr: "دليل الموظفين",
        href: "/hr/employees",
        icon: Users,
      },
      {
        key: "payroll",
        labelEn: "Payroll & Wage Processing",
        labelAr: "مسير الرواتب",
        href: "/hr/payroll",
        icon: Calculator,
      },
    ],
  },
  {
    key: "settings",
    labelEn: "Enterprise Settings",
    labelAr: "إعدادات النظام",
    icon: Settings,
    children: [
      {
        key: "branches",
        labelEn: "14-Branch Management",
        labelAr: "إدارة الفروع الـ 14",
        href: "/settings/branches",
        icon: Building2,
      },
      {
        key: "commissions-settings",
        labelEn: "Sales Targets & Commission",
        labelAr: "أهداف المبيعات والعمولات",
        href: "/settings/commissions",
        icon: Award,
      },
      {
        key: "roles-permissions",
        labelEn: "Roles & Security Guards",
        labelAr: "الأدوار والصلاحيات",
        href: "/settings/roles-permissions",
        icon: Settings,
      },
    ],
  },
];

// Shown only to head-office / authorized management users — sits above the
// three brand groups. Routes to a consolidated dashboard covering sales,
// inventory, purchasing, accounting, KPIs, and branch performance across all
// companies, with drill-down into each individual company.
export const groupDashboardItem: NavLeaf = {
  key: "group-dashboard",
  labelEn: "Group Dashboard",
  labelAr: "لوحة تحكم المجموعة",
  href: "/group-dashboard",
  icon: Building2,
};