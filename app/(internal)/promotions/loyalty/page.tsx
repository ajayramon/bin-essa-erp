"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Gift, Award, Star, CheckCircle2, User, Coins } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listCustomersRequest,
  getLoyaltyCustomerAccountRequest,
  createLoyaltyTransactionRequest,
  type CustomerRecord,
  type LoyaltyAccountRecord,
} from "@/lib/api";

export default function LoyaltyProgramPage() {
  const { locale, t } = useLocale();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccountRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [points, setPoints] = useState<number>(100);
  const [transactionType, setTransactionType] = useState<"EARN" | "REDEEM" | "EXPIRE">("EARN");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      setIsLoading(true);
      setError(null);
      try {
        const custData = await listCustomersRequest();
        if (!cancelled) {
          setCustomers(custData || []);
          if (custData && custData.length > 0) {
            setSelectedCustomerId(custData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load customers");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCustomers();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      if (!selectedCustomerId) return;
      try {
        const acc = await getLoyaltyCustomerAccountRequest(selectedCustomerId);
        if (!cancelled) {
          setLoyaltyAccount(acc);
        }
      } catch (err) {
        if (!cancelled) {
          setLoyaltyAccount(null);
        }
      }
    }

    loadAccount();
    return () => {
      cancelled = true;
    };
  }, [selectedCustomerId]);

  function handleOpenModal() {
    setPoints(100);
    setTransactionType("EARN");
    setReference(`INV-${Date.now().toString().slice(-4)}`);
    setIsModalOpen(true);
  }

  async function handleCreateLoyaltyTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomerId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createLoyaltyTransactionRequest({
        customerId: selectedCustomerId,
        points,
        type: transactionType,
        reference,
      });
      setIsModalOpen(false);
      const acc = await getLoyaltyCustomerAccountRequest(selectedCustomerId);
      setLoyaltyAccount(acc);
    } catch (err: any) {
      setError(err?.message || "Failed to record points transaction");
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
            {locale === "ar" ? "برنامج ولاء ومكافآت العملاء" : "Customer Loyalty & Rewards Program"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "متابعة أرصدة النقاط، شرائح العملاء (Silver/Gold/Platinum)، واستبدال النقاط في نقاط البيع."
              : "Track customer loyalty points, tier statuses, and reward redemptions across retail POS branches."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          disabled={!selectedCustomerId}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Coins className="h-4 w-4" />
          {locale === "ar" ? "حركة نقاط جديدة" : "Record Points Transaction"}
        </button>
      </div>

      {/* Customer Selector */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50">
          {locale === "ar" ? "اختر العميل لعرض سجل الولاء" : "Select Customer Account"}
        </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-ink/10 p-3 text-sm font-semibold text-ink focus:border-ink/30 focus:outline-none"
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code}) - {c.phone || "No phone"}
            </option>
          ))}
        </select>
      </div>

      {/* Loyalty Account Details */}
      {loyaltyAccount && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                {locale === "ar" ? "الرصيد الحالي للنقاط" : "Current Active Points"}
              </p>
              <p className="numeric-ltr mt-2 text-3xl font-extrabold text-ink">
                {loyaltyAccount.pointsBalance.toLocaleString()} pts
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                {locale === "ar" ? "الشريحة الحالية" : "Loyalty Tier"}
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                ★ {loyaltyAccount.tier || "SILVER"}
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                {locale === "ar" ? "إجمالي النقاط المكتسبة" : "Lifetime Points Earned"}
              </p>
              <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
                {(loyaltyAccount.totalPointsEarned ?? loyaltyAccount.pointsBalance ?? 0).toLocaleString()} pts
              </p>
            </div>
          </div>

          {/* Points History Table */}
          <div>
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "سجل حركات النقاط" : "Points Ledger"}
            </h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
              <table className="w-full text-start text-sm">
                <thead className="border-b border-ink/10 bg-ink/[0.02] text-xs font-semibold text-ink/60">
                  <tr>
                    <th className="px-5 py-3.5 text-start">{locale === "ar" ? "نوع الحركة" : "Type"}</th>
                    <th className="px-5 py-3.5 text-end">{locale === "ar" ? "عدد النقاط" : "Points"}</th>
                    <th className="px-5 py-3.5 text-start">{locale === "ar" ? "المرجع" : "Reference"}</th>
                    <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {(!loyaltyAccount.transactions || loyaltyAccount.transactions.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-ink/40">
                        {locale === "ar" ? "لا توجد حركات نقاط مسجلة" : "No points transactions recorded yet."}
                      </td>
                    </tr>
                  ) : (
                    loyaltyAccount.transactions.map((tx) => (
                      <tr key={tx.id} className="transition-colors hover:bg-ink/[0.01]">
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                              tx.type === "EARN"
                                ? "bg-emerald-50 text-emerald-700"
                                : tx.type === "REDEEM"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="numeric-ltr px-5 py-4 text-end font-mono font-bold text-ink">
                          {tx.type === "EARN" ? "+" : "-"}
                          {tx.points} pts
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-ink/60">{tx.reference || "—"}</td>
                        <td className="px-5 py-4 text-xs text-ink/50">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "حركة نقاط ولاء جديدة" : "Record Points Transaction"}
            </h2>

            <form onSubmit={handleCreateLoyaltyTransaction} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  <option value="EARN">EARN (اكتساب نقاط)</option>
                  <option value="REDEEM">REDEEM (استبدال نقاط)</option>
                  <option value="EXPIRE">EXPIRE (انتهاء صلاحية)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">Points Amount</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">Invoice Reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. INV-9902"
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Record Points"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
