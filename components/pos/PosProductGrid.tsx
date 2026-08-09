"use client";

import { Package, Plus, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Item } from "@/lib/types";
import type { PosViewMode } from "./PosTopbar";

interface PosProductGridProps {
  items: Item[];
  stockByItem: (item: Item) => number;
  onAddToCart: (item: Item) => void;
  cartQuantities: Record<string, number>;
  selectedBrand: string;
  onSelectBrand: (brandId: string) => void;
  viewMode: PosViewMode;
}

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

// Category visual palettes
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
  selectedBrand,
  onSelectBrand,
  viewMode,
}: PosProductGridProps) {
  const { locale, t } = useLocale();

  return (
    <div className="flex h-full flex-col overflow-hidden p-2">
      {/* Top Filter Bar */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => onSelectBrand(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white ps-3 pe-8 py-1.5 text-xs font-bold text-slate-800 shadow-2xs outline-none focus:border-[#2563EB]"
            >
              <option value="all">{locale === "ar" ? "جميع العلامات" : "All Brands"}</option>
              <option value="smoking">{locale === "ar" ? "مركز بن عيسى للتدخين" : "Bin Essa Smoking Center"}</option>
              <option value="khiran">{locale === "ar" ? "بن عيسى الخيران" : "Bin Essa Khiran"}</option>
              <option value="jmart">{locale === "ar" ? "جي إم آرت زون" : "JM Art Zone"}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {items.length} {t.posScreen.itemsCount}
          </span>
        </div>
      </div>

      {/* Products Display */}
      {items.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
          <Package className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            {t.inventory.noResults}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t.posScreen.searchPlaceholder}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="flex-1 overflow-y-auto pe-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr">
            {items.map((item) => {
              const stock = stockByItem(item);
              const inCart = cartQuantities[item.id] ?? 0;
              const availableStock = Math.max(0, stock - inCart);
              const isOutOfStock = stock <= 0 || availableStock <= 0;
              const itemName = locale === "ar" ? item.nameAr : item.nameEn;
              const catStyle = categoryColorMap[item.category] ?? {
                bg: "bg-slate-100",
                text: "text-slate-600",
              };

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAddToCart(item)}
                  disabled={isOutOfStock}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-2.5 text-start transition-all ${
                    isOutOfStock
                      ? "border-slate-200 opacity-50 cursor-not-allowed bg-slate-50/60"
                      : "border-slate-200 shadow-2xs hover:border-[#2563EB] hover:shadow-sm active:scale-[0.98]"
                  }`}
                >
                  {/* Thumbnail & In-Cart Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${catStyle.bg} ${catStyle.text}`}
                    >
                      <Package className="h-5 w-5" />
                    </div>

                    {inCart > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1.5 text-[10px] font-bold text-white shadow-xs numeric-ltr">
                        {inCart}
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="mt-2 flex-1">
                    <h3 className="line-clamp-2 text-xs font-bold text-slate-900 leading-snug group-hover:text-[#2563EB]">
                      {itemName}
                    </h3>
                  </div>

                  {/* Price & Stock */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="numeric-ltr block text-xs font-black text-blue-700 leading-none">
                        {formatKD(item.sellPriceKd)}{" "}
                        <span className="text-[10px] font-semibold text-slate-500">
                          KD
                        </span>
                      </span>
                      <span
                        className={`numeric-ltr block text-[10px] font-semibold mt-0.5 ${
                          stock > 0 ? "text-slate-500" : "text-red-500 font-bold"
                        }`}
                      >
                        {stock > 0
                          ? `${t.posScreen.stockLevel}: ${stock}`
                          : t.posScreen.outOfStock}
                      </span>
                    </div>

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isOutOfStock
                          ? "bg-slate-100 text-slate-400"
                          : "bg-slate-100 text-slate-700 group-hover:bg-[#2563EB] group-hover:text-white"
                      }`}
                    >
                      <Plus className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table / List View */
        <div className="flex-1 overflow-y-auto pe-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-xs text-start">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">{locale === "ar" ? "الصنف" : "Item"}</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">{locale === "ar" ? "السعر" : "Price"}</th>
                  <th className="py-2.5 px-3">{locale === "ar" ? "المخزون" : "Stock"}</th>
                  <th className="py-2.5 px-3 text-end">{locale === "ar" ? "إضافة" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const stock = stockByItem(item);
                  const isOutOfStock = stock <= 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {locale === "ar" ? item.nameAr : item.nameEn}
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                        {item.sku}
                      </td>
                      <td className="py-2 px-3 numeric-ltr font-bold text-blue-700">
                        {formatKD(item.sellPriceKd)} KD
                      </td>
                      <td className="py-2 px-3 numeric-ltr font-semibold">
                        <span className={stock > 0 ? "text-slate-700" : "text-red-500"}>
                          {stock}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-end">
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          disabled={isOutOfStock}
                          className="rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-40"
                        >
                          {t.posScreen.addToCart}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
