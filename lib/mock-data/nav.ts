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
    key: "pos",
    labelEn: "Point of Sale",
    labelAr: "نقطة البيع",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    key: "promotions",
    labelEn: "Promotions & Discounts",
    labelAr: "العروض والتخفيضات",
    href: "/promotions",
    icon: Tag,
  },
  {
    key: "inventory",
    labelEn: "Inventory",
    labelAr: "المخزون",
    href: "/inventory",
    icon: Package,
  },
  {
    key: "purchasing",
    labelEn: "Purchasing & Invoices",
    labelAr: "المشتريات والفواتير",
    icon: Truck,
    children: [
      {
        key: "purchase-invoices-list",
        labelEn: "Purchase Invoices (Bills)",
        labelAr: "فواتير المشتريات",
        href: "/purchasing/purchase-invoices",
        icon: Truck,
      },
      {
        key: "new-purchase-invoice",
        labelEn: "New Purchase Invoice",
        labelAr: "فاتورة شراء جديدة",
        href: "/purchasing/purchase-invoices/new",
        icon: Truck,
      },
      {
        key: "purchase-orders-list",
        labelEn: "Purchase Orders",
        labelAr: "أوامر الشراء",
        href: "/purchasing/purchase-orders",
        icon: Truck,
      },
      {
        key: "new-purchase-order",
        labelEn: "New Purchase Order",
        labelAr: "أمر شراء جديد",
        href: "/purchasing/purchase-orders/new",
        icon: Truck,
      },
    ],
  },
  {
    key: "b2b",
    labelEn: "B2B Customer Portal",
    labelAr: "بوابة عملاء الجملة",
    href: "/b2b",
    icon: Store,
  },
  {
    key: "accounting",
    labelEn: "Accounting",
    labelAr: "المحاسبة",
    icon: Calculator,
    children: [
      {
        key: "chart-of-accounts",
        labelEn: "Chart of Accounts",
        labelAr: "دليل الحسابات",
        href: "/accounting/chart-of-accounts",
        icon: Calculator,
      },
      {
        key: "journal-entry",
        labelEn: "Journal Entry",
        labelAr: "قيد اليومية",
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
    ],
  },
  {
    key: "hr",
    labelEn: "HR & Payroll",
    labelAr: "الموارد البشرية والرواتب",
    icon: Users,
    children: [
      {
        key: "employees",
        labelEn: "Employees",
        labelAr: "الموظفون",
        href: "/hr/employees",
        icon: Users,
      },
      {
        key: "payroll",
        labelEn: "Payroll",
        labelAr: "الرواتب",
        href: "/hr/payroll",
        icon: Users,
      },
    ],
  },
  {
    key: "settings",
    labelEn: "Settings",
    labelAr: "الإعدادات",
    icon: Settings,
    children: [
      {
        key: "branches",
        labelEn: "Branches",
        labelAr: "الفروع",
        href: "/settings/branches",
        icon: Settings,
      },
      {
        key: "roles-permissions",
        labelEn: "Roles & Permissions",
        labelAr: "الأدوار والصلاحيات",
        href: "/settings/roles-permissions",
        icon: Settings,
      },
    ],
  },
  {
    key: "coming-soon",
    labelEn: "Coming Soon",
    labelAr: "قريبًا",
    icon: Clock,
    children: [
      {
        key: "cost-centers",
        labelEn: "Cost Centers",
        labelAr: "مراكز التكلفة",
        href: "/coming-soon/cost-centers",
        icon: Clock,
        comingSoon: true,
      },
      {
        key: "budget-vs-actual",
        labelEn: "Budget vs Actual",
        labelAr: "الموازنة مقابل الفعلي",
        href: "/coming-soon/budget-vs-actual",
        icon: Clock,
        comingSoon: true,
      },
      {
        key: "pdc-tracking",
        labelEn: "PDC / Securities Tracking",
        labelAr: "متابعة الشيكات الآجلة",
        href: "/coming-soon/pdc-tracking",
        icon: Clock,
        comingSoon: true,
      },
      {
        key: "item-modifiers",
        labelEn: "Item Modifiers",
        labelAr: "متغيرات الصنف",
        href: "/coming-soon/item-modifiers",
        icon: Clock,
        comingSoon: true,
      },
      {
        key: "serial-tracking",
        labelEn: "Serial Tracking",
        labelAr: "تتبع الأرقام التسلسلية",
        href: "/coming-soon/serial-tracking",
        icon: Clock,
        comingSoon: true,
      },
      {
        key: "cash-closing",
        labelEn: "Daily Cash Closing",
        labelAr: "إقفال الصندوق اليومي",
        href: "/coming-soon/cash-closing",
        icon: Clock,
        comingSoon: true,
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