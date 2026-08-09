"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { ItemCategory } from "@/lib/types";

interface PosCategoryBarProps {
  categories: { id: string; label: string; count: number }[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function PosCategoryBar({
  categories,
  activeCategory,
  onSelectCategory,
}: PosCategoryBarProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              isActive
                ? "bg-neutral-900 text-white border border-neutral-700 shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold numeric-ltr ${
                isActive
                  ? "bg-[#FDCE0C] text-black"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
