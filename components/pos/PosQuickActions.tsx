"use client";

import {
  PauseCircle,
  Clock,
  Percent,
  FileText,
  Trash2,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface PosQuickActionsProps {
  onHoldSale: () => void;
  onOpenRecentSales: () => void;
  onOpenDiscountModal: () => void;
  onOpenNoteModal: () => void;
  onClearCart: () => void;
  isCartEmpty: boolean;
  heldOrdersCount: number;
}

export function PosQuickActions({
  onHoldSale,
  onOpenRecentSales,
  onOpenDiscountModal,
  onOpenNoteModal,
  onClearCart,
  isCartEmpty,
  heldOrdersCount,
}: PosQuickActionsProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 select-none">
      <button
        type="button"
        onClick={onHoldSale}
        disabled={isCartEmpty}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors hover:border-[#FDCE0C] hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <PauseCircle className="h-3.5 w-3.5 text-amber-600" />
        <span>{t.posScreen.holdSale}</span>
      </button>

      <button
        type="button"
        onClick={onOpenRecentSales}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors hover:border-[#FDCE0C] hover:bg-neutral-50"
      >
        <Clock className="h-3.5 w-3.5 text-blue-600" />
        <span>{t.posScreen.recentSales}</span>
        {heldOrdersCount > 0 && (
          <span className="rounded-full bg-[#FDCE0C] px-1.5 py-0.2 text-[10px] font-bold text-black numeric-ltr">
            {heldOrdersCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onOpenDiscountModal}
        disabled={isCartEmpty}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors hover:border-[#FDCE0C] hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Percent className="h-3.5 w-3.5 text-emerald-600" />
        <span>{t.posScreen.discount}</span>
      </button>

      <button
        type="button"
        onClick={onOpenNoteModal}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors hover:border-[#FDCE0C] hover:bg-neutral-50"
      >
        <FileText className="h-3.5 w-3.5 text-purple-600" />
        <span>{t.posScreen.note}</span>
      </button>

      {!isCartEmpty && (
        <button
          type="button"
          onClick={onClearCart}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-2xs transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-600" />
          <span>{t.posScreen.clearCart}</span>
        </button>
      )}
    </div>
  );
}
