"use client";

import { useEffect, useState, useCallback } from "react";
import { Building2, Plus, Search, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { listBranchesRequest, type BranchRecord } from "@/lib/api";

export default function SettingsBranchesPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();
  const isAr = locale === "ar";

  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listBranchesRequest();
      setBranches(data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load branch configuration");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const brandBranches = currentBrand
    ? branches.filter((b) => {
        const brandStr = String(b.brandId || "").toLowerCase();
        const curStr = String(currentBrand.id || "").toLowerCase();
        return brandStr.includes(curStr) || curStr.includes(brandStr) || !b.brandId;
      })
    : branches;

  const filteredBranches = brandBranches.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name?.toLowerCase().includes(q) ||
      b.code?.toLowerCase().includes(q) ||
      (b.city && b.city.toLowerCase().includes(q)) ||
      (b.address && b.address.toLowerCase().includes(q))
    );
  });

  const brandName = currentBrand
    ? locale === "ar"
      ? currentBrand.nameAr
      : currentBrand.nameEn
    : isAr
    ? "جميع الفروع"
    : "All Enterprise Branches";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink">
              {isAr ? `إدارة الفروع والمواقع — ${brandName}` : `14-Branch Management — ${brandName}`}
            </h1>
            <span className="rounded-full bg-slate-900 text-[#FDCE0C] px-2.5 py-0.5 text-xs font-bold">
              {brandBranches.length} {isAr ? "فرع نشط" : "Locations"}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/60">
            {isAr
              ? "إدارة شبكة فروع مجموعة بن عيسى (14 فرعاً تشغيلياً + المستودع الرئيسي بالشويخ) مع العزل الصارم للمخزون والصناديق."
              : "Centralized configuration of Bin Essa's 14 retail counters & Shuwaikh central warehouse with strict branch boundaries."}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "إجمالي الفروع النشطة" : "Active Physical Locations"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-slate-900">{brandBranches.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "المستودع الرئيسي" : "Central Distribution Hub"}
          </p>
          <p className="mt-1 text-base font-bold text-slate-800">
            {isAr ? "مستودع الشويخ الرئيسي (HQ)" : "Shuwaikh Main Warehouse"}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "نظام الربط المركزي" : "Data Synchronization"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-base font-bold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            {isAr ? "قاعدة بيانات موحدة (Real-Time)" : "Single Central Database"}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-ink/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAr ? "بحث بكود الفرع، الاسم، المدينة، أو العنوان..." : "Search by branch code, name, city, or address..."}
          className="w-full rounded-xl border border-ink/10 bg-white ps-10 pe-4 py-2.5 text-xs shadow-2xs outline-none focus:border-amber-500"
        />
      </div>

      {/* Branches Table */}
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-2xs">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ink/10 bg-slate-50 text-slate-600">
              <th className="px-4 py-3 text-start font-bold">{isAr ? "كود الفرع" : "Branch Code"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "اسم الفرع" : "Branch Name"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "العلامة التجارية" : "Brand Entity"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "المدينة / المنطقة" : "City / Zone"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "العنوان" : "Address"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-semibold">
                  {isAr ? "جاري تحميل بيانات الفروع..." : "Loading branch records from database..."}
                </td>
              </tr>
            ) : filteredBranches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  <Building2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="font-bold">{isAr ? "لا توجد فروع مطابقة" : "No matching branch records found"}</p>
                </td>
              </tr>
            ) : (
              filteredBranches.map((branch) => (
                <tr key={branch.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{branch.code}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {locale === "ar" ? branch.nameAr || branch.name : branch.nameEn || branch.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                      {branch.brandId ? String(branch.brandId).replace(/_/g, " ") : "Bin Essa Group"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{branch.city || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{branch.address || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      {isAr ? "تشغيلي نشط" : "Operational"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
