"use client";

import { useEffect, useState } from "react";
import { Printer, X, FileText, Building2, User, Package, ShieldCheck } from "lucide-react";
import type { PurchaseOrderResponse } from "@/lib/api";
import { getPurchaseOrderRequest, getPurchaseInvoiceRequest } from "@/lib/api";

function formatKD(amount: number | string | undefined | null) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num === undefined || num === null || isNaN(num)) return "0.000";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

interface PurchaseInvoiceModalProps {
  poId: string | null;
  initialPoData?: PurchaseOrderResponse | null;
  onClose: () => void;
}

export function PurchaseInvoiceModal({ poId, initialPoData, onClose }: PurchaseInvoiceModalProps) {
  const [po, setPo] = useState<PurchaseOrderResponse | null>(initialPoData || null);
  const [isLoading, setIsLoading] = useState(!initialPoData && !!poId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPoData) {
      setPo(initialPoData);
      setIsLoading(false);
      return;
    }

    if (!poId) return;

    let cancelled = false;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPurchaseInvoiceRequest(poId!).catch(() =>
          getPurchaseOrderRequest(poId!)
        );
        if (!cancelled) {
          setPo(data as any);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load purchase invoice");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [poId, initialPoData]);

  if (!poId && !initialPoData) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = po ? Number(po.subtotal || 0) : 0;
  const taxAmount = po ? Number(po.taxAmount || 0) : 0;
  const totalAmount = po ? Number(po.totalAmount || 0) : subtotal + taxAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-slate-900 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">Purchase Tax Invoice / Vendor Bill</h2>
              <p className="text-xs text-slate-400">
                Official Document #{po?.poNumber || "..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isLoading || !po}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 print:overflow-visible print:p-0">
          {isLoading && (
            <div className="py-20 text-center text-sm font-medium text-slate-500">
              Loading Purchase Invoice details...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && po && (
            <div className="invoice-document space-y-8 bg-white text-slate-900 font-sans">
              
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-wider">
                    <Building2 className="h-7 w-7 text-amber-600" />
                    <span>BIN ESSA ERP</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
                    Purchasing & Inventory Management Division
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Kuwait City, State of Kuwait | CR: 1049283
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800 border border-emerald-300">
                    STATUS: {po.status || "POSTED"}
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                    PURCHASE INVOICE
                  </h1>
                  <p className="text-sm font-bold text-amber-600">
                    Ref: {po.poNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    Date: {new Date(po.createdAt || po.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Information Cards (Supplier & Branch) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <User className="h-4 w-4 text-amber-600" />
                    <span>Vendor / Supplier Details</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {po.supplier?.name || "Supplier ID: " + po.supplierId}
                  </div>
                  {po.supplier?.code && (
                    <div className="text-xs font-medium text-slate-600">
                      Supplier Code: <span className="font-mono">{po.supplier.code}</span>
                    </div>
                  )}
                  {po.supplier?.email && (
                    <div className="text-xs text-slate-600">
                      Email: {po.supplier.email}
                    </div>
                  )}
                  {po.supplier?.phone && (
                    <div className="text-xs text-slate-600">
                      Phone: {po.supplier.phone}
                    </div>
                  )}
                  {po.supplier?.address && (
                    <div className="text-xs text-slate-600">
                      Address: {po.supplier.address}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Building2 className="h-4 w-4 text-amber-600" />
                    <span>Receiving Branch</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {po.branch?.nameEn || "Main Branch / Head Office"}
                  </div>
                  <div className="text-xs text-slate-600">
                    Branch Code: <span className="font-mono">{po.branch?.code || po.branchId}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    City: {po.branch?.city || "Kuwait"}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-amber-400" />
                    <span>Purchased Line Items</span>
                  </span>
                  <span>{po.lines?.length || 0} Lines</span>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <th className="px-4 py-3 text-start">#</th>
                      <th className="px-4 py-3 text-start">Item & SKU</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-end">Unit Cost (KWD)</th>
                      <th className="px-4 py-3 text-end">Line Total (KWD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {po.lines && po.lines.length > 0 ? (
                      po.lines.map((line, idx) => (
                        <tr key={line.id || idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-xs text-slate-400 font-mono">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">
                              {line.item?.name || "Item #" + line.itemId}
                            </div>
                            {line.item?.sku && (
                              <div className="text-xs text-slate-500 font-mono">
                                SKU: {line.item.sku}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">
                            {Number(line.quantity)} {line.item?.unit || "pcs"}
                          </td>
                          <td className="numeric-ltr px-4 py-3 text-end font-semibold text-slate-700">
                            {formatKD(line.unitCost)} KD
                          </td>
                          <td className="numeric-ltr px-4 py-3 text-end font-bold text-slate-900">
                            {formatKD(line.lineTotal)} KD
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-sm text-slate-400">
                          No line items found on this invoice.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals & Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                <div className="w-full sm:w-1/2 space-y-4">
                  {/* General Ledger Auto-Post Confirmation */}
                  {po.journalEntry && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>GL Auto-Post Verification</span>
                      </div>
                      <p className="text-xs text-emerald-900 font-medium">
                        Journal Entry Reference: <span className="font-bold font-mono">{po.journalEntry.reference}</span>
                      </p>
                      <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-emerald-200">
                        <div className="flex justify-between">
                          <span>DEBIT [1200 - Inventory]:</span>
                          <span className="font-bold">{formatKD(po.totalAmount)} KD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CREDIT [2000 - Accounts Payable]:</span>
                          <span className="font-bold">{formatKD(po.totalAmount)} KD</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-1/2 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600 font-medium">
                    <span>Subtotal:</span>
                    <span className="numeric-ltr font-semibold text-slate-900">{formatKD(subtotal)} KWD</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 font-medium">
                    <span>Tax / VAT Amount:</span>
                    <span className="numeric-ltr font-semibold text-slate-900">{formatKD(taxAmount)} KWD</span>
                  </div>
                  <div className="border-t border-slate-300 pt-3 flex justify-between text-base font-black text-slate-900">
                    <span>Total Purchase Amount:</span>
                    <span className="numeric-ltr text-xl text-amber-600">{formatKD(totalAmount)} KWD</span>
                  </div>
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs text-slate-500 font-medium">
                <div>
                  <div className="h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <span>Prepared By</span>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <span>Inventory Inspector</span>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <span>Authorized Signature</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
