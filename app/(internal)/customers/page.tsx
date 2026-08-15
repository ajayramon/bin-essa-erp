"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Users, Phone, Mail, MapPin, Building2, Shield, CreditCard } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { listCustomersRequest, type CustomerRecord } from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function CustomersPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const data = await listCustomersRequest(branchId);
        if (!cancelled) {
          setCustomers(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load customers");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCustomers();
    return () => {
      cancelled = true;
    };
  }, [currentBranch, isHeadOffice]);

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust.phone && cust.phone.includes(searchTerm)) ||
      (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGroup =
      selectedGroup === "ALL" || (cust.customerGroup || "STANDARD") === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "إدارة العملاء" : "Customer Master"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "سجل العملاء، حدود الائتمان، وشروط السداد المرتبطة بالنظام المحاسبي."
              : "Manage customer accounts, credit limits, and payment terms linked to AR ledgers."}
          </p>
        </div>

        <Link
          href="/customers/new"
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "عميل جديد" : "New Customer"}
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي العملاء" : "Total Customers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{customers.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "عملاء الجملة" : "Wholesale Accounts"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {customers.filter((c) => c.customerGroup === "WHOLESALE").length}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي التسهيلات الائتمانية" : "Total Credit Facilities"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(
              customers.reduce((sum, c) => sum + Number(c.creditLimit || 0), 0)
            )}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder={
              locale === "ar"
                ? "بحث بالاسم، الكود، الهاتف، أو البريد الإلكتروني..."
                : "Search by name, code, phone, or email..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "STANDARD", "WHOLESALE", "VIP"].map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedGroup === grp
                  ? "bg-ink text-paper"
                  : "border border-ink/10 bg-white text-ink/70 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل سجل العملاء..." : "Loading customers from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "كود العميل" : "Customer Code"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "اسم العميل" : "Customer Name"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الفئة" : "Group"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "الاتصال" : "Contact"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "الحد الائتماني" : "Credit Limit"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "شروط السداد" : "Payment Terms"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد سجلات مطابقة" : "No matching customer records found."}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {cust.code}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{cust.name}</div>
                      {cust.address && (
                        <div className="flex items-center gap-1 text-xs text-ink/50">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{cust.address}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                          cust.customerGroup === "WHOLESALE"
                            ? "bg-blue-50 text-blue-700"
                            : cust.customerGroup === "VIP"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-ink/5 text-ink/70"
                        }`}
                      >
                        {cust.customerGroup || "STANDARD"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="h-3 w-3 text-ink/40" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                      {cust.email && (
                        <div className="flex items-center gap-1.5 text-ink/50">
                          <Mail className="h-3 w-3 text-ink/40" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-semibold text-ink">
                      {formatKD(Number(cust.creditLimit || 0))} KD
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">
                      {cust.paymentTerms || "NET_30"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
