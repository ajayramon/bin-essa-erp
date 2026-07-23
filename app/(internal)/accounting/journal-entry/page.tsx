"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { accounts } from "@/lib/mock-data/accounts";
import type { JournalEntryLine } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function JournalEntryPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const [date, setDate] = useState(todayISO());
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<JournalEntryLine[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const brandAccounts = currentBrand
    ? accounts.filter((a) => a.brandId === currentBrand.id)
    : [];

  function addLine() {
    const firstAccount = brandAccounts[0];
    if (!firstAccount) return;
    setLines([...lines, { accountId: firstAccount.id, debitKd: 0, creditKd: 0 }]);
    setMessage(null);
  }

  function updateLine(index: number, patch: Partial<JournalEntryLine>) {
    const next = [...lines];
    next[index] = { ...next[index], ...patch };
    setLines(next);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  function accountLabel(accountId: string) {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return accountId;
    const name = locale === "ar" ? acc.nameAr : acc.nameEn;
    return `${acc.code} — ${name}`;
  }

  const totalDebit = lines.reduce((sum, l) => sum + l.debitKd, 0);
  const totalCredit = lines.reduce((sum, l) => sum + l.creditKd, 0);
  const difference = Math.round((totalDebit - totalCredit) * 1000) / 1000;
  const isBalanced = difference === 0 && lines.length > 0;

  function handlePost() {
    if (!isBalanced || !memo.trim()) return;
    setMessage(t.journalEntry.entryPosted);
    setLines([]);
    setMemo("");
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.journalEntry.title}</h1>
        <p className="mt-1 text-ink/60">{t.journalEntry.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">{t.journalEntry.date}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="numeric-ltr w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">{t.journalEntry.memo}</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t.journalEntry.account}</h2>
          <button
            onClick={addLine}
            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-gold hover:text-ink"
          >
            {t.journalEntry.addLine}
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/40">{t.journalEntry.noLines}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-start text-ink/50">
                  <th className="px-3 py-2 text-start font-medium">{t.journalEntry.account}</th>
                  <th className="px-3 py-2 text-start font-medium">{t.journalEntry.debit}</th>
                  <th className="px-3 py-2 text-start font-medium">{t.journalEntry.credit}</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index} className="border-b border-ink/5 last:border-0">
                    <td className="px-3 py-2">
                      <select
                        value={line.accountId}
                        onChange={(e) => updateLine(index, { accountId: e.target.value })}
                        className="w-full rounded-lg border border-ink/10 px-2 py-1.5 text-sm sm:w-64"
                      >
                        {brandAccounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {accountLabel(a.id)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step={0.001}
                        value={line.debitKd}
                        onChange={(e) =>
                          updateLine(index, { debitKd: Number(e.target.value), creditKd: 0 })
                        }
                        className="numeric-ltr w-28 rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step={0.001}
                        value={line.creditKd}
                        onChange={(e) =>
                          updateLine(index, { creditKd: Number(e.target.value), debitKd: 0 })
                        }
                        className="numeric-ltr w-28 rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-end">
                      <button
                        onClick={() => removeLine(index)}
                        className="text-xs text-ink/40 hover:text-red-600"
                      >
                        {t.journalEntry.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink/60">{t.journalEntry.totalDebit}</span>
          <span className="numeric-ltr font-medium text-ink">{formatKD(totalDebit)} KD</span>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-ink/60">{t.journalEntry.totalCredit}</span>
          <span className="numeric-ltr font-medium text-ink">{formatKD(totalCredit)} KD</span>
        </div>

        <div
          className={`mb-4 rounded-lg px-3 py-2 text-center text-sm font-medium ${
            isBalanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {isBalanced
            ? t.journalEntry.balanced
            : `${t.journalEntry.outOfBalance} ${formatKD(Math.abs(difference))} KD`}
        </div>

        <button
          onClick={handlePost}
          disabled={!isBalanced || !memo.trim()}
          className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white hover:bg-gold hover:text-ink disabled:opacity-40"
        >
          {t.journalEntry.post}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm font-medium text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
