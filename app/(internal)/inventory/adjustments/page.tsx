"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Layers, AlertTriangle, CheckCircle2, ArrowUpDown, FileSpreadsheet } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listStockAdjustmentsRequest,
  createStockAdjustmentRequest,
  listItemsRequest,
  type StockAdjustmentRecord,
  type ItemRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function StockAdjustmentsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [adjustments, setAdjustments] = useState<StockAdjustmentRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [adjustmentNumber, setAdjustmentNumber] = useState("");
  const [reason, setReason] = useState("DAMAGE");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantityChange, setQuantityChange] = useState<number>(-1);
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
        const [adjData, itemsData] = await Promise.all([
          listStockAdjustmentsRequest(branchId),
          listItemsRequest(branchId),
        ]);
        if (!cancelled) {
          setAdjustments(adjData || []);
          setItems(itemsData || []);
          if (itemsData && itemsData.length > 0) {
            setSelectedItemId(itemsData[0].id);
            setUnitCost(Number(itemsData[0].cost || 0));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stock adjustments");
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
    setAdjustmentNumber(`ADJ-${Date.now().toString().slice(-6)}`);
    setReason("DAMAGE");
    setQuantityChange(-1);
    setNotes("");
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
      setUnitCost(Number(items[0].cost || 0));
    }
    setIsModalOpen(true);
  }

  function handleItemChange(itemId: string) {
    setSelectedItemId(itemId);
    const itm = items.find((i) => i.id === itemId);
    if (itm) {
      setUnitCost(Number(itm.cost || 0));
    }
  }

  async function handleCreateAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createStockAdjustmentRequest({
        adjustmentNumber,
        branchId: currentBranch.id,
        reason,
        notes,
        lines: [
          {
            itemId: selectedItemId,
            quantityChange,
            unitCost,
          },
        ],
      });
      setIsModalOpen(false);
      // Reload
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listStockAdjustmentsRequest(branchId);
      setAdjustments(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create stock adjustment");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredAdjustments = adjustments.filter(
    (adj) =>
      adj.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (adj.notes && adj.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "تسويات المخزون والتوالف" : "Stock Adjustments & Shrinkage"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "تسجيل العجز، التوالف، منتهي الصلاحية مع ترحيل قيود الخسائر تلقائيًا للدفتر العام."
              : "Record stock write-offs, damages, and expired goods with automated double-entry GL posting."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "تسوية جديدة" : "New Adjustment"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي التسويات" : "Total Adjustments"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{adjustments.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "قيمة خسائر التوالف" : "Total Shrinkage / Loss Value"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-red-600">
            {formatKD(
              adjustments.reduce((s, a) => s + Number(a.totalValue || 0), 0)
            )}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "حساب الأستاذ العام المرتبط" : "GL Posting Account"}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            5200 - Inventory Shrinkage & Loss
          </p>
          <p className="text-xs text-ink/40">Dr 5200 Loss / Cr 1200 Inventory Asset</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم التسوية، السبب، أو الملاحظات..."
              : "Search by adjustment #, reason, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Adjustments Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل التسويات..." : "Loading adjustments from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم التسوية" : "Adjustment #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "السبب" : "Reason"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "القيمة المالية" : "Total Value"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد تسويات مسجلة" : "No stock adjustment records found."}
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((adj) => (
                  <tr key={adj.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {adj.adjustmentNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <AlertTriangle className="h-3 w-3" />
                        {adj.reason}
                      </span>
                      {adj.notes && <div className="mt-1 text-xs text-ink/50">{adj.notes}</div>}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {adj.branch?.name || "Main Branch"}
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-semibold text-ink">
                      {formatKD(Number(adj.totalValue || 0))} KD
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {adj.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(adj.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Adjustment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "تسجيل تسوية مخزون جديدة" : "New Stock Adjustment"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم تعديل رصيد المخزون الفعلي وترحيل قيد الخسارة إلى الدفتر العام."
                : "Inventory balances will adjust immediately with balancing journal entry."}
            </p>

            <form onSubmit={handleCreateAdjustment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم التسوية" : "Adjustment Number"}
                </label>
                <input
                  type="text"
                  required
                  value={adjustmentNumber}
                  onChange={(e) => setAdjustmentNumber(e.target.value)}
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
                      {i.name} ({i.sku}) - Cost: {Number(i.cost).toFixed(3)} KD
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "تغيير الكمية (+ أو -)" : "Quantity Change (+ / -)"}
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                  <p className="mt-0.5 text-[10px] text-ink/40">Use negative for write-off/damage</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "السبب" : "Reason"}
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    <option value="DAMAGE">DAMAGE (توالف)</option>
                    <option value="SHRINKAGE">SHRINKAGE (عجز)</option>
                    <option value="EXPIRY">EXPIRY (منتهي الصلاحية)</option>
                    <option value="COUNT_CORRECTION">COUNT_CORRECTION (تصحيح جرد)</option>
                    <option value="OTHER">OTHER (أخرى)</option>
                  </select>
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
                  placeholder="Reason for adjustment..."
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
                    ? "تأكيد التسوية"
                    : "Confirm Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
