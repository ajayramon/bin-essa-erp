"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Target, Award, Percent, DollarSign, Users, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listSalesTargetsRequest,
  createSalesTargetRequest,
  calculateCommissionRequest,
  type SalesTargetRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function CommissionsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice, user } = useSession();

  const [targets, setTargets] = useState<SalesTargetRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [targetAmount, setTargetAmount] = useState<number>(5000);
  const [targetType, setTargetType] = useState("MONTHLY");
  const [commissionRate, setCommissionRate] = useState<number>(2.5);
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().split("T")[0]);
  const [periodEnd, setPeriodEnd] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const data = await listSalesTargetsRequest(branchId);
        if (!cancelled) {
          setTargets(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load sales targets");
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

  function handleOpenModal() {
    setTargetAmount(5000);
    setCommissionRate(2.5);
    setIsModalOpen(true);
  }

  async function handleCreateTarget(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createSalesTargetRequest({
        userId: user.id,
        branchId: currentBranch.id,
        targetAmount,
        targetType,
        commissionRate,
        periodStart,
        periodEnd,
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listSalesTargetsRequest(branchId);
      setTargets(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to set sales target");
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
            {locale === "ar" ? "عمولات وأهداف المبيعات" : "Sales Targets & Commission Engine"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "تحديد أهداف المبيعات الشهرية والربع سنوية، واحتساب عمولات مندوبي المبيعات تلقائيًا."
              : "Define monthly/quarterly branch targets and automatically calculate tiered sales rep commissions."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "تحديد هدف جديد" : "Set New Target"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي الأهداف المحددة" : "Total Active Targets"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(targets.reduce((s, t) => s + Number(t.targetAmount || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "المبيعات المحققة" : "Total Sales Achieved"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
            {formatKD(targets.reduce((s, t) => s + Number(t.achievedAmount || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "العمولات المستحقة" : "Earned Commissions"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(targets.reduce((s, t) => s + Number(t.commissionEarned || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>
      </div>

      {/* Targets Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل أهداف المبيعات..." : "Loading sales targets from database..."}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-ink/10 bg-ink/[0.02] text-xs font-semibold text-ink/60">
              <tr>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الموظف / المندوب" : "Representative"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "الهدف المحدد" : "Target Amount"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "المحقق" : "Achieved"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "نسبة العمولة" : "Rate"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "العمولة المكتسبة" : "Commission"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {targets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد أهداف مبيعات مسجلة" : "No sales targets defined."}
                  </td>
                </tr>
              ) : (
                targets.map((tgt) => (
                  <tr key={tgt.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-bold text-ink">
                      {tgt.user?.name || "Sales Rep"}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {tgt.branch?.name || "Main Branch"}
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-mono font-bold text-ink">
                      {formatKD(Number(tgt.targetAmount || 0))} KD
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-mono text-emerald-600">
                      {formatKD(Number(tgt.achievedAmount || 0))} KD
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-ink/70">
                      {tgt.commissionRate}%
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-mono font-bold text-ink">
                      {formatKD(Number(tgt.commissionEarned || 0))} KD
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "تحديد هدف مبيعات جديد" : "Set New Sales Target"}
            </h2>

            <form onSubmit={handleCreateTarget} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">Target Amount (KD)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="1"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">Start Date</label>
                  <input
                    type="date"
                    required
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">End Date</label>
                  <input
                    type="date"
                    required
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  />
                </div>
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
                  {isSubmitting ? "Saving..." : "Set Target"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
