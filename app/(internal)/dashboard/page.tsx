"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  companySales,
  branchPerformance,
  cashPosition,
  pendingPurchaseOrders,
} from "@/lib/mock-data/dashboard";

// TEMP: lowStockAlerts intentionally omitted from this per-brand Dashboard.
// That data shape has no brandId (only branchNameEn/branchNameAr strings),
// so it can't be filtered per-brand without a fragile name-based
// cross-reference against branchPerformance. Decision made with client/user:
// leave it out for now rather than ship fragile matching logic. Revisit once
// lowStockAlerts gets a real brandId or branchId field (Stage 2 likely).

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function DashboardPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  if (!currentBrand) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">Loading…</p>
      </div>
    );
  }

  const brandSales = companySales.find((c) => c.brandId === currentBrand.id);
  const brandCash = cashPosition.find((c) => c.brandId === currentBrand.id);

  const brandBranches = branchPerformance.filter(
    (b) => b.brandId === currentBrand.id
  );
  const sortedBranches = [...brandBranches].sort(
    (a, b) => b.monthSales - a.monthSales
  );
  const topBranches = sortedBranches.slice(0, 3);
  const bottomBranches = sortedBranches.slice(-3).reverse();

  const brandPOs = pendingPurchaseOrders.filter(
    (po) => po.brandId === currentBrand.id
  );

  const brandName = locale === "ar" ? currentBrand.nameAr : currentBrand.nameEn;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {t.dashboard.title} — {brandName}
        </h1>
        <p className="mt-1 text-ink/60">{t.dashboard.subtitle}</p>
      </div>

      {/* Top-line totals for this brand only */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.groupDashboard.todaySales}</p>
          <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
            {formatKD(brandSales?.todaySales ?? 0)}{" "}
            <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.groupDashboard.monthSales}</p>
          <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
            {formatKD(brandSales?.monthSales ?? 0)}{" "}
            <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.groupDashboard.monthTarget}</p>
          <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
            {formatKD(brandSales?.monthTarget ?? 0)}{" "}
            <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
      </div>

      {/* Top / bottom branches within this brand only */}
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
            {topBranches.length === 0 && (
              <p className="text-sm text-ink/40">—</p>
            )}
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
            {bottomBranches.length === 0 && (
              <p className="text-sm text-ink/40">—</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Cash position for this brand only */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.cashPosition}</h2>
          {brandCash ? (
            <div className="rounded-lg px-3 py-2">
              <div className="flex justify-between text-xs text-ink/60">
                <span>{t.groupDashboard.cashOnHand}</span>
                <span className="numeric-ltr">{formatKD(brandCash.cashOnHand)} KD</span>
              </div>
              <div className="flex justify-between text-xs text-ink/60">
                <span>{t.groupDashboard.bankBalance}</span>
                <span className="numeric-ltr">{formatKD(brandCash.bankBalance)} KD</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink/40">—</p>
          )}
        </div>

        {/* Pending POs for this brand only */}
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">{t.groupDashboard.pendingPurchaseOrders}</h2>
          <div className="space-y-2">
            {brandPOs.map((po) => (
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
            {brandPOs.length === 0 && (
              <p className="text-sm text-ink/40">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
