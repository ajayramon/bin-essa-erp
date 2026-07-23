"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { items } from "@/lib/mock-data/items";
import { isItemVisibleToBrand } from "@/lib/utils/visibility";
import type { Item, ItemCategory } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function InventoryPage() {
  const { locale, t } = useLocale();
  const { currentBrand, branchesForCurrentBrand } = useSession();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "all">("all");

  function totalStock(item: Item): number {
    return branchesForCurrentBrand.reduce((sum, b) => sum + (item.stockByBranch[b.id] ?? 0), 0);
  }

  const visibleItems = currentBrand
    ? items.filter((i) => isItemVisibleToBrand(i, currentBrand.id))
    : [];

  const categories = Array.from(new Set(visibleItems.map((i) => i.category)));

  const filteredItems = visibleItems.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.nameEn.toLowerCase().includes(q) ||
      item.nameAr.includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.barcode.includes(q)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.inventory.title}</h1>
        <p className="mt-1 text-ink/60">{t.inventory.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.inventory.searchPlaceholder}
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ItemCategory | "all")}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold sm:w-64"
        >
          <option value="all">{t.inventory.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {t.categories[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.inventory.itemName}</th>
              <th className="px-4 py-3 text-start font-medium">{t.inventory.category}</th>
              <th className="px-4 py-3 text-start font-medium">{t.inventory.sku}</th>
              <th className="px-4 py-3 text-start font-medium">{t.inventory.sellPrice}</th>
              <th className="px-4 py-3 text-start font-medium">{t.inventory.totalStock}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                <td className="px-4 py-3 font-medium text-ink">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </td>
                <td className="px-4 py-3 text-ink/70">{t.categories[item.category]}</td>
                <td className="numeric-ltr px-4 py-3 text-ink/60">{item.sku}</td>
                <td className="numeric-ltr px-4 py-3 text-ink">{formatKD(item.sellPriceKd)} KD</td>
                <td className="numeric-ltr px-4 py-3 text-ink">{totalStock(item)}</td>
                <td className="px-4 py-3 text-end">
                  <Link
                    href={`/inventory/${item.id}`}
                    className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-gold hover:text-ink"
                  >
                    {t.inventory.viewDetails}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.inventory.noResults}</p>
        )}
      </div>
    </div>
  );
}
