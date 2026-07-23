"use client";

import Link from "next/link";
import { Building2, Users, Package } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

const adminCards = [
  {
    key: "branches",
    href: "/settings/branches",
    icon: Building2,
    comingSoon: false,
  },
  {
    key: "rolesPermissions",
    href: "/settings/roles-permissions",
    icon: Users,
    comingSoon: false,
  },
  {
    key: "visibilityAdmin",
    href: "/settings/visibility",
    icon: Package,
    comingSoon: true, // STAGE 1: visibility admin UI deferred — see open issues
  },
] as const;

export default function SettingsPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.settings.title}</h1>
        <p className="mt-1 text-ink/60">{t.settings.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map(({ key, href, icon: Icon, comingSoon }) => {
          const titleKey = key as keyof typeof t.settings;
          const descKey = `${key}Desc` as keyof typeof t.settings;

          return (
            <div
              key={key}
              className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-ink/5 p-3">
                  <Icon className="h-5 w-5 text-ink/60" />
                </div>
                {comingSoon && (
                  <span className="rounded-lg bg-gold/20 px-2 py-1 text-xs font-medium text-ink">
                    {t.settings.comingSoon}
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold text-ink">
                {t.settings[titleKey]}
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                {t.settings[descKey]}
              </p>
              <div className="mt-5">
                {comingSoon ? (
                  <span className="inline-block rounded-2xl border border-ink/10 px-4 py-2 text-sm font-medium text-ink/30 cursor-not-allowed">
                    {t.settings.manage}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="inline-block rounded-2xl bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-gold hover:text-ink"
                  >
                    {t.settings.manage}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
