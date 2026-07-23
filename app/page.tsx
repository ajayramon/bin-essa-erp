"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { users } from "@/lib/mock-data/users";
import type { Role } from "@/lib/types";

// Where each role lands after signing in. Head-office roles (branchId:
// null) go to the consolidated Group Dashboard; branch-tied roles go to
// their own brand's Dashboard.
const HEAD_OFFICE_ROLES: Role[] = ["admin", "accountant"];

export default function LoginPage() {
  const { loginAs } = useSession();
  const { locale, t, toggleLocale } = useLocale();
  const router = useRouter();

  function handleSelectUser(userId: string, role: Role) {
    loginAs(userId);
    const destination = HEAD_OFFICE_ROLES.includes(role)
      ? "/group-dashboard"
      : "/dashboard";
    router.push(destination);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="Bin Essa" className="h-14 w-auto" />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              {t.common.appName}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">
              {t.login.title}
            </h1>
          </div>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.common.language}
            title={t.common.language}
            className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            <Globe className="h-4 w-4" />
            <span className="numeric-ltr">{locale === "ar" ? "EN" : "AR"}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <p className="mb-5 text-sm text-ink/60">{t.login.subtitle}</p>

          <div className="space-y-2">
            {users.map((user) => {
              const name = locale === "ar" ? user.nameAr : user.nameEn;
              const roleLabel = t.roles[user.role];

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user.id, user.role)}
                  className="flex w-full items-center justify-between rounded-xl border border-ink/10 px-4 py-3 text-start transition-colors hover:border-gold hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                >
                  <span className="text-sm font-medium text-ink">{name}</span>
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-medium text-ink">
                    {roleLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink/40">
          {t.login.signInAs} — {t.common.appName}
        </p>
      </div>
    </div>
  );
}
