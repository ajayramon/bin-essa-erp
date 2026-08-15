"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ClipboardCheck, CheckCircle2, AlertCircle, ArrowUpDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listStockCountsRequest,
  createStockCountRequest,
  listItemsRequest,
  type StockCountRecord,
  type ItemRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function StockCountsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [counts, setCounts] = useState<StockCountRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [countNumber, setCountNumber] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [systemQuantity, setSystemQuantity] = useState<number>(0);
  const [countedQuantity, setCountedQuantity] = useState<number>(0);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [countsData, itemsData] = await Promise.all([
          listStockCountsRequest(branchId),
          listItemsRequest(branchId),
        ]);
        if (!cancelled) {
          setCounts(countsData || []);
          setItems(itemsData || []);
          if (itemsData && itemsData.length > 0) {
            setSelectedItemId(itemsData[0].id);
            setSystemQuantity(Number(itemsData[0].stockQuantity || 0));
            setCountedQuantity(Number(itemsData[0].stockQuantity || 0));
            setUnitCost(Number(itemsData[0].cost || 0));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stock counts");
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

  function handleOpenCreateModal() {
    setCountNumber(`SC-${Date.now().toString().slice(-6)}`);
    setNotes("");
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
      setSystemQuantity(Number(items[0].stockQuantity || 0));
      setCountedQuantity(Number(items[0].stockQuantity || 0));
      setUnitCost(Number(items[0].cost || 0));
    }
    setIsModalOpen(true);
  }

  function handleItemChange(itemId: string) {
    setSelectedItemId(itemId);
    const itm = items.find((i) => i.id === itemId);
    if (itm) {
      setSystemQuantity(Number(itm.stockQuantity || 0));
      setCountedQuantity(Number(itm.stockQuantity || 0));
      setUnitCost(Number(itm.cost || 0));
    }
  }

  async function handleCreateStockCount(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createStockCountRequest({
        countNumber,
        branchId: currentBranch.id,
        notes,
        lines: [
          {
            itemId: selectedItemId,
            countedQuantity,
            systemQuantity,
            unitCost,
          },
        ],
      });
      setIsModalOpen(false);
      // Reload
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listStockCountsRequest(branchId);
      setCounts(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create stock count");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredCounts = counts.filter(
    (cnt) =>
      cnt.countNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cnt.notes && cnt.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "الجرد الدوري والفعلي للمخزون" : "Physical Stock Counts & Audit"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "مقارنة الجرد الفعلي بالرصيد الدفتري واحتساب فروقات الجرد آليًا."
              : "Compare physical warehouse counts against system ledger balances and compute stock variances."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "جلسة جرد جديدة" : "New Cycle Count"}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم الجرد، الملاحظات..."
              : "Search by count # or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Counts Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل سجلات الجرد..." : "Loading stock counts from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم الجلسة" : "Count #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الملاحظات" : "Notes"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "تاريخ الجرد" : "Counted Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredCounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد جلسات جرد مسجلة" : "No physical stock count sessions found."}
                  </td>
                </tr>
              ) : (
                filteredCounts.map((cnt) => (
                  <tr key={cnt.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {cnt.countNumber}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {cnt.branch?.name || "Main Branch"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {cnt.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">
                      {cnt.notes || "Periodic cycle audit"}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(cnt.countedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Count Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "تسجيل جرد فعلي جديد" : "New Physical Cycle Count"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "أدخل الكمية الفعلية المقاسة لمقارنتها بالرصيد الدفتري."
                : "Enter counted quantities to calculate physical inventory variances."}
            </p>

            <form onSubmit={handleCreateStockCount} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم الجرد" : "Count Number"}
                </label>
                <input
                  type="text"
                  required
                  value={countNumber}
                  onChange={(e) => setCountNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المنتج" : "Item"}
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku}) - System Stock: {i.stockQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "الرصيد الدفتري (النظام)" : "System Quantity"}
                  </label>
                  <input
                    type="number"
                    disabled
                    value={systemQuantity}
                    className="mt-1 w-full rounded-xl border border-ink/10 bg-ink/5 p-2.5 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "الكمية الفعلية المجرودة" : "Counted Quantity"}
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={countedQuantity}
                    onChange={(e) => setCountedQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">Calculated Variance:</span>
                  <span
                    className={`font-semibold ${
                      countedQuantity - systemQuantity < 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {countedQuantity - systemQuantity >= 0 ? "+" : ""}
                    {countedQuantity - systemQuantity} units
                  </span>
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
                  placeholder="Cycle count notes..."
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                    ? "اعتماد الجرد"
                    : "Confirm Count"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
