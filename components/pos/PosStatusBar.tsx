"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Receipt,
  Wallet,
  Clock,
  Archive,
  CheckCircle2,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface PosStatusBarProps {
  todaySalesKd: number;
  transactionsCount: number;
  cashInHandKd: number;
  shiftName?: string;
  drawerStatus?: "ready" | "open" | "closed";
  onOpenShiftModal?: () => void;
}

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function PosStatusBar({
  todaySalesKd,
  transactionsCount,
  cashInHandKd,
  shiftName,
  drawerStatus = "ready",
  onOpenShiftModal,
}: PosStatusBarProps) {
  const { locale, t } = useLocale();

  const [timeString, setTimeString] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString(locale === "ar" ? "ar-KW" : "en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [locale]);

  return (
    <footer className="flex h-11 w-full items-center justify-between border-t border-neutral-800 bg-neutral-950 px-4 text-xs text-neutral-300 select-none">
      {/* Left items: Today Sales, Transactions, Cash in Hand */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-1">
        {/* Today Sales */}
        <div className="flex items-center gap-1.5 shrink-0">
          <DollarSign className="h-3.5 w-3.5 text-[#FDCE0C]" />
          <span className="text-neutral-400">{t.posScreen.todaySales}:</span>
          <span className="numeric-ltr font-bold text-white">
            {formatKD(todaySalesKd)} KD
          </span>
        </div>

        {/* Transactions Count */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Receipt className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-neutral-400">{t.posScreen.transactions}:</span>
          <span className="numeric-ltr font-bold text-white">
            {transactionsCount}
          </span>
        </div>

        {/* Cash in Hand */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Wallet className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-neutral-400">{t.posScreen.cashInHand}:</span>
          <span className="numeric-ltr font-bold text-white">
            {formatKD(cashInHandKd)} KD
          </span>
        </div>
      </div>

      {/* Right items: Shift, Drawer Status, Live Clock */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Current Shift */}
        <button
          type="button"
          onClick={onOpenShiftModal}
          className="hidden md:flex items-center gap-1.5 text-neutral-400 hover:text-white"
          title="Shift Details"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{shiftName || t.posScreen.shift1}</span>
        </button>

        {/* Drawer Status */}
        <div className="hidden sm:flex items-center gap-1 text-neutral-400">
          <Archive className="h-3.5 w-3.5 text-neutral-400" />
          <span>{t.posScreen.drawer}:</span>
          <span className="font-semibold text-emerald-400">
            {t.posScreen.drawerReady}
          </span>
        </div>

        {/* Live Clock & Date */}
        <div className="flex items-center gap-2 border-s border-neutral-800 ps-4">
          <Clock className="h-3.5 w-3.5 text-[#FDCE0C]" />
          <div className="numeric-ltr flex items-center gap-1.5 text-neutral-300 font-mono font-medium">
            <span className="font-bold text-white">{timeString}</span>
            <span className="hidden lg:inline text-neutral-400 text-[11px]">
              • {dateString}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
