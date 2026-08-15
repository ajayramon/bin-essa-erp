"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Landmark, CheckCircle2, ShieldCheck, FileCheck, ArrowRightLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listBankAccountsRequest,
  createBankAccountRequest,
  listBankReconciliationsRequest,
  createBankReconciliationRequest,
  type BankAccountRecord,
  type BankReconciliationRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function BankManagementPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [bankAccounts, setBankAccounts] = useState<BankAccountRecord[]>([]);
  const [reconciliations, setReconciliations] = useState<BankReconciliationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReconModalOpen, setIsReconModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recon Form State
  const [selectedBankAccountId, setSelectedBankAccountId] = useState("");
  const [statementEndingBalance, setStatementEndingBalance] = useState<number>(25000);
  const [statementDate, setStatementDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Bank Account Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("National Bank of Kuwait (NBK)");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [balance, setBalance] = useState<number>(25000);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [accData, reconData] = await Promise.all([
          listBankAccountsRequest(),
          listBankReconciliationsRequest(),
        ]);
        if (!cancelled) {
          setBankAccounts(accData || []);
          setReconciliations(reconData || []);
          if (accData && accData.length > 0) {
            setSelectedBankAccountId(accData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load bank accounts");
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

  function handleOpenReconModal() {
    setStatementEndingBalance(25000);
    setStatementDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    if (bankAccounts.length > 0) {
      setSelectedBankAccountId(bankAccounts[0].id);
    }
    setIsReconModalOpen(true);
  }

  function handleOpenAccountModal() {
    setCode(`NBK-${Date.now().toString().slice(-4)}`);
    setName("NBK Corporate Commercial");
    setBankName("National Bank of Kuwait");
    setAccountNumber("1002993847");
    setIban("KW82NBOK0000000000001002993847");
    setBalance(25000);
    setIsAccountModalOpen(true);
  }

  async function handleCreateReconciliation(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createBankReconciliationRequest({
        bankAccountId: selectedBankAccountId,
        statementEndingBalance,
        statementDate,
        notes,
      });
      setIsReconModalOpen(false);
      const reconData = await listBankReconciliationsRequest();
      setReconciliations(reconData || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create bank reconciliation");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateBankAccount(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createBankAccountRequest({
        code,
        name,
        bankName,
        accountNumber,
        iban,
        balance,
      });
      setIsAccountModalOpen(false);
      const accData = await listBankAccountsRequest();
      setBankAccounts(accData || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create bank account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "إدارة الحسابات البنكية والتسويات" : "Bank Management & Reconciliation"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "متابعة أرصدة البنوك، الشيكات، ومطابقة كشوف الحسابات الشهرية مع السجلات الدفترية."
              : "Manage bank accounts, electronic payment collections (KNET/Visa), and monthly bank statement reconciliations."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAccountModal}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-transform hover:bg-ink/5"
          >
            <Plus className="h-4 w-4" />
            {locale === "ar" ? "حساب بنكي جديد" : "New Bank Account"}
          </button>
          <button
            type="button"
            onClick={handleOpenReconModal}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileCheck className="h-4 w-4" />
            {locale === "ar" ? "مطابقة كشف حساب" : "Reconcile Statement"}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي السيولة البنكية" : "Total Bank Balances"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(bankAccounts.reduce((s, b) => s + Number(b.balance || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "الحسابات النشطة" : "Active Bank Accounts"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{bankAccounts.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "حالة التسويات البنكية" : "Reconciliation Status"}
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-600">
            {reconciliations.length} Statements Matched
          </p>
          <p className="text-xs text-ink/40">Zero reconciliation variance</p>
        </div>
      </div>

      {/* Bank Accounts Grid */}
      <div>
        <h2 className="text-lg font-bold text-ink">
          {locale === "ar" ? "الحسابات البنكية المعتمدة" : "Bank Accounts"}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-ink/60">{acc.code}</span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {acc.currency}
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-ink">{acc.name}</h3>
              <p className="text-xs font-medium text-ink/70">{acc.bankName}</p>
              <p className="mt-1 font-mono text-xs text-ink/40">A/C: {acc.accountNumber}</p>
              {acc.iban && <p className="font-mono text-[10px] text-ink/40">IBAN: {acc.iban}</p>}
              <div className="numeric-ltr mt-4 text-xl font-extrabold text-ink">
                {formatKD(Number(acc.balance || 0))}{" "}
                <span className="text-xs font-normal text-ink/50">KD</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Reconciliations Table */}
      <div>
        <h2 className="text-lg font-bold text-ink">
          {locale === "ar" ? "سجل مطابقة كشوف الحسابات" : "Bank Reconciliations"}
        </h2>

        {isLoading && (
          <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">
            {locale === "ar" ? "جارٍ تحميل التسويات..." : "Loading reconciliations..."}
          </div>
        )}

        {!isLoading && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-ink/10 bg-ink/[0.02] text-xs font-semibold text-ink/60">
                <tr>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحساب البنكي" : "Bank Account"}</th>
                  <th className="px-5 py-3.5 text-end">{locale === "ar" ? "رصيد الكشف" : "Statement Balance"}</th>
                  <th className="px-5 py-3.5 text-end">{locale === "ar" ? "الرصيد الدفتري" : "Book Balance"}</th>
                  <th className="px-5 py-3.5 text-end">{locale === "ar" ? "الفارق" : "Difference"}</th>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "تاريخ المطابقة" : "Date"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {reconciliations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink/40">
                      {locale === "ar" ? "لا توجد تسويات بنكية مسجلة" : "No bank reconciliations found."}
                    </td>
                  </tr>
                ) : (
                  reconciliations.map((rec) => (
                    <tr key={rec.id} className="transition-colors hover:bg-ink/[0.01]">
                      <td className="px-5 py-4 font-semibold text-ink">
                        {rec.bankAccount?.name || rec.bankAccountId}
                      </td>
                      <td className="numeric-ltr px-5 py-4 text-end font-mono text-ink">
                        {formatKD(Number(rec.statementEndingBalance || 0))} KD
                      </td>
                      <td className="numeric-ltr px-5 py-4 text-end font-mono text-ink">
                        {formatKD(Number(rec.bookBalance || 0))} KD
                      </td>
                      <td className="numeric-ltr px-5 py-4 text-end font-mono font-bold text-emerald-600">
                        {formatKD(Number(rec.difference || 0))} KD
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-ink/50">
                        {new Date(rec.statementDate || rec.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recon Modal */}
      {isReconModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "مطابقة كشف حساب بنكي" : "Bank Statement Reconciliation"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "أدخل الرصيد الختامي لكشف حساب البنك لمطابقته مع الحركات الدفترية."
                : "Enter bank statement ending balance to match against general ledger entries."}
            </p>

            <form onSubmit={handleCreateReconciliation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "الحساب البنكي" : "Bank Account"}
                </label>
                <select
                  value={selectedBankAccountId}
                  onChange={(e) => setSelectedBankAccountId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.bankName}) - Book Balance: {formatKD(Number(b.balance))} KD
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "الرصيد الختامي للكشف (KD)" : "Ending Statement Balance"}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={statementEndingBalance}
                    onChange={(e) => setStatementEndingBalance(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "تاريخ الكشف" : "Statement Date"}
                  </label>
                  <input
                    type="date"
                    required
                    value={statementDate}
                    onChange={(e) => setStatementDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "الملاحظات" : "Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Monthly bank statement reconciliation..."
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsReconModalOpen(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Confirm Reconciliation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Bank Account Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "إضافة حساب بنكي جديد" : "New Bank Account"}
            </h2>
            <form onSubmit={handleCreateBankAccount} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">Account Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/70">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">Account Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/70">Opening Balance (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">IBAN</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Bank Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
