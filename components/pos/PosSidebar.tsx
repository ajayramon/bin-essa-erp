"use client";

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
  Gift,
  Cigarette,
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

// Category icon mapper
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

  return (
    <aside className="flex h-full w-56 flex-col justify-between overflow-y-auto border-e border-slate-200 bg-white p-3 select-none text-xs">
      <div className="space-y-4">
        {/* 1. Categories Section */}
        <div>
          <div className="flex items-center justify-between pb-1 text-slate-800 font-bold">
            <span className="text-[11px] uppercase tracking-wider text-slate-500">
              {locale === "ar" ? "الفئات" : "Categories"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          <div className="mt-1 space-y-0.5">
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
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span className="truncate text-xs">{cat.label}</span>
                  </div>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold numeric-ltr ${
                      isActive ? "bg-white/20 text-white" : "text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Branch Actions Section */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
            {locale === "ar" ? "عمليات الفرع" : "Branch Actions"}
          </span>

          {/* Request Stock from Warehouse */}
          <button
            type="button"
            onClick={onOpenNewStockRequest}
            className="flex w-full items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 p-2 text-start transition-colors hover:bg-blue-50 hover:border-blue-200"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Truck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 leading-tight">
                {locale === "ar" ? "طلب بضاعة من المخزن" : "Request Stock from Warehouse"}
              </p>
              <p className="text-[10px] text-slate-500">
                {locale === "ar" ? "إنشاء طلب مخزون جديد" : "Create new stock request"}
              </p>
            </div>
          </button>

          {/* Request History */}
          <button
            type="button"
            onClick={onOpenStockHistory}
            className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-2 text-start transition-colors hover:bg-slate-100"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white">
              <History className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 leading-tight">
                {locale === "ar" ? "سجل الطلبات" : "Request History"}
              </p>
              <p className="text-[10px] text-slate-500">
                {locale === "ar" ? "عرض جميع الطلبات" : "View all your requests"}
              </p>
            </div>
          </button>
        </div>

        {/* 3. Quick Reports Section */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
            {locale === "ar" ? "تقارير سريعة" : "Quick Reports"}
          </span>

          <button
            type="button"
            onClick={onOpenTodaySalesSummary}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="truncate">
              {locale === "ar" ? "ملخص مبيعات اليوم" : "Today Sales Summary"}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenTodayShiftSummary}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span className="truncate">
              {locale === "ar" ? "ملخص وردية اليوم" : "Today Shift Summary"}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenStockSummary}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <BarChart3 className="h-3.5 w-3.5 text-purple-600" />
            <span className="truncate">
              {locale === "ar" ? "ملخص المخزون" : "Stock Summary"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
