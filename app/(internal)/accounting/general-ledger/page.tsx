"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  getAccountsRequest,
  getAccountLedgerRequest,
  type AccountResponse,
  type AccountLedgerResponse,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function GeneralLedgerPage() {
  const { t } = useLocale();

  const [accountsList, setAccountsList] = useState<AccountResponse[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [ledger, setLedger] = useState<AccountLedgerResponse | null>(null);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      setAccountsLoading(true);
      setAccountsError(null);
      try {
        const data = await getAccountsRequest();
        setAccountsList(data);
        if (data.length > 0) {
          setSelectedAccountId(data[0].id);
        }
      } catch (err) {
        setAccountsError(err instanceof Error ? err.message : "Failed to load accounts");
      } finally {
        setAccountsLoading(false);
      }
    }
    loadAccounts();
  }, []);

  useEffect(() => {
    if (!selectedAccountId) return;

    async function loadLedger() {
      setLedgerLoading(true);
      setLedgerError(null);
      try {
        const data = await getAccountLedgerRequest(selectedAccountId);
        setLedger(data);
      } catch (err) {
        setLedgerError(err instanceof Error ? err.message : "Failed to load ledger");
        setLedger(null);
      } finally {
        setLedgerLoading(false);
      }
    }
    loadLedger();
  }, [selectedAccountId]);

  const entries = ledger?.entries ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.generalLedger.title}</h1>
        <p className="mt-1 text-ink/60">{t.generalLedger.subtitle}</p>
      </div>

      {accountsError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{accountsError}</div>
      )}
      {ledgerError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{ledgerError}</div>
      )}

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-ink">
          {t.generalLedger.selectAccount}
        </label>
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          disabled={accountsLoading || accountsList.length === 0}
          className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-gold sm:w-96"
        >
          {accountsList.map((a) => (
            <option key={a.id} value={a.id}>
              {a.code} — {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.generalLedger.date}</th>
              <th className="px-4 py-3 text-start font-medium">{t.generalLedger.reference}</th>
              <th className="px-4 py-3 text-start font-medium">{t.generalLedger.description}</th>
              <th className="px-4 py-3 text-end font-medium">{t.generalLedger.debit}</th>
              <th className="px-4 py-3 text-end font-medium">{t.generalLedger.credit}</th>
              <th className="px-4 py-3 text-end font-medium">{t.generalLedger.runningBalance}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={e.journalEntryId}
                className="border-b border-ink/5 last:border-0 hover:bg-ink/5"
              >
                <td className="numeric-ltr px-4 py-3 text-ink/60">{e.date.slice(0, 10)}</td>
                <td className="numeric-ltr px-4 py-3 text-ink/60">{e.reference}</td>
                <td className="px-4 py-3 text-ink">{e.description}</td>
                <td className="numeric-ltr px-4 py-3 text-end text-ink">
                  {e.debit > 0 ? `${formatKD(e.debit)} KD` : "—"}
                </td>
                <td className="numeric-ltr px-4 py-3 text-end text-ink">
                  {e.credit > 0 ? `${formatKD(e.credit)} KD` : "—"}
                </td>
                <td className="numeric-ltr px-4 py-3 text-end font-medium text-ink">
                  {formatKD(e.runningBalance)} KD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ledgerLoading && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">Loading…</p>
        )}
        {!ledgerLoading && !selectedAccountId && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">
            {t.generalLedger.noAccountSelected}
          </p>
        )}
        {!ledgerLoading && selectedAccountId && entries.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.generalLedger.noEntries}</p>
        )}
      </div>
    </div>
  );
}