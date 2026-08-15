"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Receipt, Tag, Building2, CheckCircle2, DollarSign } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listExpensesRequest,
  createExpenseRequest,
  listExpenseCategoriesRequest,
  listCostCentersRequest,
  type ExpenseRecord,
  type ExpenseCategoryRecord,
  type CostCenterRecord,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function ExpensesPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryRecord[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenterRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [expenseNumber, setExpenseNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [costCenterId, setCostCenterId] = useState("");
  const [amount, setAmount] = useState<number>(85);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [expData, catData, ccData] = await Promise.all([
          listExpensesRequest(branchId),
          listExpenseCategoriesRequest(),
          listCostCentersRequest(),
        ]);
        if (!cancelled) {
          setExpenses(expData || []);
          setCategories(catData || []);
          setCostCenters(ccData || []);
          if (catData && catData.length > 0) {
            setCategoryId(catData[0].id);
          }
          if (ccData && ccData.length > 0) {
            setCostCenterId(ccData[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load expenses");
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
    setExpenseNumber(`EXP-${Date.now().toString().slice(-6)}`);
    setAmount(85);
    setPaymentMethod("CASH");
    setNotes("");
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    if (costCenters.length > 0) {
      setCostCenterId(costCenters[0].id);
    }
    setIsModalOpen(true);
  }

  async function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!currentBranch?.id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createExpenseRequest({
        expenseNumber,
        branchId: currentBranch.id,
        categoryId,
        costCenterId: costCenterId || undefined,
        amount,
        paymentMethod,
        notes,
      });
      setIsModalOpen(false);
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const updated = await listExpensesRequest(branchId);
      setExpenses(updated || []);
    } catch (err: any) {
      setError(err?.message || "Failed to record expense");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.category?.name && exp.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "المصروفات التشغيلية ومراكز التكلفة" : "Operating Expenses & Cost Allocation"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "تسجيل مصروفات الفروع والمقر الرئيسي وتوزيعها على مراكز التكلفة وترحيلها تلقائيًا للدفتر العام."
              : "Record operating expenses, allocate to cost centers, and automatically post balanced double-entry journals."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "تسجيل مصروف جديد" : "Record Expense"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي المصروفات" : "Total Expenses"}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{expenses.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "إجمالي المبلغ المصروف" : "Total Amount Spent"}
          </p>
          <p className="numeric-ltr mt-2 text-2xl font-bold text-red-600">
            {formatKD(expenses.reduce((s, e) => s + Number(e.amount || 0), 0))}{" "}
            <span className="text-sm font-normal text-ink/50">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            {locale === "ar" ? "القيد المحاسبي" : "GL Accounting Entry"}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            Dr 6000 Operating Expenses / Cr 1000 Cash
          </p>
          <p className="text-xs text-ink/40">Cost center allocation attached</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث برقم المصروف، الفئة، أو الملاحظات..."
              : "Search by expense #, category, or notes..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink/40 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </div>

      {/* Expenses Table */}
      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ تحميل المصروفات..." : "Loading expenses from database..."}
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
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "رقم السند" : "Expense #"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "فئة المصروف" : "Category"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "مركز التكلفة" : "Cost Center"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</th>
                <th className="px-5 py-3.5 text-end">{locale === "ar" ? "المبلغ" : "Amount"}</th>
                <th className="px-5 py-3.5 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink/40">
                    {locale === "ar" ? "لا توجد مصروفات مسجلة" : "No expenses found."}
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="transition-colors hover:bg-ink/[0.01]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                      {exp.expenseNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-ink">{exp.category?.name || "General"}</span>
                      {exp.notes && <div className="text-xs text-ink/50">{exp.notes}</div>}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/70">
                      {exp.costCenter?.name || "Branch General"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td className="numeric-ltr px-5 py-4 text-end font-bold text-red-600">
                      {formatKD(Number(exp.amount || 0))} KD
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/50">
                      {new Date(exp.date || exp.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-ink">
              {locale === "ar" ? "تسجيل مصروف تشغيلي جديد" : "Record Operating Expense"}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {locale === "ar"
                ? "سيتم ترحيل قيد المصروف وربطه بمركز التكلفة المحدد فورًا."
                : "Balanced double-entry journal will post automatically."}
            </p>

            <form onSubmit={handleCreateExpense} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70">
                  {locale === "ar" ? "رقم السند" : "Expense Voucher #"}
                </label>
                <input
                  type="text"
                  required
                  value={expenseNumber}
                  onChange={(e) => setExpenseNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 font-mono text-sm focus:border-ink/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "فئة المصروف" : "Category"}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink/70">
                    {locale === "ar" ? "مركز التكلفة" : "Cost Center"}
                  </label>
                  <select
                    value={costCenterId}
                    onChange={(e) => setCostCenterId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/10 p-2.5 text-sm focus:border-ink/30 focus:outline-none"
                  >
                    <option value="">(None / General)</option>
                    {costCenters.map((cc) => (
                      <option key={cc.id} value={cc.id}>
                        {cc.name} ({cc.type})
                      </option>
                    ))}
                  </select>
                </div>
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
                  {locale === "ar" ? "البيان والملاحظات" : "Description & Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Electricity bill, maintenance, consumables..."
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
                  {isSubmitting ? "Saving..." : "Record Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
