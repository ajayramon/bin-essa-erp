"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Truck, CheckCircle2, PackageCheck, Send } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listDeliveryNotesRequest,
  createDeliveryNoteRequest,
  listCustomersRequest,
  listItemsRequest,
  type DeliveryNoteRecord,
  type CustomerRecord,
  type ItemRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function DeliveryNotesPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [deliveries, setDeliveries] = useState<DeliveryNoteRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [deliveryNumber, setDeliveryNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState<number>(20);
  const [unitPrice, setUnitPrice] = useState<number>(3.5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [dnData, cData, iData] = await Promise.all([
          listDeliveryNotesRequest(branchId),
          listCustomersRequest(branchId),
          listItemsRequest(branchId),
        ]);
        if (!cancelled) {
          setDeliveries(dnData || []);
          setCustomers(cData || []);
          setItems(iData || []);
          if (cData && cData.length > 0) {
            setCustomerId(cData[0].id);
          }
          if (iData && iData.length > 0) {
            setSelectedItemId(iData[0].id);
            setUnitPrice(Number(iData[0].wholesalePrice || iData[0].price || 0));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load delivery notes");
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
    setDeliveryNumber(`DN-${Date.now().toString().slice(-6)}`);
    setQuantity(20);
    setNotes("");
    if (customers.length > 0) {
      setCustomerId(customers[0].id);
    }
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
      setUnitPrice(Number(items[0].wholesalePrice || items[0].price || 0));
    }
    setIsModalOpen(true);
  }

  function handleItemChange(itemId: string) {
    setSelectedItemId(itemId);
    const itm = items.find((i) => i.id === itemId);
    if (itm) {
      setUnitPrice(Number(itm.wholesalePrice || itm.price || 0));
    }
  }

  async function handleCreateDN(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createDeliveryNoteRequest({
        deliveryNumber,
        customerId,
        branchId: currentBranch.id,
        notes,
        lines: [
          {
            itemId: selectedItemId,
            quantity,
            unitPrice,
          },
        ],
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listDeliveryNotesRequest(branchId);
      setDeliveries(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create delivery note");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredDeliveries = deliveries.filter(
    (dn) =>
      dn.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dn.customer?.name && dn.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dn.notes && dn.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "سندات التسليم والشحن (Delivery Notes)" : "Delivery Notes (DN)"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "صرف البضاعة من المستودع للعميل وتخفيض المخزون الفعلي آليًا مع تسجيل حركات الخروج."
              : "Warehouse stock dispatch: Automatically decrements branch on-hand stock and logs InventoryMovement ledger."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "سند تسليم جديد" : "New Delivery Note"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي سندات التسليم" : "Total Deliveries"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{deliveries.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "الأثر المباشر على المخزن" : "Inventory Ledger Impact"}
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-600">
            Automatic Stock Decrement
          </p>
          <p className="text-xs text-ink/40">Logged as SALE movement in ledger</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "حالة التسليم" : "Dispatch Status"}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">DELIVERED & DISPATCHED</p>
          <p className="text-xs text-ink/40">Ready for automated invoicing</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم السند، اسم العميل، أو الملاحظات..."
              : "Search by delivery #, customer, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Deliveries Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل سندات التسليم..." : "Loading delivery notes from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم السند" : "Delivery #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "العميل" : "Customer"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الملاحظات" : "Notes"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "تاريخ التسليم" : "Dispatched Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد سندات تسليم مسجلة" : "No delivery notes found."}
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((dn) => (
                  <tr key={dn.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {dn.deliveryNumber}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-ink">
                      {dn.customer?.name || "Customer"}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {dn.branch?.name || "Main Branch"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {dn.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">{dn.notes || "—"}</td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(dn.dispatchedAt || dn.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create DN Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "سند تسليم جديد (DN)" : "New Delivery Note"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم خصم الكميات من رصيد المستودع فور تأكيد التسليم."
                : "Branch inventory will decrement immediately upon dispatch."}
            </p>

            <form onSubmit={handleCreateDN} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم السند" : "Delivery Number"}
                </label>
                <input
                  type="text"
                  required
                  value={deliveryNumber}
                  onChange={(e) => setDeliveryNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "العميل" : "Customer"}
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المنتج المسلم" : "Item"}
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.sku}) - Available Stock: {i.stockQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "الكمية المسلمة" : "Quantity"}
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
                    {locale === "ar" ? "سعر الوحدة (KD)" : "Unit Price (KD)"}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
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
                  placeholder="Delivery details / driver..."
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
                    ? "تأكيد التسليم"
                    : "Confirm Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
