"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { listSalesInvoicesRequest, type SalesInvoiceResponse } from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export default function SalesInvoicesListPage() {
  const { t } = useLocale();
  const { user } = useSession();

  const [invoices, setInvoices] = useState<SalesInvoiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listSalesInvoicesRequest();
        if (!cancelled) setInvoices(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load sales invoices");
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

  // Cashier role boundary: Cashiers view invoices strictly within their assigned branch
  const filteredInvoices = invoices.filter((inv) => {
    if (user?.role === "cashier" && user.branchId) {
      return inv.branchId === user.branchId;
    }
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Sales Invoices</h1>
          <p className="mt-1 text-sm text-ink/60">
            View all posted sales invoices, customer receipts, and auto-posted General Ledger entries.
          </p>
        </div>
        <Link
          href="/sales-invoices/new"
          className="whitespace-nowrap rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold hover:text-ink"
        >
          + New Sales Invoice
        </Link>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading sales invoices…
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
              <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wider text-ink/50">
                <th className="px-4 py-3 text-start">Invoice Number</th>
                <th className="px-4 py-3 text-start">Payment Method</th>
                <th className="px-4 py-3 text-start">Date</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-end">Total Amount (KWD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-ink/5">
                  <td className="px-4 py-3 font-semibold text-ink">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-ink/70">{inv.paymentMethod}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                  <td className="numeric-ltr px-4 py-3 text-end font-bold text-ink">
                    {formatKD(Number(inv.totalAmount))} KD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink/40">No sales invoices found.</p>
          )}
        </div>
      )}
    </div>
  );
}
