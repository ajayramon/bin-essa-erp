"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, UserPlus, Users } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { createCustomerRequest } from "@/lib/api";

export default function NewCustomerPage() {
  const router = useRouter();
  const { locale, dir } = useLocale();
  const isAr = locale === "ar";

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [customerGroup, setCustomerGroup] = useState("RETAIL");
  const [creditLimit, setCreditLimit] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!code.trim() || !name.trim()) {
      setError(isAr ? "رمز واسم العميل مطلوبان" : "Customer Code and Name are required.");
      return;
    }

    setSubmitting(true);
    try {
      await createCustomerRequest({
        code: code.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        customerGroup,
        creditLimit: Number(creditLimit) || 0,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/customers");
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create customer record");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-slate-900" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            <span>{isAr ? "إضافة عميل جديد" : "Add New Customer"}</span>
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            {isAr
              ? "تسجيل بيانات العميل، التصنيف، وحد الائتمان المرتبط بسجل الذمم المدينة (AR)"
              : "Register customer master record, account group, and credit limit linked to Accounts Receivable."}
          </p>
        </div>

        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isAr ? "العودة للعملاء" : "Back to Customers"}</span>
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-xs font-bold text-red-800 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{isAr ? "تم حفظ بيانات العميل بنجاح! جاري التحويل..." : "Customer created successfully! Redirecting..."}</span>
        </div>
      )}

      {/* Customer Form */}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs text-xs text-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isAr ? "رمز العميل (Customer Code) *" : "Customer Code *"}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CUST-00101"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isAr ? "اسم العميل / الشركة *" : "Customer / Company Name *"}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trolley Group / Bodega Mart"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isAr ? "رقم الهاتف" : "Phone Number"}
            </label>
            <input
              type="text"
              placeholder="+965 xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isAr ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              placeholder="contact@customer.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isAr ? "تصنيف العميل" : "Customer Group"}
            </label>
            <select
              value={customerGroup}
              onChange={(e) => setCustomerGroup(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="RETAIL" className="text-slate-900 bg-white">Retail Customer</option>
              <option value="WHOLESALE" className="text-slate-900 bg-white">Wholesale Account</option>
              <option value="KEY_ACCOUNT" className="text-slate-900 bg-white">Key Commercial Account</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {isAr ? "الحد الائتماني (د.ك)" : "Credit Limit (KD)"}
            </label>
            <input
              type="number"
              step="0.001"
              min={0}
              placeholder="0.000"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            {isAr ? "العنوان والموقع" : "Physical Address / Delivery Location"}
          </label>
          <textarea
            rows={3}
            placeholder="Kuwait, Shuwaikh Industrial..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Link
            href="/customers"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-black text-[#FDCE0C] px-6 py-2.5 text-xs font-bold shadow-md hover:bg-slate-900 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>{submitting ? (isAr ? "جاري الحفظ..." : "Saving Customer...") : (isAr ? "حفظ بيانات العميل" : "Save Customer Record")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
