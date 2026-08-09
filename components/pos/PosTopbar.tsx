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
} from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Link from "next/link";

interface PosTopbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenBarcodeModal: () => void;
  onOpenStockModal: () => void;
  onOpenShiftModal: () => void;
  isOnline?: boolean;
}

export function PosTopbar({
  query,
  onQueryChange,
  onOpenBarcodeModal,
  onOpenStockModal,
  onOpenShiftModal,
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
    : "Cashier";
  const roleLabel = user ? t.roles[user.role] : t.posScreen.cashier;
  const branchName = currentBranch
    ? locale === "ar"
      ? currentBranch.nameAr
      : currentBranch.nameEn
    : t.common.allBranches;

  const isCashierLocked = Boolean(user?.branchId && !isHeadOffice);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 text-white select-none">
      {/* Left: Branding + Branch Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Bin Essa POS"
            className="h-8 w-auto object-contain brightness-110"
          />
          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-wide text-[#FDCE0C]">
              {t.posScreen.appName}
            </h1>
            <p className="text-[11px] text-neutral-400">
              {currentBrand
                ? locale === "ar"
                  ? currentBrand.nameAr
                  : currentBrand.nameEn
                : "Retail POS"}
            </p>
          </div>
        </div>

        {/* Branch Context Badge */}
        <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 shadow-inner">
          <Building2 className="h-4 w-4 text-[#FDCE0C]" />
          {isCashierLocked ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-neutral-200">
                {branchName}
              </span>
              <span title={t.posScreen.branchLocked}>
                <Lock className="h-3 w-3 text-neutral-400" />
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <select
                value={currentBranch?.id ?? ""}
                onChange={(e) => {
                  if (e.target.value) switchBranch(e.target.value);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-neutral-200 outline-none hover:text-[#FDCE0C] focus:text-[#FDCE0C]"
                title={t.posScreen.switchBranch}
              >
                {branchesForCurrentBrand.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    className="bg-neutral-900 text-white"
                  >
                    {locale === "ar" ? b.nameAr : b.nameEn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
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

      {/* Middle: Fast Search Bar + Barcode Scanner Action */}
      <div className="mx-4 flex max-w-lg flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t.posScreen.searchPlaceholder}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 ps-9 pe-4 py-2 text-sm text-white placeholder-neutral-500 shadow-sm transition-colors outline-none focus:border-[#FDCE0C] focus:ring-1 focus:ring-[#FDCE0C]"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={onOpenBarcodeModal}
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:border-[#FDCE0C] hover:bg-neutral-800 hover:text-[#FDCE0C]"
          title={t.posScreen.barcodeScan}
        >
          <ScanBarcode className="h-4 w-4 text-[#FDCE0C]" />
          <span className="hidden md:inline">{t.posScreen.barcodeScan}</span>
        </button>
      </div>

      {/* Right: Notifications, Language, Cashier Profile & Logout */}
      <div className="flex items-center gap-2">
        {/* Language switch button */}
        <button
          type="button"
          onClick={toggleLocale}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-xs font-semibold text-neutral-300 transition-colors hover:border-[#FDCE0C] hover:text-white"
          title={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
        >
          <Globe className="h-4 w-4 text-[#FDCE0C]" />
          <span className="font-bold text-[#FDCE0C]">
            {locale === "ar" ? "English" : "العربية"}
          </span>
        </button>

        {/* Notifications Icon */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 end-1.5 h-2 w-2 rounded-full bg-[#FDCE0C]" />
          </button>

          {notificationsOpen && (
            <div
              className={`absolute top-full z-50 mt-2 w-72 rounded-xl border border-neutral-800 bg-neutral-900 p-3 shadow-2xl ${
                locale === "ar" ? "start-0" : "end-0"
              }`}
            >
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t.posScreen.notifications ?? "Notifications"}
              </h3>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="rounded-lg bg-neutral-800/80 p-2 border border-neutral-700/50">
                  <p className="font-medium text-[#FDCE0C]">
                    {t.posScreen.shift1}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {branchName} • Cash drawer ready
                  </p>
                </div>
                <div className="rounded-lg bg-neutral-800/50 p-2 text-neutral-400">
                  <p>All branch items synced with ERP central database.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cashier / Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="flex h-9 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-xs text-neutral-200 transition-colors hover:border-neutral-700 hover:text-white"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FDCE0C]/20 text-[#FDCE0C]">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
            <div className="hidden text-start lg:block">
              <p className="leading-none font-semibold text-white">{userName}</p>
              <p className="text-[10px] text-neutral-400">{roleLabel}</p>
            </div>
            <ChevronDown
              className={`h-3 w-3 text-neutral-400 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              className={`absolute top-full z-50 mt-2 w-60 rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl ${
                locale === "ar" ? "start-0" : "end-0"
              }`}
            >
              <div className="px-3 py-2 border-b border-neutral-800">
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-[#FDCE0C]">{roleLabel}</p>
                <p className="mt-0.5 text-[11px] text-neutral-400">
                  {branchName}
                </p>
              </div>

              {/* Back to Admin ERP if Admin/Manager */}
              {(isHeadOffice || user?.role === "admin" || user?.role === "branch_manager" || user?.role === "accountant") && (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white"
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
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Building2 className="h-4 w-4 text-neutral-400" />
                {t.posScreen.endOfDay}
              </button>

              <div className="my-1 h-px bg-neutral-800" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
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
