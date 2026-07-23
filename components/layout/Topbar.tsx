"use client";

import { useState, useRef, useEffect } from "react";
import { User, Globe, LogOut, ChevronDown } from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function Topbar() {
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the profile menu on any click outside it.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const brandLabel = currentBrand
    ? locale === "ar"
      ? currentBrand.nameAr
      : currentBrand.nameEn
    : t.common.appName;

  const userName = locale === "ar" ? user.nameAr : user.nameEn;
  const roleLabel = t.roles[user.role];

  return (
    <header className="flex h-14 items-center justify-between border-b border-ink/10 bg-paper px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src="/logo.png" alt="Bin Essa" className="h-8 w-auto shrink-0" />
        <p className="truncate text-sm font-semibold text-ink">{brandLabel}</p>
      </div>

      <div className="flex items-center gap-3">
        {(isHeadOffice || branchesForCurrentBrand.length > 1) && (
          <select
            value={currentBranch?.id ?? ""}
            onChange={(e) => {
              if (e.target.value) switchBranch(e.target.value);
            }}
            className="numeric-ltr rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            {isHeadOffice && <option value="">{t.common.allBranches}</option>}
            {branchesForCurrentBrand.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {locale === "ar" ? branch.nameAr : branch.nameEn}
              </option>
            ))}
          </select>
        )}

        <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-medium text-ink">
          {roleLabel}
        </span>

        {/* Profile menu — user identity, language, and sign out all live
            here instead of as separate controls on the bar itself. */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{userName}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div
              className={`absolute top-full z-20 mt-2 w-56 rounded-xl border border-ink/10 bg-white p-1.5 shadow-lg ${
                locale === "ar" ? "start-0" : "end-0"
              }`}
            >
              <div className="px-2.5 py-2">
                <p className="text-sm font-medium text-ink">{userName}</p>
                <p className="text-xs text-ink/50">{roleLabel}</p>
              </div>

              <div className="my-1 h-px bg-ink/10" />

              <button
                type="button"
                onClick={() => {
                  toggleLocale();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-ink transition-colors hover:bg-ink/5"
              >
                <span className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4" />
                  {t.common.language}
                </span>
                <span className="numeric-ltr text-xs text-ink/50">
                  {locale === "ar" ? "العربية" : "English"}
                </span>
              </button>

              <div className="my-1 h-px bg-ink/10" />

              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
