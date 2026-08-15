"use client";

import { useEffect, useState } from "react";
import { Plus, Search, CreditCard, CheckCircle2, DollarSign, Building2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listPaymentVouchersRequest,
  createPaymentVoucherRequest,
  listSuppliersRequest,
  type PaymentVoucherRecord,
  type SupplierRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function SupplierPaymentsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [payments, setPayments] = useState<PaymentVoucherRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [voucherNumber, setVoucherNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [amount, setAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [pvData, suppData] = await Promise.all([
          listPaymentVouchersRequest(branchId),
          listSuppliersRequest(branchId),
        ]);
        if (!cancelled) {
          setPayments(pvData || []);
          setSuppliers(suppData || []);
          if (suppData && suppData.length > 0) {
            setSupplierId(suppData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load payment vouchers");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [currentBranch, isHeadOffice]);

  function handleOpenCreateModal() {
    setVoucherNumber(`PV-${Date.now().toString().slice(-6)}`);
    setAmount(100);
    setPaymentMethod("CASH");
    setReference("");
    setNotes("");
    if (suppliers.length > 0) {
      setSupplierId(suppliers[0].id);
    }
    setIsModalOpen(true);
  }

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createPaymentVoucherRequest({
        voucherNumber,
        supplierId,
        branchId: currentBranch.id,
        amount,
        paymentMethod,
        reference,
        notes,
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listPaymentVouchersRequest(branchId);
      setPayments(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create payment voucher");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredPayments = payments.filter(
    (pv) =>
      pv.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pv.supplier?.name && pv.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pv.notes && pv.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "سندات صرف الموردين (Payment Vouchers)" : "Supplier Payment Vouchers"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "سداد مستحقات الموردين وتخفيض الذمم الدائنة (AP) آليًا مع ترحيل قيود الخزينة/البنك."
              : "Settle Accounts Payable (AP) with automated double-entry GL journal posting (Dr 2000 AP / Cr 1000 Cash or 1010 Bank)."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "سند صرف جديد" : "New Payment Voucher"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي السندات" : "Total Payment Vouchers"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{payments.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي المدفوعات للموردين" : "Total AP Settle Amount"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
            {formatKD(payments.reduce((s, p) => s + Number(p.amount || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "القيد المحاسبي المزدوج" : "GL Accounting Entry"}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">Dr 2000 AP / Cr 1000 Cash / Bank</p>
          <p className="text-xs text-ink/40">Total Debits === Total Credits</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم السند، اسم المورد، أو الملاحظات..."
              : "Search by voucher #, supplier, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Payments Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل سندات الصرف..." : "Loading payment vouchers from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم السند" : "Voucher #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "المورد" : "Supplier"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "المبلغ المصروف" : "Amount Paid"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "المرجع" : "Reference"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد سندات صرف مسجلة" : "No supplier payment vouchers found."}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pv) => (
                  <tr key={pv.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {pv.voucherNumber}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-ink">
                      {pv.supplier?.name || "Supplier"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
                        {pv.paymentMethod}
                      </span>
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-bold text-ink">
                      {formatKD(Number(pv.amount || 0))} KD
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">{pv.reference || "—"}</td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(pv.date || pv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create PV Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "سند صرف مورد جديد" : "New Supplier Payment Voucher"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم تخفيض رصيد المورد الدائن وترحيل القيد للدفتر العام."
                : "Accounts Payable balance will reduce with automated balanced double-entry GL."}
            </p>

            <form onSubmit={handleCreatePayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم السند" : "Voucher Number"}
                </label>
                <input
                  type="text"
                  required
                  value={voucherNumber}
                  onChange={(e) => setVoucherNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "المورد" : "Supplier"}
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "المبلغ (KD)" : "Amount (KD)"}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm font-semibold focus:border-ink/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    <option value="CASH">CASH (نقدي)</option>
                    <option value="CARD">CARD / KNET (بطاقة / كي نت)</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER (تحويل بنكي)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم الشيك / المرجع" : "Cheque / Reference Number"}
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Cheque # / Transfer Ref"
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "الملاحظات" : "Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Settlement of vendor bill..."
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting
                    ? locale === "ar"
                      ? "جارٍ الحفظ..."
                      : "Saving..."
                    : locale === "ar"
                    ? "تأكيد الصرف"
                    : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
