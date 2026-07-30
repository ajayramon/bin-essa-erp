"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { accounts } from "@/lib/mock-data/accounts";
import type { Account, AccountType } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

const TYPE_ORDER: AccountType[] = ["asset", "liability", "equity", "revenue", "expense"];

export default function ChartOfAccountsPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const brandAccounts = currentBrand
    ? accounts.filter((a) => a.brandId === currentBrand.id)
    : [];

  function accountsOfType(type: AccountType): Account[] {
    return brandAccounts
      .filter((a) => a.type === type)
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  function typeTotal(type: AccountType): number {
    return accountsOfType(type).reduce((sum, a) => sum + a.balanceKd, 0);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.chartOfAccounts.title}</h1>
        <p className="mt-1 text-sm text-ink/50">{t.chartOfAccounts.subtitle}</p>
      </div>

      {brandAccounts.length === 0 ? (
        <p className="rounded-2xl border border-ink/10 bg-white p-6 text-center text-sm text-ink/40 shadow-sm">
          {t.chartOfAccounts.noResults}
        </p>
      ) : (
        TYPE_ORDER.map((type) => {
          const rows = accountsOfType(type);
          if (rows.length === 0) return null;
          return (
            <div key={type} className="rounded-2xl border border-ink/10 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
                  {t.chartOfAccounts[type]}
                </h2>
                <span className="numeric-ltr text-sm font-semibold text-ink">
                  {formatKD(typeTotal(type))} KD
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-start text-ink/40">
                    <th className="px-5 py-2 text-start font-medium">{t.chartOfAccounts.code}</th>
                    <th className="px-5 py-2 text-start font-medium">{t.chartOfAccounts.accountName}</th>
                    <th className="px-5 py-2 text-end font-medium">{t.chartOfAccounts.balance}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id} className="border-t border-ink/5 hover:bg-ink/5">
                      <td className="numeric-ltr px-5 py-2 text-ink/60">{a.code}</td>
                      <td className="px-5 py-2 text-ink">
                        {locale === "ar" ? a.nameAr : a.nameEn}
                      </td>
                      <td className="numeric-ltr px-5 py-2 text-end text-ink">
                        {formatKD(a.balanceKd)} KD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}
