"use client";

import { Package, Plus, AlertCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Item } from "@/lib/types";

interface PosProductGridProps {
  items: Item[];
  stockByItem: (item: Item) => number;
  onAddToCart: (item: Item) => void;
  cartQuantities: Record<string, number>;
}

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

// Category visual icons / palettes for instant product recognition
const categoryColorMap: Record<string, { bg: string; text: string }> = {
  disposable_vapes: { bg: "bg-indigo-50", text: "text-indigo-600" },
  pod_systems: { bg: "bg-blue-50", text: "text-blue-600" },
  nicotine_pouches: { bg: "bg-emerald-50", text: "text-emerald-600" },
  dokha_medwakh: { bg: "bg-amber-50", text: "text-amber-700" },
  cigarette_lighters: { bg: "bg-orange-50", text: "text-orange-600" },
  rolling_papers: { bg: "bg-yellow-50", text: "text-yellow-700" },
  rolling_tobacco_hbt: { bg: "bg-stone-50", text: "text-stone-700" },
  pipe_accessories: { bg: "bg-rose-50", text: "text-rose-600" },
  general_smoking_accessories: { bg: "bg-slate-50", text: "text-slate-700" },
  marine_outdoor: { bg: "bg-cyan-50", text: "text-cyan-700" },
  custom_gifts_signage: { bg: "bg-fuchsia-50", text: "text-fuchsia-700" },
  licensed_collectibles: { bg: "bg-purple-50", text: "text-purple-700" },
};

export function PosProductGrid({
  items,
  stockByItem,
  onAddToCart,
  cartQuantities,
}: PosProductGridProps) {
  const { locale, t } = useLocale();

  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center">
        <Package className="h-10 w-10 text-neutral-300 mb-2" />
        <p className="text-sm font-medium text-neutral-600">
          {t.inventory.noResults}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          {t.posScreen.searchPlaceholder}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr">
      {items.map((item) => {
        const stock = stockByItem(item);
        const inCart = cartQuantities[item.id] ?? 0;
        const availableStock = Math.max(0, stock - inCart);
        const isOutOfStock = stock <= 0 || availableStock <= 0;
        const itemName = locale === "ar" ? item.nameAr : item.nameEn;
        const catStyle = categoryColorMap[item.category] ?? {
          bg: "bg-neutral-100",
          text: "text-neutral-600",
        };

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-3.5 text-start transition-all ${
              isOutOfStock
                ? "border-neutral-200 opacity-55 cursor-not-allowed bg-neutral-50/70"
                : "border-neutral-200/90 shadow-sm hover:border-[#FDCE0C] hover:shadow-md active:scale-[0.98]"
            }`}
          >
            {/* Top Row: Thumbnail & In-Cart Badge */}
            <div className="flex items-start justify-between gap-2">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${catStyle.bg} ${catStyle.text}`}
              >
                <Package className="h-6 w-6" />
              </div>

              {inCart > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FDCE0C] px-1.5 text-xs font-bold text-black shadow-sm numeric-ltr">
                  {inCart}
                </span>
              )}
            </div>

            {/* Product Name */}
            <div className="mt-3 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 leading-snug group-hover:text-black">
                {itemName}
              </h3>
            </div>

            {/* Bottom Row: Price & Stock */}
            <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-end justify-between">
              <div>
                <span className="numeric-ltr block text-sm font-extrabold text-neutral-950">
                  {formatKD(item.sellPriceKd)}{" "}
                  <span className="text-xs font-semibold text-neutral-600">
                    KD
                  </span>
                </span>
                <span
                  className={`numeric-ltr text-[11px] font-medium ${
                    stock > 0 ? "text-neutral-500" : "text-red-600 font-semibold"
                  }`}
                >
                  {stock > 0
                    ? `${t.posScreen.stockLevel}: ${stock}`
                    : t.posScreen.outOfStock}
                </span>
              </div>

              {/* Quick Add Icon */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isOutOfStock
                    ? "bg-neutral-200 text-neutral-400"
                    : "bg-neutral-900 text-white group-hover:bg-[#FDCE0C] group-hover:text-black"
                }`}
              >
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
