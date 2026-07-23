"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { items } from "@/lib/mock-data/items";
import { branches } from "@/lib/mock-data/branches";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function ItemDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const itemId = params.itemId as string;

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">{t.inventory.noResults}</p>
        <Link href="/inventory" className="mt-3 inline-block text-sm text-gold underline">
          {t.inventory.backToList}
        </Link>
      </div>
    );
  }

  const stockRows = Object.entries(item.stockByBranch).map(([branchId, qty]) => {
    const branch = branches.find((b) => b.id === branchId);
    return {
      branchId,
      qty,
      nameEn: branch?.nameEn ?? branchId,
      nameAr: branch?.nameAr ?? branchId,
    };
  });

  const totalStock = stockRows.reduce((sum, r) => sum + r.qty, 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link href="/inventory" className="text-sm text-ink/50 hover:text-gold">
          {t.inventory.backToList}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          {locale === "ar" ? item.nameAr : item.nameEn}
        </h1>
        <p className="numeric-ltr mt-1 text-sm text-ink/50">{item.sku}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.sellPrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(item.sellPriceKd)} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.costPrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(item.costPriceKd)} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.wholesalePrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(item.wholesalePriceKd)} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t.inventory.stockByBranch}</h2>
          <span className="numeric-ltr text-sm text-ink/60">
            {t.inventory.totalStock}: {totalStock}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-start text-ink/50">
                <th className="px-3 py-2 text-start font-medium">{t.inventory.branch}</th>
                <th className="px-3 py-2 text-start font-medium">{t.inventory.quantity}</th>
              </tr>
            </thead>
            <tbody>
              {stockRows.map((row) => (
                <tr key={row.branchId} className="border-b border-ink/5 last:border-0">
                  <td className="px-3 py-2 text-ink">{locale === "ar" ? row.nameAr : row.nameEn}</td>
                  <td className="numeric-ltr px-3 py-2 text-ink">{row.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">{t.inventory.category}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.category}</span>
            <span className="text-sm font-medium text-ink">{t.categories[item.category]}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.barcode}</span>
            <span className="numeric-ltr text-sm font-medium text-ink">{item.barcode}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.hasVariants}</span>
            <span className="text-sm font-medium text-ink">
              {item.hasVariants ? t.inventory.yes : t.inventory.no}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.hasSerials}</span>
            <span className="text-sm font-medium text-ink">
              {item.hasSerials ? t.inventory.yes : t.inventory.no}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
