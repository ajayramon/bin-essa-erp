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

// Category visual palettes (Harmonious neutral & gold-tinted badges)
const categoryColorMap: Record<string, { bg: string; text: string }> = {
  disposable_vapes: { bg: "bg-amber-50", text: "text-amber-700" },
  pod_systems: { bg: "bg-slate-100", text: "text-slate-800" },
  nicotine_pouches: { bg: "bg-emerald-50", text: "text-emerald-700" },
  dokha_medwakh: { bg: "bg-amber-100/70", text: "text-amber-800" },
  cigarette_lighters: { bg: "bg-orange-50", text: "text-orange-700" },
  rolling_papers: { bg: "bg-yellow-50", text: "text-yellow-800" },
  rolling_tobacco_hbt: { bg: "bg-stone-100", text: "text-stone-800" },
  pipe_accessories: { bg: "bg-amber-50", text: "text-amber-900" },
  general_smoking_accessories: { bg: "bg-slate-100", text: "text-slate-700" },
  marine_outdoor: { bg: "bg-sky-50", text: "text-sky-800" },
  custom_gifts_signage: { bg: "bg-yellow-100/60", text: "text-yellow-900" },
  licensed_collectibles: { bg: "bg-stone-100", text: "text-stone-700" },
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
              className="appearance-none rounded-xl border border-slate-200 bg-white ps-3 pe-8 py-1.5 text-xs font-bold text-slate-800 shadow-2xs outline-none focus:border-[#FDCE0C]"
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
              const isSaleDisabled = item.allowSale === false || item.blockSale === true;
              const isBlocked = isOutOfStock || isSaleDisabled;

              const itemName = locale === "ar" ? (item.nameAr || item.nameEn) : (item.nameEn || item.nameAr);
              const catStyle = categoryColorMap[item.category] ?? {
                bg: "bg-slate-100",
                text: "text-slate-700",
              };

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAddToCart(item)}
                  disabled={isBlocked}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-2.5 text-start transition-all ${
                    isSaleDisabled
                      ? "border-red-200 bg-red-50/40 opacity-70 cursor-not-allowed"
                      : isOutOfStock
                      ? "border-slate-200 opacity-50 cursor-not-allowed bg-slate-50/60"
                      : "border-slate-200 shadow-2xs hover:border-[#FDCE0C] hover:shadow-md active:scale-[0.98]"
                  }`}
                >
                  {/* Thumbnail & In-Cart Badge */}
                  <div className="flex items-start justify-between gap-2">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={itemName}
                        className="h-10 w-10 shrink-0 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${catStyle.bg} ${catStyle.text}`}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                    )}

                    {isSaleDisabled ? (
                      <span className="rounded-full bg-red-100 border border-red-200 px-1.5 py-0.2 text-[9px] font-black text-red-700">
                        {locale === "ar" ? "ممنوع البيع" : "No Sale"}
                      </span>
                    ) : inCart > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FDCE0C] px-1.5 text-[10px] font-black text-black shadow-xs numeric-ltr">
                        {inCart}
                      </span>
                    ) : null}
                  </div>

                  {/* Product Name */}
                  <div className="mt-2 flex-1">
                    <h3 className="line-clamp-2 text-xs font-bold text-slate-900 leading-snug group-hover:text-amber-600">
                      {itemName}
                    </h3>
                  </div>

                  {/* Price & Stock */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="numeric-ltr block text-xs font-black text-slate-950 leading-none">
                        {formatKD(item.sellPriceKd)}{" "}
                        <span className="text-[10px] font-bold text-amber-600">
                          KD
                        </span>
                      </span>
                      <span
                        className={`numeric-ltr block text-[10px] font-semibold mt-0.5 ${
                          isSaleDisabled
                            ? "text-red-500 font-bold"
                            : stock > 0
                            ? "text-slate-500"
                            : "text-red-500 font-bold"
                        }`}
                      >
                        {isSaleDisabled
                          ? locale === "ar" ? "البيع غير مسموح" : "Sale Disabled"
                          : stock > 0
                          ? `${t.posScreen.stockLevel}: ${stock}`
                          : t.posScreen.outOfStock}
                      </span>
                    </div>

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isBlocked
                          ? "bg-slate-100 text-slate-400"
                          : "bg-slate-100 text-slate-700 group-hover:bg-[#FDCE0C] group-hover:text-black"
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
                  <th className="py-2.5 px-3 text-start">{locale === "ar" ? "الصنف" : "Item"}</th>
                  <th className="py-2.5 px-3 text-start">SKU</th>
                  <th className="py-2.5 px-3 text-start">{locale === "ar" ? "السعر" : "Price"}</th>
                  <th className="py-2.5 px-3 text-center">{locale === "ar" ? "المخزون" : "Stock"}</th>
                  <th className="py-2.5 px-3 text-center">{locale === "ar" ? "إضافة" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const stock = stockByItem(item);
                  const inCart = cartQuantities[item.id] ?? 0;
                  const isSaleDisabled = item.allowSale === false || item.blockSale === true;
                  const isBlocked = stock <= 0 || isSaleDisabled;
                  const itemName = locale === "ar" ? (item.nameAr || item.nameEn) : (item.nameEn || item.nameAr);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {itemName}
                        {isSaleDisabled && (
                          <span className="ms-2 rounded bg-red-100 text-red-700 px-1.5 py-0.2 text-[9px] font-black">
                            {locale === "ar" ? "ممنوع البيع" : "No Sale"}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{item.sku}</td>
                      <td className="py-2 px-3 numeric-ltr font-black text-slate-900">{formatKD(item.sellPriceKd)} KD</td>
                      <td className="py-2 px-3 text-center font-bold">{stock}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          disabled={isBlocked}
                          className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-[#FDCE0C] disabled:opacity-30"
                        >
                          + Add
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

