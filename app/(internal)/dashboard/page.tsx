"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Building2,
  RefreshCw,
  CheckCircle2,
  Plus,
  ArrowRight,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listSalesInvoicesRequest,
  getTrialBalanceRequest,
  listItemsRequest,
  listPurchaseOrdersRequest,
  type SalesInvoiceResponse,
  type TrialBalanceResponse,
  type ItemResponse,
  type PurchaseOrderResponse,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function DashboardPage() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const { currentBrand, currentBranch, isHeadOffice } = useSession();

  const [salesInvoices, setSalesInvoices] = useState<SalesInvoiceResponse[]>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalanceResponse | null>(null);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const [sales, tb, itemsList, pos] = await Promise.all([
        listSalesInvoicesRequest().catch(() => []),
        getTrialBalanceRequest().catch(() => null),
        listItemsRequest().catch(() => []),
        listPurchaseOrdersRequest().catch(() => []),
      ]);

      setSalesInvoices(sales);
      setTrialBalance(tb);
      setItems(itemsList);
      setPurchaseOrders(pos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, currentBranch, currentBrand]);

  if (!currentBrand) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  // 1. Calculate Real Sales Metrics
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const brandSalesInvoices = salesInvoices.filter((inv) => {
    // If not head office, scope to user's branch
    if (!isHeadOffice && currentBranch && inv.branchId) {
      return inv.branchId === currentBranch.id;
    }
    return true;
  });

  const todaySales = brandSalesInvoices
    .filter((inv) => inv.date?.slice(0, 10) === todayStr || inv.createdAt?.slice(0, 10) === todayStr)
    .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

  const monthSales = brandSalesInvoices
    .filter((inv) => {
      const d = new Date(inv.date || inv.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

  // 2. Real General Ledger Cash & Bank Balances
  const cashAccount = trialBalance?.rows?.find((r) => r.code === "1000");
  const bankAccount = trialBalance?.rows?.find((r) => r.code === "1010");
  const inventoryAccount = trialBalance?.rows?.find((r) => r.code === "1200");

  const cashOnHand = cashAccount ? Math.max(0, cashAccount.debit - cashAccount.credit) : 0;
  const bankBalance = bankAccount ? Math.max(0, bankAccount.debit - bankAccount.credit) : 0;

  const itemsValuation = items.reduce(
    (sum, item) => sum + Number(item.stockQuantity || 0) * Number(item.cost || 0),
    0
  );
  const totalInventoryValuation =
    inventoryAccount && (inventoryAccount.debit > 0 || inventoryAccount.credit > 0)
      ? Math.max(0, inventoryAccount.debit - inventoryAccount.credit)
      : itemsValuation;

  // 3. Real Low Stock Alerts from persistent DB items
  const lowStockItems = items.filter((item) => {
    const qty = Number(item.stockQuantity ?? 0);
    const reorder = 10;
    return qty <= reorder && (item.isActive ?? true);
  });

  // 4. Real Pending Purchase Orders
  const pendingPOs = purchaseOrders.filter(
    (po) => po.status === "DRAFT" || po.status === "PENDING"
  );

  // 5. Branch Sales Aggregation
  const branchSalesMap: Record<string, { name: string; total: number }> = {};
  brandSalesInvoices.forEach((inv) => {
    const bId = inv.branchId || "main";
    const bName = (inv as any).branch?.nameEn || (inv as any).branch?.name || bId;
    if (!branchSalesMap[bId]) {
      branchSalesMap[bId] = { name: bName, total: 0 };
    }
    branchSalesMap[bId].total += Number(inv.totalAmount || 0);
  });

  const branchRankings = Object.entries(branchSalesMap).map(([id, data]) => ({
    branchId: id,
    name: data.name,
    totalSales: data.total,
  })).sort((a, b) => b.totalSales - a.totalSales);

  const brandName = locale === "ar" ? currentBrand.nameAr : currentBrand.nameEn;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {t.dashboard.title} — {brandName}
          </h1>
          <p className="mt-1 text-xs text-ink/60">
            {locale === "ar"
              ? "مؤشرات العمليات الحية المستندة بالكامل إلى قيود اليومية والمعاملات الفعلية في قاعدة البيانات."
              : "Live commercial operational metrics driven 100% by persisted database transactions and GL journal entries."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboardData(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-ink/5 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-ink/60 ${isRefreshing ? "animate-spin" : ""}`} />
          {locale === "ar" ? "تحديث البيانات" : "Refresh Data"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Quick Operational Launchpad */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* 1. Inventory & Products */}
        <Link
          href="/inventory"
          className="group flex items-center justify-between rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50 to-amber-100/50 p-4 shadow-sm transition hover:border-amber-400 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-xs">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-950 group-hover:text-amber-900">
                {isAr ? "إدارة المخزون والأصناف" : "Inventory & Products"}
              </p>
              <p className="text-[11px] text-amber-900/70">
                {items.length} {isAr ? "صنف مسجل" : "Master SKUs"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-700 opacity-0 transition group-hover:opacity-100" />
        </Link>

        {/* 2. Add New Product */}
        <Link
          href="/inventory/new"
          className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-emerald-100/50 p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-950 group-hover:text-emerald-900">
                {isAr ? "إضافة صنف جديد" : "+ Add New Item"}
              </p>
              <p className="text-[11px] text-emerald-900/70">
                {isAr ? "إنشاء كود وصنف" : "New SKU Master"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-emerald-700 opacity-0 transition group-hover:opacity-100" />
        </Link>

        {/* 3. Launch POS */}
        <Link
          href="/pos"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-linear-to-r from-slate-900 to-slate-800 p-4 shadow-sm transition hover:shadow-md text-white"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold shadow-xs">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-amber-300">
                {isAr ? "نقطة البيع (POS)" : "POS Terminal"}
              </p>
              <p className="text-[11px] text-slate-300">
                {isAr ? "كاشير المبيعات" : "Sales Counter"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 transition group-hover:opacity-100" />
        </Link>

        {/* 4. Purchase Invoices */}
        <Link
          href="/purchasing/purchase-invoices"
          className="group flex items-center justify-between rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 to-indigo-100/50 p-4 shadow-sm transition hover:border-indigo-400 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-950 group-hover:text-indigo-900">
                {isAr ? "فواتير المشتريات" : "Purchase Invoices"}
              </p>
              <p className="text-[11px] text-indigo-900/70">
                {isAr ? "استلام وتوريد" : "Vendor Bills & GRN"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-indigo-700 opacity-0 transition group-hover:opacity-100" />
        </Link>
      </div>

      {/* Top-line KPI Cards (Driven by Actual Transactions) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Sales */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              {t.groupDashboard.todaySales}
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(todaySales)}{" "}
            <span className="text-xs font-normal text-ink/40">KD</span>
          </p>
          <p className="mt-1 text-[11px] text-ink/40">
            {brandSalesInvoices.filter((i) => i.date?.slice(0, 10) === todayStr || i.createdAt?.slice(0, 10) === todayStr).length}{" "}
            {locale === "ar" ? "فواتير اليوم" : "invoices today"}
          </p>
        </div>

        {/* Month Sales */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              {t.groupDashboard.monthSales}
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(monthSales)}{" "}
            <span className="text-xs font-normal text-ink/40">KD</span>
          </p>
          <p className="mt-1 text-[11px] text-ink/40">
            {locale === "ar" ? "إجمالي مبيعات الشهر الحالي" : "Current calendar month total"}
          </p>
        </div>

        {/* Cash Position */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              {locale === "ar" ? "النقد والبنك (GL)" : "Cash & Bank (GL)"}
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(cashOnHand + bankBalance)}{" "}
            <span className="text-xs font-normal text-ink/40">KD</span>
          </p>
          <p className="mt-1 text-[11px] text-ink/40">
            {locale === "ar" ? `نقد: ${formatKD(cashOnHand)} | بنك: ${formatKD(bankBalance)}` : `Cash: ${formatKD(cashOnHand)} | Bank: ${formatKD(bankBalance)}`}
          </p>
        </div>

        {/* Inventory Valuation */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              {locale === "ar" ? "قيمة المخزون (1200)" : "Inventory Valuation"}
            </span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(totalInventoryValuation)}{" "}
            <span className="text-xs font-normal text-ink/40">KD</span>
          </p>
          <p className="mt-1 text-[11px] text-ink/40">
            {items.length} {locale === "ar" ? "أصناف مسجلة" : "active item SKUs"}
          </p>
        </div>
      </div>

      {/* Main Operational Grids */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Branch Sales Performance */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <Building2 className="h-4 w-4 text-ink/60" />
              {t.groupDashboard.topBranches}
            </h2>
            <Link
              href="/accounting/trial-balance"
              className="text-xs font-semibold text-gold hover:underline"
            >
              {locale === "ar" ? "عرض ميزان المراجعة" : "View Trial Balance"} &rarr;
            </Link>
          </div>

          {branchRankings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-ink/5 p-3 text-ink/30 mb-2">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-ink/70">
                {locale === "ar" ? "لا توجد مبيعات مسجلة للفروع بعد" : "No branch sales recorded yet"}
              </p>
              <p className="mt-1 text-xs text-ink/40">
                {locale === "ar"
                  ? "ستظهر مبيعات كل فرع تلقائيًا بمجرد إتمام أول معاملة من نقطة البيع."
                  : "Branch sales totals will appear dynamically when POS sales are executed."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {branchRankings.map((b, idx) => (
                <div
                  key={b.branchId}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 text-xs font-bold text-ink">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-ink">{b.name}</span>
                  </div>
                  <span className="numeric-ltr text-sm font-bold text-ink">
                    {formatKD(b.totalSales)} KD
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t.groupDashboard.lowStockAlerts}
            </h2>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-gold hover:underline"
            >
              {locale === "ar" ? "إدارة المخزون" : "Manage Inventory"} &rarr;
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-500 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-ink/70">
                {locale === "ar" ? "جميع مستويات المخزون مكتملة ومثالية" : "All inventory stock levels are optimal"}
              </p>
              <p className="mt-1 text-xs text-ink/40">
                {locale === "ar"
                  ? "لا توجد أي أصناف وصلت إلى حد إعادة الطلب الأدنى."
                  : "No items currently fall below the minimum reorder threshold."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-amber-50/50 p-3 border border-amber-100/60"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {locale === "ar" ? item.nameAr || item.name : item.nameEn || item.name}
                    </p>
                    <p className="text-xs text-ink/50">SKU: {item.sku}</p>
                  </div>
                  <div className="text-end">
                    <span className="numeric-ltr inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                      {item.stockQuantity} {item.unit || "pcs"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Purchase Orders Table */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <FileText className="h-4 w-4 text-ink/60" />
            {t.groupDashboard.pendingPurchaseOrders}
          </h2>
          <Link
            href="/purchasing/orders"
            className="text-xs font-semibold text-gold hover:underline"
          >
            {locale === "ar" ? "أوامر الشراء" : "Purchase Orders"} &rarr;
          </Link>
        </div>

        {pendingPOs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm font-medium text-ink/60">
              {locale === "ar" ? "لا توجد أوامر شراء معلقة في الانتظار" : "No pending purchase orders waiting for delivery"}
            </p>
            <p className="mt-1 text-xs text-ink/40">
              {locale === "ar"
                ? "سيتم إدراج أي أوامر شراء قيد التوريد هنا تلقائيًا."
                : "Active supplier orders awaiting goods receipt will be displayed here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-ink/50">
                  <th className="pb-2 text-start font-semibold">PO #</th>
                  <th className="pb-2 text-start font-semibold">{isAr ? "المورد" : "Supplier"}</th>
                  <th className="pb-2 text-start font-semibold">{isAr ? "الإجمالي" : "Total"}</th>
                  <th className="pb-2 text-start font-semibold">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {pendingPOs.map((po) => (
                  <tr key={po.id}>
                    <td className="py-2.5 font-medium text-ink">{po.poNumber}</td>
                    <td className="py-2.5 text-ink/70">{po.supplier?.name || po.supplierId}</td>
                    <td className="numeric-ltr py-2.5 font-semibold text-ink">
                      {formatKD(Number(po.totalAmount))} KD
                    </td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
