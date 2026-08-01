"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Printer, ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  listSuppliersRequest,
  createPurchaseInvoiceRequest,
  createSupplierRequest,
  type ItemResponse,
  type SupplierResponse,
  type PurchaseInvoiceResponse,
} from "@/lib/api";
import { PurchaseInvoiceModal } from "@/components/domain/PurchaseInvoiceModal";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

interface InvoiceLineState {
  itemId: string;
  quantity: number;
  unitCost: number;
}

export default function NewPurchaseInvoicePage() {
  const { locale } = useLocale();
  const { user, currentBranch } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<PurchaseInvoiceResponse | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Form fields
  const [invoiceNumber, setInvoiceNumber] = useState(`PINV-${Date.now().toString().slice(-6)}`);
  const [supplierId, setSupplierId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("IMMEDIATE");
  const [lines, setLines] = useState<InvoiceLineState[]>([]);

  // Inline supplier modal state
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierCode, setNewSupplierCode] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [itemsData, suppliersData] = await Promise.all([
          listItemsRequest(),
          listSuppliersRequest().catch(() => []),
        ]);

        if (!cancelled) {
          setItems(itemsData);
          setSuppliers(suppliersData);
          if (suppliersData.length > 0) {
            setSupplierId(suppliersData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load page data");
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

  function addLine() {
    if (items.length === 0) return;
    const unusedItem = items.find((i) => !lines.some((l) => l.itemId === i.id)) || items[0];
    setLines([
      ...lines,
      {
        itemId: unusedItem.id,
        quantity: 1,
        unitCost: Number(unusedItem.cost) || 0,
      },
    ]);
  }

  function updateLine(index: number, patch: Partial<InvoiceLineState>) {
    const updated = [...lines];
    const current = updated[index];
    const next = { ...current, ...patch };

    if (patch.itemId && patch.itemId !== current.itemId) {
      const selected = items.find((i) => i.id === patch.itemId);
      if (selected) {
        next.unitCost = Number(selected.cost) || 0;
      }
    }

    updated[index] = next;
    setLines(updated);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  async function handleCreateSupplier(e: React.FormEvent) {
    e.preventDefault();
    if (!newSupplierName.trim()) return;

    try {
      const created = await createSupplierRequest({
        code: newSupplierCode.trim() || `SUP-${Date.now().toString().slice(-4)}`,
        name: newSupplierName.trim(),
      });
      setSuppliers([...suppliers, created]);
      setSupplierId(created.id);
      setShowAddSupplier(false);
      setNewSupplierName("");
      setNewSupplierCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create supplier");
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitCost, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setCreatedInvoice(null);

    if (!supplierId) {
      setError("Please select or add a supplier.");
      return;
    }
    if (lines.length === 0) {
      setError("Please add at least one line item.");
      return;
    }

    const branchId = user?.branchId || currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";

    setIsSubmitting(true);
    try {
      const res = await createPurchaseInvoiceRequest({
        invoiceNumber,
        supplierId,
        branchId,
        paymentTerms,
        lines: lines.map((l) => ({
          itemId: l.itemId,
          quantity: Number(l.quantity),
          unitCost: Number(l.unitCost),
        })),
      });

      setCreatedInvoice(res);
      setSuccessMsg(`Purchase Invoice ${res.invoiceNumber} posted successfully! Inventory stock incremented & GL entry created.`);
      setLines([]);
      setInvoiceNumber(`PINV-${Date.now().toString().slice(-6)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create purchase invoice");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading Purchase Invoice form...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">New Purchase Invoice (Vendor Bill)</h1>
          <p className="mt-1 text-sm text-ink/60">
            Record an official vendor invoice to receive stock into inventory and auto-post to Accounts Payable & General Ledger.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/purchasing/purchase-invoices")}
          className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-ink/5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>View All Purchase Invoices</span>
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
          <div>{successMsg}</div>
          {createdInvoice && (
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 transition-colors shrink-0"
            >
              <FileText className="h-4 w-4" />
              <span>View & Print Purchase Invoice</span>
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Metadata */}
        <div className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Invoice / Vendor Bill #
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
              className="w-full rounded-xl border border-ink/15 bg-ink/5 px-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-gold focus:bg-white"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Supplier / Vendor
              </label>
              <button
                type="button"
                onClick={() => setShowAddSupplier(!showAddSupplier)}
                className="text-xs font-semibold text-gold hover:underline"
              >
                + New Supplier
              </button>
            </div>

            {showAddSupplier ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  className="flex-1 rounded-xl border border-ink/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <button
                  type="button"
                  onClick={handleCreateSupplier}
                  className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white hover:bg-gold hover:text-ink"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="rounded-xl border border-ink/20 px-3 py-2 text-xs font-medium text-ink"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-gold"
              >
                {suppliers.length === 0 && <option value="">No suppliers found — add one</option>}
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-gold"
            >
              <option value="IMMEDIATE">Immediate / Cash</option>
              <option value="NET 15">Net 15 Days</option>
              <option value="NET 30">Net 30 Days</option>
              <option value="NET 60">Net 60 Days</option>
              <option value="CREDIT">Credit / On Account</option>
            </select>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Purchase Line Items</h2>
            <button
              type="button"
              onClick={addLine}
              disabled={items.length === 0}
              className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-gold hover:text-ink disabled:opacity-40"
            >
              + Add Item Line
            </button>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink/50">
              No products exist in inventory. Please add items in Inventory first.
            </div>
          ) : lines.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink/40">
              No items added. Click "+ Add Item Line" to add products to this invoice.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    <th className="px-3 py-3 text-start">Product</th>
                    <th className="px-3 py-3 text-start">Current Stock</th>
                    <th className="px-3 py-3 text-start">Quantity</th>
                    <th className="px-3 py-3 text-start">Unit Cost (KWD)</th>
                    <th className="px-3 py-3 text-start">Line Total (KWD)</th>
                    <th className="px-3 py-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {lines.map((line, idx) => {
                    const selectedItem = items.find((i) => i.id === line.itemId);
                    return (
                      <tr key={idx}>
                        <td className="px-3 py-3">
                          <select
                            value={line.itemId}
                            onChange={(e) => updateLine(idx, { itemId: e.target.value })}
                            className="w-full min-w-[200px] rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-gold"
                          >
                            {items.map((it) => (
                              <option key={it.id} value={it.id}>
                                {it.name} (SKU: {it.sku})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3 font-semibold text-ink/70">
                          <span className="inline-flex rounded-md bg-ink/5 px-2 py-1 text-xs">
                            {selectedItem?.stockQuantity ?? 0} {selectedItem?.unit || "pcs"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={line.quantity}
                            onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })}
                            className="numeric-ltr w-24 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none focus:border-gold"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min={0}
                            step={0.001}
                            value={line.unitCost}
                            onChange={(e) => updateLine(idx, { unitCost: Number(e.target.value) })}
                            className="numeric-ltr w-28 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none focus:border-gold"
                          />
                        </td>
                        <td className="numeric-ltr px-3 py-3 font-semibold text-ink">
                          {formatKD(line.quantity * line.unitCost)} KD
                        </td>
                        <td className="px-3 py-3 text-end">
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary & Submit */}
        <div className="flex flex-col items-end gap-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6 text-lg font-bold text-ink">
            <span>Total Purchase Amount:</span>
            <span className="numeric-ltr text-xl text-amber-600">{formatKD(subtotal)} KWD</span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting || lines.length === 0 || !supplierId}
              className="w-full rounded-xl bg-ink px-8 py-3 text-sm font-bold text-white shadow hover:bg-gold hover:text-ink disabled:opacity-40 sm:w-auto"
            >
              {isSubmitting ? "Posting Purchase Invoice..." : "Post Purchase Invoice & Post to GL"}
            </button>
          </div>
        </div>
      </form>

      {/* Invoice Viewer Modal */}
      {showInvoiceModal && createdInvoice && (
        <PurchaseInvoiceModal
          poId={createdInvoice.id}
          initialPoData={createdInvoice as any}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
