"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Truck, CheckCircle2, PackageCheck, FileSpreadsheet } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listGoodsReceiptsRequest,
  createGoodsReceiptRequest,
  listSuppliersRequest,
  listItemsRequest,
  type GoodsReceiptRecord,
  type SupplierRecord,
  type ItemRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function GoodsReceiptsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [receipts, setReceipts] = useState<GoodsReceiptRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [grnNumber, setGrnNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantityReceived, setQuantityReceived] = useState<number>(50);
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
        const [grnData, suppData, itemsData] = await Promise.all([
          listGoodsReceiptsRequest(branchId),
          listSuppliersRequest(branchId),
          listItemsRequest(branchId),
        ]);
        if (!cancelled) {
          setReceipts(grnData || []);
          setSuppliers(suppData || []);
          setItems(itemsData || []);
          if (suppData && suppData.length > 0) {
            setSupplierId(suppData[0].id);
          }
          if (itemsData && itemsData.length > 0) {
            setSelectedItemId(itemsData[0].id);
            setUnitCost(Number(itemsData[0].cost || 0));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load goods receipts");
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
    setGrnNumber(`GRN-${Date.now().toString().slice(-6)}`);
    setQuantityReceived(50);
    setNotes("");
    if (suppliers.length > 0) {
      setSupplierId(suppliers[0].id);
    }
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

  async function handleCreateGRN(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createGoodsReceiptRequest({
        grnNumber,
        supplierId,
        branchId: currentBranch.id,
        notes,
        lines: [
          {
            itemId: selectedItemId,
            quantityReceived,
            unitCost,
          },
        ],
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listGoodsReceiptsRequest(branchId);
      setReceipts(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create goods receipt");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredReceipts = receipts.filter(
    (grn) =>
      grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grn.notes && grn.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "سندات استلام البضاعة (GRN)" : "Goods Receipt Notes (GRN)"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "استلام البضائع الفعلي، زيادة أرصدة المخزون، وتسجيل حركات الشراء في الدفاتر."
              : "Warehouse physical receipt: automatically increases on-hand inventory balances and logs purchase stock ledger movements."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "سند استلام جديد" : "New Goods Receipt"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي سندات الاستلام" : "Total Receipts (GRN)"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{receipts.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "الأثر على المخزون" : "Inventory Impact"}
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-600">
            {locale === "ar" ? "زيادة فورية للرصيد الفعلي" : "Instant On-Hand Stock Increment"}
          </p>
          <p className="text-xs text-ink/40">Logged into InventoryMovement ledger</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "الموردين النشطين" : "Active Suppliers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{suppliers.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم السند، الملاحظات..."
              : "Search by GRN # or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Receipts Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل سندات الاستلام..." : "Loading goods receipts from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم السند" : "GRN #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "المورد" : "Supplier"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الملاحظات" : "Notes"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "تاريخ الاستلام" : "Received Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد سندات استلام مسجلة" : "No goods receipts found."}
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((grn) => (
                  <tr key={grn.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {grn.grnNumber}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-ink">
                      {grn.supplier?.name || "Supplier"}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {grn.branch?.name || "Main Branch"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {grn.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">{grn.notes || "—"}</td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(grn.receivedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create GRN Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "سند استلام بضاعة جديد (GRN)" : "New Goods Receipt Note"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم زيادة الرصيد الفعلي للمخزون فور تأكيد الاستلام."
                : "Inventory balance will increase immediately upon receipt confirmation."}
            </p>

            <form onSubmit={handleCreateGRN} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم السند" : "GRN Number"}
                </label>
                <input
                  type="text"
                  required
                  value={grnNumber}
                  onChange={(e) => setGrnNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المورد" : "Supplier"}
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المنتج المستلم" : "Item Received"}
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
                    {locale === "ar" ? "الكمية المستلمة" : "Quantity Received"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantityReceived}
                    onChange={(e) => setQuantityReceived(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "تكلفة الوحدة (KD)" : "Unit Cost (KD)"}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">Total Cost of Receipt:</span>
                  <span className="numeric-ltr font-bold text-ink">
                    {formatKD(quantityReceived * unitCost)} KD
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
                  placeholder="Receipt notes / batch info..."
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
                    ? "تأكيد الاستلام"
                    : "Confirm Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
