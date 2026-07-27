"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { listItemsRequest, type ItemResponse } from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function InventoryPage() {
  const { t } = useLocale();

  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listItemsRequest();
        if (!cancelled) setAllItems(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load items");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = Array.from(new Set(allItems.map((i) => i.category)));

  const filteredItems = allItems.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      (item.barcode ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t.inventory.title}</h1>
          <p className="mt-1 text-ink/60">{t.inventory.subtitle}</p>
        </div>
        <Link
          href="/inventory/new"
          className="whitespace-nowrap rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-gold hover:text-ink"
        >
          + Add Item
        </Link>
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
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold sm:w-64"
        >
          <option value="all">{t.inventory.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading items…
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-start text-ink/50">
                <th className="px-4 py-3 text-start font-medium">{t.inventory.itemName}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.category}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.sku}</th>
                <th className="px-4 py-3 text-start font-medium">{t.inventory.sellPrice}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                  <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                  <td className="px-4 py-3 text-ink/70">{item.category}</td>
                  <td className="numeric-ltr px-4 py-3 text-ink/60">{item.sku}</td>
                  <td className="numeric-ltr px-4 py-3 text-ink">
                    {formatKD(Number(item.price))} KD
                  </td>
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
      )}
    </div>
  );
}