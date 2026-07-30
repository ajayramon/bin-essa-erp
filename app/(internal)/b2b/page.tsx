"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { customers } from "@/lib/mock-data/customers";
import type { Customer } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

type CustomerType = Customer["customerType"];

export default function B2BCustomerPortalPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<CustomerType | "all">("all");

  const brandCustomers = currentBrand
    ? customers.filter((c) => c.brandId === currentBrand.id)
    : [];

  const filteredCustomers = brandCustomers.filter((cust) => {
    if (typeFilter !== "all" && cust.customerType !== typeFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      cust.nameEn.toLowerCase().includes(q) ||
      cust.nameAr.includes(q)
    );
  });

  function typeLabel(type: CustomerType): string {
    if (type === "retail") return t.b2b.retail;
    if (type === "wholesale") return t.b2b.wholesale;
    return t.b2b.b2bPortal;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.b2b.title}</h1>
        <p className="mt-1 text-ink/60">{t.b2b.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.b2b.searchPlaceholder}
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as CustomerType | "all")}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold sm:w-64"
        >
          <option value="all">{t.b2b.allTypes}</option>
          <option value="retail">{t.b2b.retail}</option>
          <option value="wholesale">{t.b2b.wholesale}</option>
          <option value="b2b_portal">{t.b2b.b2bPortal}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.b2b.customerName}</th>
              <th className="px-4 py-3 text-start font-medium">{t.b2b.customerType}</th>
              <th className="px-4 py-3 text-start font-medium">{t.b2b.balance}</th>
              <th className="px-4 py-3 text-start font-medium">{t.b2b.creditLimit}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                <td className="px-4 py-3 font-medium text-ink">
                  {locale === "ar" ? cust.nameAr : cust.nameEn}
                </td>
                <td className="px-4 py-3 text-ink/70">{typeLabel(cust.customerType)}</td>
                <td className="numeric-ltr px-4 py-3 text-ink">{formatKD(cust.balanceKd)} KD</td>
                <td className="numeric-ltr px-4 py-3 text-ink/60">{formatKD(cust.creditLimitKd)} KD</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.b2b.noResults}</p>
        )}
      </div>
    </div>
  );
}
