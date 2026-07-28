"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getTrialBalanceRequest, type TrialBalanceResponse } from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function TrialBalancePage() {
  const { t } = useLocale();

  const [data, setData] = useState<TrialBalanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await getTrialBalanceRequest();
      setData(result);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load trial balance");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    load();
  }, [load]);

  // Refetch whenever the user returns to this tab/window, or navigates back
  // to this page without a full reload (e.g. after posting a journal entry
  // elsewhere and switching back). Without this, the numbers shown can go
  // stale even though the underlying data is correct.
  useEffect(() => {
    function handleFocus() {
      load();
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        load();
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  const rows = data?.rows ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.trialBalance.title}</h1>
        <p className="mt-1 text-ink/60">{t.trialBalance.subtitle}</p>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</div>
      )}

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
              <tr key={r.accountId} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                <td className="numeric-ltr px-4 py-3 text-ink/60">{r.code}</td>
                <td className="px-4 py-3 text-ink">{r.name}</td>
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
              <td className="numeric-ltr px-4 py-3 text-end">{formatKD(data?.totalDebit ?? 0)} KD</td>
              <td className="numeric-ltr px-4 py-3 text-end">{formatKD(data?.totalCredit ?? 0)} KD</td>
            </tr>
          </tfoot>
        </table>
        {isLoading && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">Loading…</p>
        )}
        {!isLoading && rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.trialBalance.noResults}</p>
        )}
      </div>

      {!isLoading && data && rows.length > 0 && (
        <div
          className={`rounded-2xl px-4 py-3 text-center text-sm font-medium shadow-sm ${
            data.isBalanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {data.isBalanced
            ? t.trialBalance.balanced
            : `${t.trialBalance.outOfBalance} ${formatKD(
                Math.abs(data.totalDebit - data.totalCredit)
              )} KD`}
        </div>
      )}
    </div>
  );
}