"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { branches } from "@/lib/mock-data/branches";
import type { Branch } from "@/lib/types";

// TEMP: Bin Essa Smoking Center is built here with all 14 mock branches.
// Client's real business profile states 12 branches. Client has not yet
// confirmed which 2 to remove, so all 14 remain until that answer comes
// back. Do not remove any branch without explicit client confirmation.

function typeLabel(
  type: Branch["type"],
  t: ReturnType<typeof useLocale>["t"]
): string {
  if (type === "retail") return t.settings.retail;
  if (type === "wholesale") return t.settings.wholesale;
  return t.settings.retailWholesale;
}

export default function SettingsBranchesPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const brandBranches = currentBrand
    ? branches.filter((b) => b.brandId === currentBrand.id)
    : [];

  const brandName = currentBrand
    ? locale === "ar"
      ? currentBrand.nameAr
      : currentBrand.nameEn
    : "";

  const isSmoking = currentBrand?.id === "smoking";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {t.settings.branches} — {brandName}
        </h1>
        <p className="mt-1 text-ink/60">{t.settings.branchesDesc}</p>
      </div>

      {isSmoking && (
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-ink/70">
          {t.settings.smokingBranchNote}
        </div>
      )}

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <p className="text-sm text-ink/50">{t.settings.totalBranches}</p>
        <p className="numeric-ltr mt-1 text-2xl font-semibold text-ink">
          {brandBranches.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.settings.branchName}</th>
              <th className="px-4 py-3 text-start font-medium">{t.settings.city}</th>
              <th className="px-4 py-3 text-start font-medium">{t.settings.branchType}</th>
            </tr>
          </thead>
          <tbody>
            {brandBranches.map((branch) => (
              <tr
                key={branch.id}
                className="border-b border-ink/5 last:border-0 hover:bg-ink/5"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {locale === "ar" ? branch.nameAr : branch.nameEn}
                </td>
                <td className="px-4 py-3 text-ink/70">{branch.city}</td>
                <td className="px-4 py-3 text-ink/70">{typeLabel(branch.type, t)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {brandBranches.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">—</p>
        )}
      </div>
    </div>
  );
}
