"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { listItemsRequest, type ItemResponse } from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function ItemDetailPage() {
  const { t } = useLocale();
  const params = useParams();
  const itemId = params.itemId as string;

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);
      try {
        // No confirmed single-item GET /items/:id endpoint yet, so we fetch
        // the full list and find this item client-side. If a real
        // single-item endpoint exists, this should be swapped to call it
        // directly instead.
        const allItems = await listItemsRequest();
        if (cancelled) return;
        const found = allItems.find((i) => i.id === itemId) ?? null;
        if (!found) {
          setNotFound(true);
        } else {
          setItem(found);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load item");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/inventory" className="mt-3 inline-block text-sm text-gold underline">
          {t.inventory.backToList}
        </Link>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="p-6">
        <p className="text-sm text-ink/50">{t.inventory.noResults}</p>
        <Link href="/inventory" className="mt-3 inline-block text-sm text-gold underline">
          {t.inventory.backToList}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link href="/inventory" className="text-sm text-ink/50 hover:text-gold">
          {t.inventory.backToList}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-ink">{item.name}</h1>
        <p className="numeric-ltr mt-1 text-sm text-ink/50">{item.sku}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.sellPrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(Number(item.price))} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/50">{t.inventory.costPrice}</p>
          <p className="numeric-ltr mt-1 text-xl font-semibold text-ink">
            {formatKD(Number(item.cost))} <span className="text-sm font-normal text-ink/40">KD</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">{t.inventory.category}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.category}</span>
            <span className="text-sm font-medium text-ink">{item.category}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">{t.inventory.barcode}</span>
            <span className="numeric-ltr text-sm font-medium text-ink">
              {item.barcode ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">Unit</span>
            <span className="text-sm font-medium text-ink">{item.unit}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-sm text-ink/60">Active</span>
            <span className="text-sm font-medium text-ink">
              {item.isActive ? t.inventory.yes : t.inventory.no}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}