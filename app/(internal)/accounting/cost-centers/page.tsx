"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Building2, Layers, CheckCircle2, DollarSign } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listCostCentersRequest,
  createCostCenterRequest,
  type CostCenterRecord,
} from "@/lib/api";

export default function CostCentersPage() {
  const { locale, t } = useLocale();

  const [costCenters, setCostCenters] = useState<CostCenterRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("BRANCH");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listCostCentersRequest();
        if (!cancelled) {
          setCostCenters(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load cost centers");
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

  function handleOpenCreateModal() {
    setCode(`CC-${Date.now().toString().slice(-4)}`);
    setName("Salmiya Operations");
    setType("BRANCH");
    setIsModalOpen(true);
  }

  async function handleCreateCostCenter(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createCostCenterRequest({
        code,
        name,
        type,
      });
      setIsModalOpen(false);
      const updated = await listCostCentersRequest();
      setCostCenters(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create cost center");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredCostCenters = costCenters.filter(
    (cc) =>
      cc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "مراكز التكلفة (Cost Centers)" : "Cost Centers Management"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "هيكلة مراكز التكلفة للفروع والمستودعات والأقسام لتتبع الأرباح والخسائر التحليلية."
              : "Define analytical cost centers for branches, warehouses, and departments to measure granular profitability."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "مركز تكلفة جديد" : "New Cost Center"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي مراكز التكلفة" : "Total Cost Centers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{costCenters.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "مراكز الفروع" : "Branch Centers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {costCenters.filter((c) => c.type === "BRANCH").length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "مراكز المستودعات والأقسام" : "Warehouse & Custom"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {costCenters.filter((c) => c.type !== "BRANCH").length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث بالكود، الاسم، أو النوع..."
              : "Search by code, name, or type..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Cost Centers Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل مراكز التكلفة..." : "Loading cost centers from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الكود" : "Code"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "اسم مركز التكلفة" : "Cost Center Name"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "النوع" : "Type"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredCostCenters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد مراكز تكلفة مسجلة" : "No cost centers found."}
                  </td>
                </tr>
              ) : (
                filteredCostCenters.map((cc) => (
                  <tr key={cc.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {cc.code}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">{cc.name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
                        {cc.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "إضافة مركز تكلفة جديد" : "New Cost Center"}
            </h2>
            <form onSubmit={handleCreateCostCenter} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  <option value="BRANCH">BRANCH (فرع)</option>
                  <option value="WAREHOUSE">WAREHOUSE (مستودع)</option>
                  <option value="DEPARTMENT">DEPARTMENT (قسم)</option>
                  <option value="CUSTOM">CUSTOM (مخصص)</option>
                </select>
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
                  {isSubmitting ? "Saving..." : "Save Cost Center"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
