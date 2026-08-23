"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Truck, ArrowRight, CheckCircle2, Clock, XCircle, Package, ArrowLeftRight, ClipboardCheck, Barcode } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listStockTransfersRequest,
  createStockTransferRequest,
  listBranchesRequest,
  listItemsRequest,
  type StockTransferRecord,
  type BranchRecord,
  type ItemRecord,
} from "@/lib/api";

export default function StockTransfersPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();
  const isAr = locale === "ar";

  const [transfers, setTransfers] = useState<StockTransferRecord[]>([]);
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [transferNumber, setTransferNumber] = useState("");
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantityRequested, setQuantityRequested] = useState<number>(10);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [trfData, brData, itmData] = await Promise.all([
          listStockTransfersRequest(),
          listBranchesRequest(),
          listItemsRequest(),
        ]);
        if (!cancelled) {
          setTransfers(trfData || []);
          setBranches(brData || []);
          setItems(itmData || []);
          if (brData && brData.length > 1) {
            setFromBranchId(brData[0].id);
            setToBranchId(brData[1].id);
          }
          if (itmData && itmData.length > 0) {
            setSelectedItemId(itmData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stock transfers");
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
    setTransferNumber(`TRF-${Date.now().toString().slice(-6)}`);
    setQuantityRequested(10);
    setNotes("");
    if (branches.length > 1) {
      setFromBranchId(branches[0].id);
      setToBranchId(branches[1].id);
    }
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
    }
    setIsModalOpen(true);
  }

  async function handleCreateTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!fromBranchId || !toBranchId || !selectedItemId) return;
    if (fromBranchId === toBranchId) {
      setError(locale === "ar" ? "لا يمكن التحويل لنفس الفرع" : "Source and destination branch cannot be identical");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createStockTransferRequest({
        transferNumber,
        fromBranchId,
        toBranchId,
        notes,
        lines: [
          {
            itemId: selectedItemId,
            quantityRequested,
          },
        ],
      });
      setIsModalOpen(false);
      const updated = await listStockTransfersRequest();
      setTransfers(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create stock transfer");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredTransfers = transfers.filter(
    (tr) =>
      tr.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tr.notes && tr.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "التحويلات بين الفروع والمستودعات" : "Inter-Branch Stock Transfers"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "متابعة أوامر التحويل، الشحن، والاستلام الفعلي بين كافة فروع بن عيسى الـ 14."
              : "Formal multi-stage stock movement tracking: Request, Dispatch, and Confirmation of Receipt."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-[#FDCE0C] shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "طلب تحويل جديد" : "+ New Stock Transfer"}
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 pb-3">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <Package className="h-4 w-4 text-slate-600" />
          <span>{isAr ? "سجل بطاقات الأصناف (Item Master)" : "Item Master Catalog"}</span>
        </Link>

        <Link
          href="/inventory/adjustments"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <ArrowLeftRight className="h-4 w-4 text-amber-600" />
          <span>{isAr ? "تسويات المخزون" : "Stock Adjustments"}</span>
        </Link>

        <Link
          href="/inventory/transfers"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-[#FDCE0C] shadow-xs"
        >
          <Truck className="h-4 w-4 text-[#FDCE0C]" />
          <span>{isAr ? "التحويلات بين الفروع" : "Stock Transfers"}</span>
        </Link>

        <Link
          href="/inventory/counts"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <ClipboardCheck className="h-4 w-4 text-emerald-600" />
          <span>{isAr ? "الجرد الفعلي الدوري" : "Stock Counts & Audits"}</span>
        </Link>

        <Link
          href="/inventory/serial-tracking"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          <Barcode className="h-4 w-4 text-purple-600" />
          <span>{isAr ? "الأرقام التسلسلية والصلاحيات" : "Serial & Batch Tracking"}</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي التحويلات" : "Total Transfers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{transfers.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "قيد الشحن" : "In Transit / Dispatched"}
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {transfers.filter((t) => t.status === "DISPATCHED").length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "تم الاستلام" : "Received & Settled"}
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {transfers.filter((t) => t.status === "RECEIVED").length}
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
              ? "بحث برقم التحويل أو الملاحظات..."
              : "Search by transfer # or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Transfers Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل التحويلات..." : "Loading stock transfers from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم التحويل" : "Transfer #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "من فرع" : "Source Branch"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "إلى فرع" : "Destination Branch"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الملاحظات" : "Notes"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد تحويلات مسجلة" : "No stock transfer records found."}
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((tr) => (
                  <tr key={tr.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {tr.transferNumber}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-ink">
                      {branches.find((b) => b.id === tr.fromBranchId)?.name || tr.fromBranchId}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-ink">
                      {branches.find((b) => b.id === tr.toBranchId)?.name || tr.toBranchId}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          tr.status === "RECEIVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : tr.status === "DISPATCHED"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-ink/5 text-ink/70"
                        }`}
                      >
                        {tr.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">{tr.notes || "—"}</td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(tr.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "طلب تحويل مخزون جديد" : "New Stock Transfer Request"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "حدد فرع المصدر والوجهة والكميات المطلوب نقلها."
                : "Specify source and destination branches with quantities to be dispatched."}
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
                    {locale === "ar" ? "من فرع (المصدر)" : "From Branch"}
                  </label>
                  <select
                    value={fromBranchId}
                    onChange={(e) => setFromBranchId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "إلى فرع (الوجهة)" : "To Branch"}
                  </label>
                  <select
                    value={toBranchId}
                    onChange={(e) => setToBranchId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "المنتج" : "Item"}
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
                    value={quantityRequested}
                    onChange={(e) => setQuantityRequested(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
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
                  placeholder="Transfer notes..."
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
                      ? "جارٍ الإرسال..."
                      : "Sending..."
                    : locale === "ar"
                    ? "إنشاء التحويل"
                    : "Create Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
