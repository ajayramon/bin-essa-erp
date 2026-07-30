"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { listCustomersRequest, type CustomerResponse } from "@/lib/api";

export default function B2BCustomerPortalPage() {
  const { t } = useLocale();

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listCustomersRequest();
        if (!cancelled) setCustomers(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load customers");
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

  const filteredCustomers = customers.filter((cust) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      cust.name.toLowerCase().includes(q) ||
      cust.code.toLowerCase().includes(q) ||
      (cust.phone ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Customers & B2B Portal</h1>
          <p className="mt-1 text-sm text-ink/60">
            Real client accounts and customer records stored in database.
          </p>
        </div>
        <Link
          href="/customers/new"
          className="whitespace-nowrap rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold hover:text-ink shadow"
        >
          + Add Customer
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by customer name, code, phone..."
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        />
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50 shadow-sm">
          Loading customer records...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wider text-ink/50">
                <th className="px-4 py-3 text-start font-medium">Customer Code</th>
                <th className="px-4 py-3 text-start font-medium">Customer Name</th>
                <th className="px-4 py-3 text-start font-medium">Phone</th>
                <th className="px-4 py-3 text-start font-medium">Email</th>
                <th className="px-4 py-3 text-start font-medium">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-ink/5">
                  <td className="numeric-ltr px-4 py-3 font-mono font-semibold text-ink/70">{cust.code}</td>
                  <td className="px-4 py-3 font-medium text-ink">{cust.name}</td>
                  <td className="numeric-ltr px-4 py-3 text-ink/60">{cust.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{cust.email || "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{cust.address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-ink/40">
              No customers found in database. Click "+ Add Customer" to add one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
