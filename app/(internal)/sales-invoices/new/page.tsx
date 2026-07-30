"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listItemsRequest,
  createSalesInvoiceRequest,
  type ItemResponse,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

interface InvoiceLineState {
  itemId: string;
  quantity: number;
  unitPrice: number;
}

export default function NewSalesInvoicePage() {
  const { locale, t } = useLocale();
  const { user, currentBranch } = useSession();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER">("CASH");
  const [lines, setLines] = useState<InvoiceLineState[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listItemsRequest();
        if (!cancelled) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load products");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadItems();
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
        unitPrice: Number(unusedItem.price) || 0,
      },
    ]);
  }

  function updateLine(index: number, patch: Partial<InvoiceLineState>) {
    const updated = [...lines];
    const current = updated[index];
    const next = { ...current, ...patch };

    // If item changed, default unit price to that item's price
    if (patch.itemId && patch.itemId !== current.itemId) {
      const selected = items.find((i) => i.id === patch.itemId);
      if (selected) {
        next.unitPrice = Number(selected.price) || 0;
      }
    }

    updated[index] = next;
    setLines(updated);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (lines.length === 0) {
      setError("Please add at least one line item.");
      return;
    }

    const branchId = user?.branchId || currentBranch?.id || "cfbb7132-6c84-442b-86a5-3a4d03b5e089";
    const userId = user?.id || "0f4c78ce-14cc-4d67-86f8-a12ddfea3ef7";

    setIsSubmitting(true);
    try {
      const res = await createSalesInvoiceRequest({
        invoiceNumber,
        branchId,
        userId,
        paymentMethod,
        lines: lines.map((l) => ({
          itemId: l.itemId,
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
        })),
      });

      setSuccessMsg(`Sales Invoice ${res.invoiceNumber} posted successfully! Inventory stock decremented & GL posted.`);
      setLines([]);
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sales invoice");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading Sales Invoice page...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">New Sales Invoice</h1>
          <p className="mt-1 text-sm text-ink/60">
            Create a real sales invoice to record customer sale, decrement inventory, and post revenue to General Ledger.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Metadata */}
        <div className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Invoice Number
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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/70">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-gold"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card / K-Net</option>
              <option value="CREDIT">Credit / Account</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Invoice Line Items</h2>
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
              No items available in inventory. Please create items first.
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
                    <th className="px-3 py-3 text-start">Selling Price (KWD)</th>
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
                            {(selectedItem as any)?.stockQuantity ?? 0} {selectedItem?.unit || "pcs"}
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
                            value={line.unitPrice}
                            onChange={(e) => updateLine(idx, { unitPrice: Number(e.target.value) })}
                            className="numeric-ltr w-28 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none focus:border-gold"
                          />
                        </td>
                        <td className="numeric-ltr px-3 py-3 font-semibold text-ink">
                          {formatKD(line.quantity * line.unitPrice)} KD
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

        {/* Total & Submit */}
        <div className="flex flex-col items-end gap-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6 text-lg font-bold text-ink">
            <span>Total Sales Amount:</span>
            <span className="numeric-ltr text-xl text-gold">{formatKD(subtotal)} KWD</span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting || lines.length === 0}
              className="w-full rounded-xl bg-ink px-8 py-3 text-sm font-bold text-white shadow hover:bg-gold hover:text-ink disabled:opacity-40 sm:w-auto"
            >
              {isSubmitting ? "Posting Sales Invoice..." : "Post Sales Invoice & Decrement Stock"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
