"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { brands } from "@/lib/mock-data/brands";
import {
  companySales,
  branchPerformance,
  lowStockAlerts,
  cashPosition,
  pendingPurchaseOrders,
} from "@/lib/mock-data/dashboard";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function GroupDashboardPage() {
  const { locale, t } = useLocale();

  const totalToday = companySales.reduce((sum, c) => sum + c.todaySales, 0);
  const totalMonth = companySales.reduce((sum, c) => sum + c.monthSales, 0);
  const totalTarget = companySales.reduce((sum, c) => sum + c.monthTarget, 0);

  const sortedBranches = [...branchPerformance].sort((a, b) => b.monthSales - a.monthSales);
  const topBranches = sortedBranches.slice(0, 3);
  const bottomBranches = sortedBranches.slice(-3).reverse();

  function brandName(brandId: string) {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand) return brandId;
    return locale === "ar" ? brand.nameAr : brand.nameEn;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.groupDashboard.title}</h1>
        <p className="mt-1 text-ink/60">{t.groupDashboard.subtitle}</p>
      </div>

      {/* Top-line totals */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.groupDashboard.todaySales}</p>
          <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
            {formatKD(totalToday)} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.groupDashboard.monthSales}</p>
          <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
            {formatKD(totalMonth)} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.groupDashboard.monthTarget}</p>
          <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
            {formatKD(totalTarget)} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
      </div>

      {/* Per-company sales breakdown */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.perCompanySales}</h2>
        <div className="space-y-4">
          {companySales.map((c) => {
            const pct = Math.min(100, Math.round((c.monthSales / c.monthTarget) * 100));
            return (
              <div key={c.brandId}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{brandName(c.brandId)}</span>
                  <span className="numeric-ltr text-ink/60">
                    {formatKD(c.monthSales)} / {formatKD(c.monthTarget)} KD
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={`h-full bg-${c.brandId === "smoking" ? "brand-smoking" : c.brandId === "khiran" ? "brand-khiran" : "brand-jmart"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top / bottom branches */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.topBranches}</h2>
          <div className="space-y-2">
            {topBranches.map((b) => (
              <div key={b.branchId} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-ink/5">
                <span className="text-sm text-ink">{locale === "ar" ? b.branchNameAr : b.branchNameEn}</span>
                <span className="numeric-ltr text-sm font-medium text-ink">{formatKD(b.monthSales)} KD</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.bottomBranches}</h2>
          <div className="space-y-2">
            {bottomBranches.map((b) => (
              <div key={b.branchId} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-ink/5">
                <span className="text-sm text-ink">{locale === "ar" ? b.branchNameAr : b.branchNameEn}</span>
                <span className="numeric-ltr text-sm font-medium text-ink">{formatKD(b.monthSales)} KD</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low stock alerts */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.lowStockAlerts}</h2>
        <div className="space-y-2">
          {lowStockAlerts.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-ink">{locale === "ar" ? item.itemNameAr : item.itemNameEn}</p>
                <p className="text-xs text-ink/50">{locale === "ar" ? item.branchNameAr : item.branchNameEn}</p>
              </div>
              <p className="numeric-ltr text-sm text-red-600">
                {item.qtyRemaining} {t.groupDashboard.itemRemaining} ({item.reorderLevel} {t.groupDashboard.reorderLevel})
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Cash position */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.cashPosition}</h2>
          <div className="space-y-3">
            {cashPosition.map((c) => (
              <div key={c.brandId} className="rounded-lg px-3 py-2">
                <p className="mb-1 text-sm font-medium text-ink">{brandName(c.brandId)}</p>
                <div className="flex justify-between text-xs text-ink/60">
                  <span>{t.groupDashboard.cashOnHand}</span>
                  <span className="numeric-ltr">{formatKD(c.cashOnHand)} KD</span>
                </div>
                <div className="flex justify-between text-xs text-ink/60">
                  <span>{t.groupDashboard.bankBalance}</span>
                  <span className="numeric-ltr">{formatKD(c.bankBalance)} KD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending POs */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.pendingPurchaseOrders}</h2>
          <div className="space-y-2">
            {pendingPurchaseOrders.map((po) => (
              <div key={po.poNumber} className="rounded-lg px-3 py-2 hover:bg-ink/5">
                <div className="flex items-center justify-between">
                  <span className="numeric-ltr text-sm font-medium text-ink">{po.poNumber}</span>
                  <span className="numeric-ltr text-sm text-ink">{formatKD(po.amount)} KD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink/50">
                  <span>{locale === "ar" ? po.supplierNameAr : po.supplierNameEn}</span>
                  <span className="numeric-ltr">{po.daysWaiting} {t.groupDashboard.daysWaiting}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
