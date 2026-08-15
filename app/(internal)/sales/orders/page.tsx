"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ShoppingCart, CheckCircle2, Clock, PackageCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listSalesOrdersRequest,
  createSalesOrderRequest,
  listCustomersRequest,
  listItemsRequest,
  type SalesOrderRecord,
  type CustomerRecord,
  type ItemRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function SalesOrdersPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [orders, setOrders] = useState<SalesOrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [orderNumber, setOrderNumber] = useState("");
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
        const [soData, cData, iData] = await Promise.all([
          listSalesOrdersRequest(branchId),
          listCustomersRequest(branchId),
          listItemsRequest(branchId),
        ]);
        if (!cancelled) {
          setOrders(soData || []);
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
          setError(err instanceof Error ? err.message : "Failed to load sales orders");
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
    setOrderNumber(`SO-${Date.now().toString().slice(-6)}`);
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

  async function handleCreateSO(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createSalesOrderRequest({
        orderNumber,
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
      const updated = await listSalesOrdersRequest(branchId);
      setOrders(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create sales order");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredOrders = orders.filter(
    (so) =>
      so.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (so.customer?.name && so.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (so.notes && so.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "أوامر البيع (Sales Orders)" : "Sales Orders (SO)"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "تأكيد حجوزات مبيعات الجملة والتجزئة وتجهيزها للشحن وإصدار الفواتير."
              : "Confirmed customer purchase orders ready for warehouse fulfillment and delivery dispatch."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "أمر بيع جديد" : "New Sales Order"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي أوامر البيع" : "Total Sales Orders"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{orders.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "قيمة الطلبات المؤكدة" : "Total Confirmed Value"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "المرحلة التالية" : "Next Workflow Step"}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            Delivery Note ➔ Sales Invoice
          </p>
          <p className="text-xs text-ink/40">Inventory dispatched upon delivery</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم الأمر، اسم العميل، أو الملاحظات..."
              : "Search by order #, customer, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Orders Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل أوامر البيع..." : "Loading sales orders from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم الأمر" : "Order #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "العميل" : "Customer"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفرع" : "Branch"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "الإجمالي" : "Total Amount"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد أوامر بيع مسجلة" : "No sales orders found."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((so) => (
                  <tr key={so.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {so.orderNumber}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-ink">
                      {so.customer?.name || "Customer"}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {so.branch?.name || "Main Branch"}
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-bold text-ink">
                      {formatKD(Number(so.totalAmount || 0))} KD
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {so.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(so.date || so.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create SO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "أمر بيع جديد" : "New Sales Order"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "تأكيد طلب العميل وتجهيز بضاعة الشحن."
                : "Create a confirmed sales order against customer account."}
            </p>

            <form onSubmit={handleCreateSO} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم الأمر" : "Order Number"}
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
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
                      {c.name} ({c.code}) - {c.customerGroup || "STANDARD"}
                    </option>
                  ))}
                </select>
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
                      {i.name} ({i.sku}) - Retail: {Number(i.price).toFixed(3)} KD
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "الكمية" : "Quantity"}
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
                    min="0.001"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">Total Order Amount:</span>
                  <span className="numeric-ltr font-bold text-ink">
                    {formatKD(quantity * unitPrice)} KD
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
                  placeholder="Order instructions..."
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
                    ? "تأكيد الأمر"
                    : "Confirm Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
