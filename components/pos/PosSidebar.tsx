"use client";

import { useState } from "react";
import {
  Layers,
  Flame,
  Package,
  Sparkles,
  CupSoda,
  Cookie,
  Home,
  Boxes,
  Truck,
  History,
  TrendingUp,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Gift,
  Cigarette,
  FolderTree,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface PosSidebarCategory {
  id: string;
  label: string;
  count: number;
}

interface PosSidebarProps {
  categories: PosSidebarCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  onOpenNewStockRequest: () => void;
  onOpenStockHistory: () => void;
  onOpenTodaySalesSummary: () => void;
  onOpenTodayShiftSummary: () => void;
  onOpenStockSummary: () => void;
}

function getCategoryIcon(id: string) {
  switch (id) {
    case "all":
      return Layers;
    case "disposable_vapes":
    case "pod_systems":
    case "e_cigarettes":
      return Package;
    case "nicotine_pouches":
      return Package;
    case "cigarette_lighters":
      return Flame;
    case "rolling_papers":
    case "rolling_tobacco_hbt":
      return Cigarette;
    case "dokha_medwakh":
    case "pipe_accessories":
    case "general_smoking_accessories":
      return Flame;
    case "custom_gifts_signage":
    case "gifts_party":
      return Gift;
    case "beverages":
      return CupSoda;
    case "snacks":
      return Cookie;
    case "marine_outdoor":
    case "household":
      return Home;
    default:
      return Boxes;
  }
}

export function PosSidebar({
  categories,
  activeCategory,
  onSelectCategory,
  onOpenNewStockRequest,
  onOpenStockHistory,
  onOpenTodaySalesSummary,
  onOpenTodayShiftSummary,
  onOpenStockSummary,
}: PosSidebarProps) {
  const { locale, t } = useLocale();
  const [showBranchTools, setShowBranchTools] = useState(false);

  return (
    <aside className="flex h-full w-56 flex-col justify-between overflow-y-auto border-e border-slate-200 bg-white p-2.5 select-none text-xs">
      <div className="space-y-3">
        {/* 1. Categories Section Header */}
        <div className="flex items-center justify-between px-1 pb-1 text-slate-800 font-bold border-b border-slate-100">
          <span className="text-[11px] uppercase tracking-wider text-slate-500">
            {locale === "ar" ? "الفئات" : "Categories"}
          </span>
          <FolderTree className="h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Categories List */}
        <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-start font-semibold transition-all ${
                  isActive
                    ? "bg-[#FDCE0C] text-black shadow-xs font-black"
                    : "text-slate-700 hover:bg-slate-100 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-black" : "text-slate-500"}`} />
                  <span className="truncate text-xs">{cat.label}</span>
                </div>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black numeric-ltr ${
                    isActive ? "bg-black text-[#FDCE0C]" : "text-slate-500 bg-slate-100"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Compact Branch & Shift Tools Accordion */}
      <div className="pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setShowBranchTools((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl p-2 font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-black" />
            <span className="text-[11px] font-bold">{locale === "ar" ? "عمليات الفرع والتقارير" : "Branch Operations"}</span>
          </div>
          {showBranchTools ? (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>

        {showBranchTools && (
          <div className="mt-1.5 space-y-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
            <button
              type="button"
              onClick={onOpenNewStockRequest}
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start font-medium text-slate-700 hover:bg-amber-50 hover:text-black"
            >
              <Truck className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[11px] truncate font-semibold">{locale === "ar" ? "طلب بضاعة من المخزن" : "Stock Request"}</span>
            </button>

            <button
              type="button"
              onClick={onOpenStockHistory}
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-black"
            >
              <History className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[11px] truncate font-semibold">{locale === "ar" ? "سجل الطلبات" : "Request History"}</span>
            </button>

            <button
              type="button"
              onClick={onOpenTodaySalesSummary}
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-black"
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[11px] truncate font-semibold">{locale === "ar" ? "ملخص مبيعات اليوم" : "Today's Sales"}</span>
            </button>

            <button
              type="button"
              onClick={onOpenTodayShiftSummary}
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-black"
            >
              <Clock className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-[11px] truncate font-semibold">{locale === "ar" ? "ملخص الوردية (F10)" : "Shift Summary (F10)"}</span>
            </button>

            <button
              type="button"
              onClick={onOpenStockSummary}
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-black"
            >
              <BarChart3 className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-[11px] truncate font-semibold">{locale === "ar" ? "ملخص المخزون" : "Stock Summary"}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
