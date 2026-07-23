"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { accounts } from "@/lib/mock-data/accounts";
import type { AccountType } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

// Accounts with these types carry a natural debit balance; the rest (liability,
// equity, revenue) carry a natural credit balance — standard accounting convention.
const DEBIT_TYPES: AccountType[] = ["asset", "expense"];

export default function TrialBalancePage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const brandAccounts = currentBrand
    ? [...accounts.filter((a) => a.brandId === currentBrand.id)].sort((a, b) =>
        a.code.localeCompare(b.code)
      )
    : [];

  const rows = brandAccounts.map((a) => {
    const isDebit = DEBIT_TYPES.includes(a.type);
    return {
      account: a,
      debit: isDebit ? a.balanceKd : 0,
      credit: isDebit ? 0 : a.balanceKd,
    };
  });

  const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);
  const difference = Math.round((totalDebit - totalCredit) * 1000) / 1000;
  const isBalanced = difference === 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.trialBalance.title}</h1>
        <p className="mt-1 text-ink/60">{t.trialBalance.subtitle}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.trialBalance.code}</th>
              <th className="px-4 py-3 text-start font-medium">{t.trialBalance.accountName}</th>
              <th className="px-4 py-3 text-end font-medium">{t.trialBalance.debit}</th>
              <th className="px-4 py-3 text-end font-medium">{t.trialBalance.credit}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.account.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                <td className="numeric-ltr px-4 py-3 text-ink/60">{r.account.code}</td>
                <td className="px-4 py-3 text-ink">
                  {locale === "ar" ? r.account.nameAr : r.account.nameEn}
                </td>
                <td className="numeric-ltr px-4 py-3 text-end text-ink">
                  {r.debit > 0 ? `${formatKD(r.debit)} KD` : "—"}
                </td>
                <td className="numeric-ltr px-4 py-3 text-end text-ink">
                  {r.credit > 0 ? `${formatKD(r.credit)} KD` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink/20 font-semibold text-ink">
              <td className="px-4 py-3" colSpan={2}>
                {t.trialBalance.total}
              </td>
              <td className="numeric-ltr px-4 py-3 text-end">{formatKD(totalDebit)} KD</td>
              <td className="numeric-ltr px-4 py-3 text-end">{formatKD(totalCredit)} KD</td>
            </tr>
          </tfoot>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.trialBalance.noResults}</p>
        )}
      </div>

      {rows.length > 0 && (
        <div
          className={`rounded-2xl px-4 py-3 text-center text-sm font-medium shadow-sm ${
            isBalanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {isBalanced
            ? t.trialBalance.balanced
            : `${t.trialBalance.outOfBalance} ${formatKD(Math.abs(difference))} KD`}
        </div>
      )}
    </div>
  );
}
