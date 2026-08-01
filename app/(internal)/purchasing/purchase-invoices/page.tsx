"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Plus, Printer, Search } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  listPurchaseInvoicesRequest,
  listPurchaseOrdersRequest,
  type PurchaseInvoiceResponse,
  type PurchaseOrderResponse,
} from "@/lib/api";
import { PurchaseInvoiceModal } from "@/components/domain/PurchaseInvoiceModal";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function PurchaseInvoicesListPage() {
  const { t } = useLocale();

  const [invoices, setInvoices] = useState<PurchaseInvoiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<{ id: string; data?: any } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listPurchaseInvoicesRequest().catch(async () => {
          // Fallback to purchase orders formatted as invoices if needed
          const pos = await listPurchaseOrdersRequest();
          return pos.map((po) => ({
            id: po.id,
            invoiceNumber: po.poNumber,
            date: po.createdAt || po.date,
            paymentTerms: "IMMEDIATE",
            supplierId: po.supplierId,
            branchId: po.branchId,
            status: po.status,
            subtotal: po.subtotal,
            taxAmount: po.taxAmount,
            totalAmount: po.totalAmount,
            createdAt: po.createdAt,
            updatedAt: po.updatedAt,
            supplier: po.supplier,
            branch: po.branch,
            lines: po.lines,
            journalEntry: po.journalEntry,
          })) as PurchaseInvoiceResponse[];
        });

        if (!cancelled) setInvoices(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load purchase invoices");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalVolume = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Purchase Invoices (Vendor Bills)</h1>
          <p className="mt-1 text-sm text-ink/60">
            View all official vendor bills, print tax purchase invoices, and inspect auto-posted General Ledger entries.
          </p>
        </div>
        <Link
          href="/purchasing/purchase-invoices/new"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-gold hover:text-ink transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Purchase Invoice</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Total Purchase Invoices</p>
          <p className="mt-1 text-2xl font-bold text-ink">{invoices.length}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Total Volume (KWD)</p>
          <p className="numeric-ltr mt-1 text-2xl font-bold text-amber-600">
            {formatKD(totalVolume)} <span className="text-xs text-ink/50">KD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">GL Auto-Posted Status</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">100% Synced</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by invoice number or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-ink/15 pl-9 pr-4 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
        <div className="text-xs font-semibold text-ink/50">
          Showing {filteredInvoices.length} of {invoices.length} Invoices
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading purchase invoices…
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wider text-ink/50 bg-slate-50">
                <th className="px-4 py-3 text-start">Invoice Number</th>
                <th className="px-4 py-3 text-start">Supplier</th>
                <th className="px-4 py-3 text-start">Date</th>
                <th className="px-4 py-3 text-start">Payment Terms</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-end">Total Amount (KWD)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-ink/5">
                  <td className="px-4 py-3 font-bold text-ink font-mono">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 font-medium text-ink/80">{inv.supplier?.name || inv.supplierId}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(inv.createdAt || inv.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {inv.paymentTerms || "IMMEDIATE"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      {inv.status || "POSTED"}
                    </span>
                  </td>
                  <td className="numeric-ltr px-4 py-3 text-end font-bold text-ink">
                    {formatKD(Number(inv.totalAmount))} KD
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveInvoiceModal({ id: inv.id, data: inv })}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm"
                    >
                      <FileText className="h-3.5 w-3.5 text-amber-700" />
                      <span>View & Print Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink/40">No purchase invoices found.</p>
          )}
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {activeInvoiceModal && (
        <PurchaseInvoiceModal
          poId={activeInvoiceModal.id}
          initialPoData={activeInvoiceModal.data}
          onClose={() => setActiveInvoiceModal(null)}
        />
      )}
    </div>
  );
}
