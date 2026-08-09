"use client";

import { useState, useRef, useEffect } from "react";
import {
  ScanBarcode,
  Search,
  Wifi,
  WifiOff,
  Bell,
  User as UserIcon,
  Globe,
  LogOut,
  LayoutDashboard,
  Building2,
  ChevronDown,
  Lock,
  FileText,
  ClipboardList,
  LayoutGrid,
  List,
  Settings as SettingsIcon,
} from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Link from "next/link";

export type PosMode = "invoice" | "order";
export type PosViewMode = "grid" | "list";

interface PosTopbarProps {
  mode: PosMode;
  onModeChange: (mode: PosMode) => void;
  viewMode: PosViewMode;
  onViewModeChange: (view: PosViewMode) => void;
  query: string;
  onQueryChange: (q: string) => void;
  onOpenBarcodeModal: () => void;
  onOpenStockModal: () => void;
  onOpenShiftModal: () => void;
  onOpenSettingsModal: () => void;
  isOnline?: boolean;
}

export function PosTopbar({
  mode,
  onModeChange,
  viewMode,
  onViewModeChange,
  query,
  onQueryChange,
  onOpenBarcodeModal,
  onOpenStockModal,
  onOpenShiftModal,
  onOpenSettingsModal,
  isOnline = true,
}: PosTopbarProps) {
  const {
    user,
    isHeadOffice,
    currentBrand,
    currentBranch,
    branchesForCurrentBrand,
    switchBranch,
    logout,
  } = useSession();
  const { locale, t, toggleLocale } = useLocale();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user
    ? locale === "ar"
      ? user.nameAr
      : user.nameEn
    : "Ahmed";
  const roleLabel = user ? t.roles[user.role] : t.posScreen.cashier;
  const branchName = currentBranch
    ? locale === "ar"
      ? currentBranch.nameAr
      : currentBranch.nameEn
    : "Salmiya 5th";

  const isCashierLocked = Boolean(user?.branchId && !isHeadOffice);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-black/20 bg-[#0B0F17] px-4 text-white select-none">
      {/* 1. Left: Branding + Mode Toggle (Sales Invoice / Sales Order) */}
      <div className="flex items-center gap-3.5">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center font-black tracking-wider text-white text-lg">
            <span>BIN ESSA</span>
            <span className="ms-1.5 rounded-md bg-[#FDCE0C] px-1.5 py-0.5 text-xs font-black text-black shadow-xs">
              POS
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs (Sales Invoice vs Sales Order) */}
        <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => onModeChange("invoice")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mode === "invoice"
                ? "bg-[#FDCE0C] text-black shadow-xs font-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{locale === "ar" ? "فاتورة مبيعات" : "Sales Invoice"}</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange("order")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mode === "order"
                ? "bg-[#FDCE0C] text-black shadow-xs font-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>{locale === "ar" ? "طلب بيع" : "Sales Order"}</span>
          </button>
        </div>

        {/* Branch Context Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5">
          <Building2 className="h-4 w-4 text-[#FDCE0C]" />
          {isCashierLocked ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100">
                {t.posScreen.branch}: {branchName}
              </span>
              <span title={t.posScreen.branchLocked}>
                <Lock className="h-3 w-3 text-slate-400" />
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">{t.posScreen.branch}:</span>
              <select
                value={currentBranch?.id ?? ""}
                onChange={(e) => {
                  if (e.target.value) switchBranch(e.target.value);
                }}
                className="cursor-pointer bg-transparent text-xs font-bold text-slate-100 outline-none hover:text-[#FDCE0C] focus:text-[#FDCE0C]"
                title={t.posScreen.switchBranch}
              >
                {branchesForCurrentBrand.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    className="bg-[#0B0F17] text-white"
                  >
                    {locale === "ar" ? b.nameAr : b.nameEn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isOnline
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                : "bg-red-950/80 text-red-400 border border-red-800/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400"
              }`}
            />
            <span>
              {isOnline ? t.posScreen.onlineStatus : t.posScreen.offlineStatus}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle: Fast Search Bar + Barcode Scanner Action + Grid/List Toggle */}
      <div className="mx-4 flex max-w-md flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              locale === "ar"
                ? "ابحث باسم الصنف أو الكود أو امسح الباركود..."
                : "Search item by name, SKU or scan barcode..."
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-900 ps-9 pe-8 py-2 text-xs text-white placeholder-slate-400 shadow-sm transition-colors outline-none focus:border-[#FDCE0C] focus:ring-1 focus:ring-[#FDCE0C]"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scan Barcode Modal Button */}
        <button
          onClick={onOpenBarcodeModal}
          type="button"
          className="flex shrink-0 items-center justify-center h-8.5 w-8.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 transition-colors hover:border-[#FDCE0C] hover:text-[#FDCE0C]"
          title={t.posScreen.barcodeScan}
        >
          <ScanBarcode className="h-4 w-4" />
        </button>

        {/* Grid vs List View Toggle */}
        <div className="hidden sm:flex items-center rounded-xl bg-slate-900 p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-[#FDCE0C] text-black shadow-xs font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-[#FDCE0C] text-black shadow-xs font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="List View"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Right: Language, Notifications, Settings, Cashier Profile */}
      <div className="flex items-center gap-2">
        {/* Bilingual Language Switch */}
        <button
          type="button"
          onClick={toggleLocale}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 text-xs font-bold text-slate-200 transition-colors hover:border-[#FDCE0C] hover:text-white"
          title={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
        >
          <Globe className="h-4 w-4 text-[#FDCE0C]" />
          <span className="font-black text-[#FDCE0C]">
            {locale === "ar" ? "English" : "العربية"}
          </span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FDCE0C] text-black px-1 text-[10px] font-black shadow-xs">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div
              className={`absolute top-full z-50 mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-2xl ${
                locale === "ar" ? "start-0" : "end-0"
              }`}
            >
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.posScreen.notifications}
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-xl bg-[#0B0F17] p-2.5 border border-slate-800">
                  <p className="font-bold text-[#FDCE0C]">
                    Stock Transfer Approved
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    REQ-00031 approved by Shuwaikh Central Warehouse.
                  </p>
                </div>
                <div className="rounded-xl bg-[#0B0F17] p-2.5 border border-slate-800">
                  <p className="font-bold text-emerald-400">
                    Shift Started
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cashier Ahmed started Evening Shift with 100.000 KD float.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          type="button"
          onClick={onOpenSettingsModal}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          title="Terminal Settings"
        >
          <SettingsIcon className="h-4 w-4" />
        </button>

        {/* Cashier Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2.5 text-xs text-slate-200 transition-colors hover:border-slate-700 hover:text-white"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FDCE0C] text-black font-black text-xs">
              {userName.charAt(0)}
            </div>
            <div className="hidden text-start md:block">
              <p className="leading-none font-bold text-white">
                User: {userName}
              </p>
              <p className="text-[10px] text-slate-400">{roleLabel}</p>
            </div>
            <ChevronDown
              className={`h-3 w-3 text-slate-400 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              className={`absolute top-full z-50 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900 p-2.5 shadow-2xl ${
                locale === "ar" ? "start-0" : "end-0"
              }`}
            >
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-sm font-bold text-white">{userName}</p>
                <p className="text-xs text-[#FDCE0C] font-bold">{roleLabel}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {branchName}
                </p>
              </div>

              {/* Back to Admin ERP if Admin/Manager */}
              {(isHeadOffice || user?.role === "admin" || user?.role === "branch_manager" || user?.role === "accountant") && (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#FDCE0C]" />
                  {t.posScreen.backToAdmin}
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenShiftModal();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Building2 className="h-4 w-4 text-slate-400" />
                {t.posScreen.endOfDay}
              </button>

              <div className="my-1.5 h-px bg-slate-800" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                {t.posScreen.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
