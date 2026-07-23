"use client";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { rolePermissions } from "@/lib/mock-data/rolePermissions";
import type { ModuleKey } from "@/lib/mock-data/rolePermissions";

// Module display names mirror lib/mock-data/nav.ts labelEn/labelAr exactly.
// Kept as a local lookup (not imported from nav.ts) since nav.ts entries
// are nested under icon/component config not meant for reuse here.
// If nav.ts labels change, update this map to match.
const moduleLabels: Record<ModuleKey, { en: string; ar: string }> = {
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  groupDashboard: { en: "Group Dashboard", ar: "لوحة تحكم المجموعة" },
  pos: { en: "Point of Sale", ar: "نقطة البيع" },
  inventory: { en: "Inventory", ar: "المخزون" },
  purchasing: { en: "Purchasing", ar: "المشتريات" },
  accounting: { en: "Accounting", ar: "المحاسبة" },
  hr: { en: "HR & Payroll", ar: "الموارد البشرية والرواتب" },
  b2b: { en: "B2B Customer Portal", ar: "بوابة عملاء الجملة" },
  settings: { en: "Settings", ar: "الإعدادات" },
};

export default function RolesPermissionsPage() {
  const { locale, t } = useLocale();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {t.settings.rolesPermissionsPageTitle}
        </h1>
        <p className="mt-1 text-ink/60">
          {t.settings.rolesPermissionsPageSubtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-ink/70">
        {t.settings.readOnlyNote}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">
                {t.settings.roleColumnHeader}
              </th>
              <th className="px-4 py-3 text-start font-medium">
                {t.settings.modulesColumnHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((rp) => (
              <tr
                key={rp.role}
                className="border-b border-ink/5 last:border-0 hover:bg-ink/5"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {t.roles[rp.role]}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {rp.modules.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs text-ink/70"
                      >
                        {locale === "ar" ? moduleLabels[m].ar : moduleLabels[m].en}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
