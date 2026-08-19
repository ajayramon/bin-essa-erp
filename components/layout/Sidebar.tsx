"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { brands } from "@/lib/mock-data/brands";
import {
  brandModules,
  groupDashboardItem,
  isNavGroup,
  type NavEntry,
} from "@/lib/mock-data/nav";
import type { BrandId, Locale } from "@/lib/types";

// Full literal class names per brand, written out so the Tailwind v4
// compiler can find them in the source text — string-building class names
// at runtime (e.g. `bg-${accent}/10`) is not detected by the scanner.
type BrandStyleMap = Record<BrandId, { dot: string; textActive: string; bgSoft: string }>;

const brandStyles: BrandStyleMap = {
  smoking: {
    dot: "bg-brand-smoking",
    textActive: "text-brand-smoking",
    bgSoft: "bg-brand-smoking/10",
  },
  khiran: {
    dot: "bg-brand-khiran",
    textActive: "text-brand-khiran",
    bgSoft: "bg-brand-khiran/10",
  },
  jmart: {
    dot: "bg-brand-jmart",
    textActive: "text-brand-jmart",
    bgSoft: "bg-brand-jmart/10",
  },
};

export function Sidebar() {
  const { user, isHeadOffice, currentBrand, switchBrand } = useSession();
  const { locale } = useLocale();
  const pathname = usePathname();

  // Which brand sections are expanded. Starts with the current brand open.
  const [openBrands, setOpenBrands] = useState<Set<BrandId>>(
    () => new Set(currentBrand ? [currentBrand.id] : ["smoking"])
  );
  // Which nested groups (accounting, hr, settings, coming-soon) are
  // expanded, keyed "brandId:groupKey" so the same module can be open in
  // one brand section and closed in another.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () =>
      new Set([
        "smoking:inventory-ops",
        "khiran:inventory-ops",
        "jmart:inventory-ops",
        "smoking:purchasing",
        "khiran:purchasing",
        "jmart:purchasing",
        "smoking:sales-ops",
        "khiran:sales-ops",
        "jmart:sales-ops",
        "smoking:accounting",
        "khiran:accounting",
        "jmart:accounting",
      ])
  );

  // Whichever brand becomes current (via a Sidebar click or the Topbar
  // selector) auto-expands, without collapsing sections the user already
  // opened.
  useEffect(() => {
    if (currentBrand) {
      setOpenBrands((prev) => new Set(prev).add(currentBrand.id));
    }
  }, [currentBrand]);

  function toggleBrand(brandId: BrandId) {
    setOpenBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brandId)) next.delete(brandId);
      else next.add(brandId);
      return next;
    });
  }

  function toggleGroup(groupKey: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }

  function handleLeafClick(brandId: BrandId) {
    if (currentBrand?.id !== brandId) {
      switchBrand(brandId);
    }
  }

  if (!user) return null;

  const GroupIcon = groupDashboardItem.icon;
  const isGroupDashboardActive = pathname === groupDashboardItem.href;

  const roleAllowedKeys: Record<string, string[]> = {
    cashier: ["pos", "inventory-ops", "sales-ops", "customers"],
    sales_rep: ["pos", "inventory-ops", "sales-ops", "customers", "b2b"],
    storekeeper: ["inventory-ops", "purchasing"],
    accountant: ["inventory-ops", "purchasing", "sales-ops", "accounting", "customers"],
    branch_manager: ["dashboard", "pos", "inventory-ops", "purchasing", "sales-ops", "accounting", "customers", "promotions-group", "b2b", "settings"],
    admin: ["dashboard", "pos", "inventory-ops", "purchasing", "sales-ops", "accounting", "customers", "promotions-group", "b2b", "hr", "settings"],
    b2b_customer: ["b2b"],
  };

  const userRoleKey = (user.role || "admin").toLowerCase();
  const allowedKeys = roleAllowedKeys[userRoleKey] ?? roleAllowedKeys.admin;
  const filteredModules = brandModules.filter((entry) => allowedKeys.includes(entry.key));

  return (
    <aside className="flex h-full w-64 flex-col overflow-y-auto border-e border-ink/10 bg-paper">
      {isHeadOffice && (userRoleKey === "admin" || userRoleKey === "administrator") && (
        <div className="border-b border-ink/10 p-2">
          <Link
            href={groupDashboardItem.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
              isGroupDashboardActive
                ? "bg-gold/15 text-ink"
                : "text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            <GroupIcon className="h-5 w-5 shrink-0" />
            <span>
              {locale === "ar"
                ? groupDashboardItem.labelAr
                : groupDashboardItem.labelEn}
            </span>
          </Link>
        </div>
      )}

      <nav className="flex-1 space-y-1 p-2">
        {brands.map((brand) => {
          const styles = brandStyles[brand.id];
          const isBrandOpen = openBrands.has(brand.id);
          const isActiveBrand = currentBrand?.id === brand.id;
          const brandLabel = locale === "ar" ? brand.nameAr : brand.nameEn;

          return (
            <div key={brand.id}>
              <button
                type="button"
                onClick={() => toggleBrand(brand.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
                  isActiveBrand
                    ? `${styles.bgSoft} ${styles.textActive}`
                    : "text-ink hover:bg-ink/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
                  {brandLabel}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isBrandOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isBrandOpen && (
                <div className="mt-1 space-y-0.5 ps-3">
                  {filteredModules.map((entry) => (
                    <NavEntryRow
                      key={entry.key}
                      entry={entry}
                      brandId={brand.id}
                      currentBrandId={currentBrand?.id ?? null}
                      locale={locale}
                      pathname={pathname}
                      styles={styles}
                      openGroups={openGroups}
                      toggleGroup={toggleGroup}
                      onLeafClick={() => handleLeafClick(brand.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function NavEntryRow({
  entry,
  brandId,
  currentBrandId,
  locale,
  pathname,
  styles,
  openGroups,
  toggleGroup,
  onLeafClick,
}: {
  entry: NavEntry;
  brandId: BrandId;
  currentBrandId: BrandId | null;
  locale: Locale;
  pathname: string;
  styles: { dot: string; textActive: string; bgSoft: string };
  openGroups: Set<string>;
  toggleGroup: (key: string) => void;
  onLeafClick: () => void;
}) {
  const label = locale === "ar" ? entry.labelAr : entry.labelEn;
  const Icon = entry.icon;

  if (isNavGroup(entry)) {
    const groupKey = `${brandId}:${entry.key}`;
    const isOpen = openGroups.has(groupKey);

    return (
      <div>
        <button
          type="button"
          onClick={() => toggleGroup(groupKey)}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          <span className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-0.5 space-y-0.5 ps-6">
            {entry.children.map((child) => (
              <NavEntryRow
                key={child.key}
                entry={child}
                brandId={brandId}
                currentBrandId={currentBrandId}
                locale={locale}
                pathname={pathname}
                styles={styles}
                openGroups={openGroups}
                toggleGroup={toggleGroup}
                onLeafClick={onLeafClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = pathname === entry.href && currentBrandId === brandId;

  return (
    <Link
      href={entry.href}
      onClick={onLeafClick}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
        isActive
          ? `${styles.bgSoft} ${styles.textActive} font-medium`
          : "text-ink/70 hover:bg-ink/5 hover:text-ink"
      } ${entry.comingSoon ? "opacity-60" : ""}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {entry.comingSoon && (
        <span className="rounded-full bg-ink/10 px-1.5 py-0.5 text-[10px] font-medium text-ink/60">
          {locale === "ar" ? "قريبًا" : "Soon"}
        </span>
      )}
    </Link>
  );
}