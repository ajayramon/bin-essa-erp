"use client";

import { useEffect, useState } from "react";
import { Plus, Search, FileText, CheckCircle2, Clock, XCircle, ShoppingBag } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listPurchaseRequisitionsRequest,
  createPurchaseRequisitionRequest,
  listItemsRequest,
  type PurchaseRequisitionRecord,
  type ItemRecord,
} from "@/lib/api";

export default function PurchaseRequisitionsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice, user } = useSession();

  const [requisitions, setRequisitions] = useState<PurchaseRequisitionRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [prNumber, setPrNumber] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState<number>(50);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [prData, itemsData] = await Promise.all([
          listPurchaseRequisitionsRequest(branchId),
          listItemsRequest(branchId),
        ]);
        if (!cancelled) {
          setRequisitions(prData || []);
          setItems(itemsData || []);
          if (itemsData && itemsData.length > 0) {
            setSelectedItemId(itemsData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load requisitions");
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
    setPrNumber(`PR-${Date.now().toString().slice(-6)}`);
    setQuantity(50);
    setNotes("");
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
    }
    setIsModalOpen(true);
  }

  async function handleCreatePR(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createPurchaseRequisitionRequest({
        prNumber,
        branchId: currentBranch.id,
        requestedByUserId: user?.id,
        notes,
        lines: [
          {
            itemId: selectedItemId,
            quantity,
            notes,
          },
        ],
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listPurchaseRequisitionsRequest(branchId);
      setRequisitions(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create purchase requisition");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredRequisitions = requisitions.filter(
    (pr) =>
      pr.prNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pr.notes && pr.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "طلبات الشراء والاحتياج (PR)" : "Purchase Requisitions (PR)"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "المرحلة الأولى من دورة المشتريات: طلب احتياجات الأصناف والموافقة الإدارية."
              : "First stage in the purchasing workflow: Internal stock requisition and manager approval."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "طلب شراء جديد" : "New Requisition"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي الطلبات" : "Total Requisitions"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{requisitions.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "قيد الاعتماد" : "Pending Approval"}
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {requisitions.filter((r) => r.status === "PENDING").length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "المعتمدة والمحولة لأوامر" : "Approved & Ordered"}
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {requisitions.filter((r) => r.status === "APPROVED" || r.status === "ORDERED").length}
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
              ? "بحث برقم الطلب، الحالة، أو الملاحظات..."
              : "Search by PR #, status, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Requisitions Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل طلبات الشراء..." : "Loading requisitions from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم الطلب" : "PR Number"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الملاحظات" : "Notes"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "تاريخ الطلب" : "Requested Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد طلبات شراء مسجلة" : "No purchase requisitions found."}
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map((pr) => (
                  <tr key={pr.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {pr.prNumber}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {pr.branch?.name || "Main Branch"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          pr.status === "APPROVED" || pr.status === "ORDERED"
                            ? "bg-emerald-50 text-emerald-700"
                            : pr.status === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">{pr.notes || "—"}</td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(pr.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create PR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "طلب شراء جديد (PR)" : "New Purchase Requisition"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "حدد الصنف المطلوب والكمية لرفع الطلب للاعتماد."
                : "Create an internal stock requisition to begin the purchasing pipeline."}
            </p>

            <form onSubmit={handleCreatePR} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم الطلب" : "Requisition Number"}
                </label>
                <input
                  type="text"
                  required
                  value={prNumber}
                  onChange={(e) => setPrNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المنتج المطلوب" : "Item Requested"}
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "الكمية المطلوبة" : "Quantity"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
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
                  placeholder="Requisition reason..."
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
                    ? "إرسال الطلب"
                    : "Submit Requisition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
