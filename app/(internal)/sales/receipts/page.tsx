"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Receipt, CheckCircle2, DollarSign, Users } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listReceiptVouchersRequest,
  createReceiptVoucherRequest,
  listCustomersRequest,
  type ReceiptVoucherRecord,
  type CustomerRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function CustomerReceiptsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [receipts, setReceipts] = useState<ReceiptVoucherRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [voucherNumber, setVoucherNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState<number>(50);
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
        const [rvData, custData] = await Promise.all([
          listReceiptVouchersRequest(branchId),
          listCustomersRequest(branchId),
        ]);
        if (!cancelled) {
          setReceipts(rvData || []);
          setCustomers(custData || []);
          if (custData && custData.length > 0) {
            setCustomerId(custData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load receipt vouchers");
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
    setVoucherNumber(`RV-${Date.now().toString().slice(-6)}`);
    setAmount(50);
    setPaymentMethod("CASH");
    setReference("");
    setNotes("");
    if (customers.length > 0) {
      setCustomerId(customers[0].id);
    }
    setIsModalOpen(true);
  }

  async function handleCreateReceipt(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createReceiptVoucherRequest({
        voucherNumber,
        customerId,
        branchId: currentBranch.id,
        amount,
        paymentMethod,
        reference,
        notes,
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listReceiptVouchersRequest(branchId);
      setReceipts(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to create receipt voucher");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredReceipts = receipts.filter(
    (rv) =>
      rv.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rv.customer?.name && rv.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rv.notes && rv.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "سندات قبض العملاء (Receipt Vouchers)" : "Customer Receipt Vouchers"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "تحصيل المبيعات الآجلة، تخفيض الذمم المدينة (AR)، وترحيل قيود الخزينة والبنك آليًا."
              : "Settle Accounts Receivable (AR) from customer collections with automated double-entry GL (Dr 1000 Cash or 1010 Bank / Cr 1100 AR)."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "سند قبض جديد" : "New Receipt Voucher"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي سندات القبض" : "Total Receipts"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{receipts.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي المبالغ المحصلة" : "Total AR Collections"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
            {formatKD(receipts.reduce((s, r) => s + Number(r.amount || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "القيد المحاسبي المزدوج" : "GL Accounting Entry"}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">Dr 1000 Cash / Bank / Cr 1100 AR</p>
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
              ? "بحث برقم السند، اسم العميل، أو الملاحظات..."
              : "Search by voucher #, customer, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Receipts Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل سندات القبض..." : "Loading receipt vouchers from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "العميل" : "Customer"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "المبلغ المقبوض" : "Amount Received"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "المرجع" : "Reference"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد سندات قبض مسجلة" : "No customer receipt vouchers found."}
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((rv) => (
                  <tr key={rv.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {rv.voucherNumber}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-ink">
                      {rv.customer?.name || "Customer"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
                        {rv.paymentMethod}
                      </span>
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-bold text-emerald-700">
                      {formatKD(Number(rv.amount || 0))} KD
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">{rv.reference || "—"}</td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(rv.date || rv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create RV Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "سند قبض عميل جديد" : "New Customer Receipt Voucher"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم تخفيض رصيد مديونية العميل وترحيل قيد المقبوضات فورًا."
                : "Customer Accounts Receivable will reduce immediately with balancing GL."}
            </p>

            <form onSubmit={handleCreateReceipt} className="mt-4 space-y-4">
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
                  {locale === "ar" ? "العميل" : "Customer"}
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) - {c.customerGroup || "STANDARD"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "المبلغ المحصل (KD)" : "Amount Received (KD)"}
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
                  {locale === "ar" ? "رقم المرجع / الإيصال" : "Reference / Transaction ID"}
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. KNET Ref / Cheque #"
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
                  placeholder="Collection against invoice..."
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
                    ? "تأكيد القبض"
                    : "Confirm Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
