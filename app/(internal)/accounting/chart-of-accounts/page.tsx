"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  getAccountsRequest,
  getTrialBalanceRequest,
  type AccountResponse,
  type TrialBalanceRow,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

const TYPE_ORDER: AccountType[] = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];

export default function ChartOfAccountsPage() {
  const { t } = useLocale();

  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [tbRows, setTbRows] = useState<TrialBalanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [accData, tbData] = await Promise.all([
          getAccountsRequest(),
          getTrialBalanceRequest().catch(() => ({ rows: [], totalDebit: 0, totalCredit: 0, isBalanced: true })),
        ]);

        if (!cancelled) {
          setAccounts(accData);
          setTbRows(tbData.rows || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load Chart of Accounts");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  function getAccountBalance(account: AccountResponse): number {
    const row = tbRows.find((r) => r.accountId === account.id || r.code === account.code);
    if (!row) return 0;
    if (account.type === "ASSET" || account.type === "EXPENSE") {
      return row.debit - row.credit;
    }
    return row.credit - row.debit;
  }

  function accountsOfType(type: AccountType): AccountResponse[] {
    return accounts
      .filter((a) => a.type === type)
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  function typeTotal(type: AccountType): number {
    return accountsOfType(type).reduce((sum, a) => sum + getAccountBalance(a), 0);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Chart of Accounts</h1>
        <p className="mt-1 text-sm text-ink/60">
          Official chart of accounts linked live to General Ledger balances.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading accounts from database...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        accounts.length === 0 ? (
          <p className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/40 shadow-sm">
            No accounts found in database.
          </p>
        ) : (
          TYPE_ORDER.map((type) => {
            const rows = accountsOfType(type);
            if (rows.length === 0) return null;
            return (
              <div key={type} className="rounded-2xl border border-ink/10 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-ink/10 bg-ink/5 px-5 py-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                    {type} ACCOUNTS
                  </h2>
                  <span className="numeric-ltr text-sm font-bold text-ink">
                    Total: {formatKD(typeTotal(type))} KD
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wider text-ink/50">
                      <th className="px-5 py-2.5 text-start font-medium">Account Code</th>
                      <th className="px-5 py-2.5 text-start font-medium">Account Name</th>
                      <th className="px-5 py-2.5 text-start font-medium">Type</th>
                      <th className="px-5 py-2.5 text-end font-medium">Net Balance (KWD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {rows.map((a) => {
                      const bal = getAccountBalance(a);
                      return (
                        <tr key={a.id} className="hover:bg-ink/5">
                          <td className="numeric-ltr px-5 py-2.5 font-mono font-semibold text-ink/70">{a.code}</td>
                          <td className="px-5 py-2.5 font-medium text-ink">{a.name}</td>
                          <td className="px-5 py-2.5 text-xs text-ink/60">{a.type}</td>
                          <td className="numeric-ltr px-5 py-2.5 text-end font-bold text-ink">
                            {formatKD(bal)} KD
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })
        )
      )}
    </div>
  );
}
