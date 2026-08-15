"use client";

import { useEffect, useState } from "react";
import { Plus, Search, DollarSign, ArrowRightLeft, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listCashAccountsRequest,
  createCashAccountRequest,
  listCashTransfersRequest,
  createCashTransferRequest,
  type CashAccountRecord,
  type CashTransferRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function CashManagementPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [accounts, setAccounts] = useState<CashAccountRecord[]>([]);
  const [transfers, setTransfers] = useState<CashTransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transfer Form State
  const [transferNumber, setTransferNumber] = useState("");
  const [fromCashAccountId, setFromCashAccountId] = useState("");
  const [toCashAccountId, setToCashAccountId] = useState("");
  const [amount, setAmount] = useState<number>(200);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Account Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [balance, setBalance] = useState<number>(500);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [accData, trfData] = await Promise.all([
          listCashAccountsRequest(branchId),
          listCashTransfersRequest(),
        ]);
        if (!cancelled) {
          setAccounts(accData || []);
          setTransfers(trfData || []);
          if (accData && accData.length > 1) {
            setFromCashAccountId(accData[0].id);
            setToCashAccountId(accData[1].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load cash accounts");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [currentBranch, isHeadOffice]);

  function handleOpenTransferModal() {
    setTransferNumber(`CTX-${Date.now().toString().slice(-6)}`);
    setAmount(200);
    setNotes("");
    if (accounts.length > 1) {
      setFromCashAccountId(accounts[0].id);
      setToCashAccountId(accounts[1].id);
    }
    setIsTransferModalOpen(true);
  }

  function handleOpenAccountModal() {
    setCode(`CASH-${Date.now().toString().slice(-4)}`);
    setName("Branch Register");
    setIsMain(false);
    setBalance(500);
    setIsAccountModalOpen(true);
  }

  async function handleCreateTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (fromCashAccountId === toCashAccountId) {
      setError("Source and destination cash vaults cannot be the same");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createCashTransferRequest({
        transferNumber,
        fromCashAccountId,
        toCashAccountId,
        amount,
        notes,
      });
      setIsTransferModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const [accData, trfData] = await Promise.all([
        listCashAccountsRequest(branchId),
        listCashTransfersRequest(),
      ]);
      setAccounts(accData || []);
      setTransfers(trfData || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create cash transfer");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createCashAccountRequest({
        code,
        name,
        branchId: currentBranch?.id,
        isMain,
        balance,
      });
      setIsAccountModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const accData = await listCashAccountsRequest(branchId);
      setAccounts(accData || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create cash account");
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
            {locale === "ar" ? "إدارة الخزينة والنقدية (Cash Management)" : "Cash Management & Vaults"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "متابعة خزائن الفروع، الخزينة الرئيسية، والتحويلات النقدية مع ترحيل قيود اليومية آليًا."
              : "Manage branch cash registers, central HQ vault balances, and inter-vault transfers with automatic balancing GL."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAccountModal}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-transform hover:bg-ink/5"
          >
            <Plus className="h-4 w-4" />
            {locale === "ar" ? "خزينة جديدة" : "New Cash Account"}
          </button>
          <button
            type="button"
            onClick={handleOpenTransferModal}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {locale === "ar" ? "تحويل نقدية" : "Transfer Cash"}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي رصيد النقدية" : "Total Cash Liquidity"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(accounts.reduce((s, a) => s + Number(a.balance || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "عدد الخزائن وصناديق الفروع" : "Active Cash Registers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{accounts.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "الخزينة الرئيسية (HQ Vault)" : "HQ Main Vault"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
            {formatKD(
              accounts
                .filter((a) => a.isMain)
                .reduce((s, a) => s + Number(a.balance || 0), 0)
            )}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>
      </div>

      {/* Cash Accounts Grid */}
      <div>
        <h2 className="text-lg font-bold text-ink">
          {locale === "ar" ? "حسابات وصناديق النقدية" : "Cash Registers & Vaults"}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-ink/60">{acc.code}</span>
                {acc.isMain && (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    MAIN VAULT
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-base font-bold text-ink">{acc.name}</h3>
              <p className="text-xs text-ink/50">{acc.branch?.name || "Corporate Treasury"}</p>
              <div className="numeric-ltr mt-4 text-xl font-extrabold text-ink">
                {formatKD(Number(acc.balance || 0))}{" "}
                <span className="text-xs font-normal text-ink/50">KD</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cash Transfers */}
      <div>
        <h2 className="text-lg font-bold text-ink">
          {locale === "ar" ? "سجل التحويلات النقدية بين الخزائن" : "Inter-Vault Cash Transfers"}
        </h2>

        {isLoading && (
          <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">
            {locale === "ar" ? "جارٍ تحميل التحويلات..." : "Loading transfers..."}
          </div>
        )}

        {!isLoading && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-ink/10 bg-ink/[0.02] text-xs font-semibold text-ink/60">
                <tr>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم التحويل" : "Transfer #"}</th>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "من خزينة" : "From Account"}</th>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "إلى خزينة" : "To Account"}</th>
                  <th className="px-5 py-3.5 text-end">{locale === "ar" ? "المبلغ المحول" : "Amount"}</th>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الملاحظات" : "Notes"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink/40">
                      {locale === "ar" ? "لا توجد تحويلات نقدية مسجلة" : "No cash transfers found."}
                    </td>
                  </tr>
                ) : (
                  transfers.map((tr) => (
                    <tr key={tr.id} className="transition-colors hover:bg-ink/[0.01]">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                        {tr.transferNumber}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-ink">
                        {tr.fromCashAccount?.name || tr.fromCashAccountId}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-ink">
                        {tr.toCashAccount?.name || tr.toCashAccountId}
                      </td>
                      <td className="numeric-ltr px-5 py-4 text-end font-bold text-ink">
                        {formatKD(Number(tr.amount || 0))} KD
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          {tr.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-ink/60">{tr.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "تحويل نقدية بين الخزائن" : "Inter-Vault Cash Transfer"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم ترحيل قيد يومية متوازن آليًا في الدفتر العام."
                : "Automated double-entry GL will debit recipient vault and credit source vault."}
            </p>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم التحويل" : "Transfer Number"}
                </label>
                <input
                  type="text"
                  required
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "من خزينة (المصدر)" : "From Account"}
                  </label>
                  <select
                    value={fromCashAccountId}
                    onChange={(e) => setFromCashAccountId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatKD(Number(a.balance))} KD)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "إلى خزينة (المستلم)" : "To Account"}
                  </label>
                  <select
                    value={toCashAccountId}
                    onChange={(e) => setToCashAccountId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatKD(Number(a.balance))} KD)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المبلغ المحول (KD)" : "Transfer Amount (KD)"}
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "الملاحظات" : "Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Excess cash transfer to HQ..."
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting
                    ? locale === "ar"
                      ? "جارٍ الحفظ..."
                      : "Saving..."
                    : locale === "ar"
                    ? "تأكيد التحويل"
                    : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "إضافة خزينة / صندوق جديد" : "New Cash Account"}
            </h2>
            <form onSubmit={handleCreateAccount} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "كود الخزينة" : "Account Code"}
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "اسم الخزينة" : "Account Name"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "الرصيد الافتتاحي (KD)" : "Opening Balance (KD)"}
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMainVault"
                  checked={isMain}
                  onChange={(e) => setIsMain(e.target.checked)}
                  className="h-4 w-4 rounded border-ink/20"
                />
                <label htmlFor="isMainVault" className="text-xs font-medium text-ink/80">
                  {locale === "ar" ? "خزينة رئيسية للشركة (HQ Main Vault)" : "Is Central HQ Main Vault"}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
