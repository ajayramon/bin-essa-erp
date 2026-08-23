"use client";

import { useEffect, useState, useCallback } from "react";
import { Calculator, Play, CheckCircle2, DollarSign, Calendar, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listPayrollPeriodsRequest,
  generatePayrollPeriodRequest,
  listBranchesRequest,
  type PayrollPeriodRecord,
  type BranchRecord,
} from "@/lib/api";

function formatKD(amount: number | string | undefined) {
  const num = Number(amount) || 0;
  return num.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function PayrollPage() {
  const { locale, t } = useLocale();
  const { currentBrand, currentBranch, isHeadOffice } = useSession();
  const isAr = locale === "ar";

  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriodRecord[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Run Payroll Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [targetBranchId, setTargetBranchId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [periods, brData] = await Promise.all([
        listPayrollPeriodsRequest(),
        listBranchesRequest(),
      ]);
      setPayrollPeriods(periods || []);
      setBranches(brData || []);
      if (periods && periods.length > 0 && !selectedPeriodId) {
        setSelectedPeriodId(periods[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load payroll batches");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriodId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activePeriod = payrollPeriods.find((p) => p.id === selectedPeriodId) || payrollPeriods[0];

  async function handleRunPayroll(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    try {
      const generated = await generatePayrollPeriodRequest({
        year: Number(year),
        month: Number(month),
        branchId: targetBranchId || undefined,
      });
      setIsModalOpen(false);
      await loadData();
      if (generated?.id) {
        setSelectedPeriodId(generated.id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to generate payroll batch");
    } finally {
      setIsProcessing(false);
    }
  }

  const slips = activePeriod?.slips || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink">
              {isAr ? "مسير الرواتب ومستحقات الكادر" : "Payroll & Wage Processing"}
            </h1>
            <span className="rounded-full bg-slate-900 text-[#FDCE0C] px-2.5 py-0.5 text-xs font-bold">
              {isAr ? "ترحيل محاسبي آلي" : "Auto-GL Posted"}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/60">
            {isAr
              ? "معالجة مسير الرواتب الشهري، احتساب البدلات والاستقطاعات، مع الترحيل التلقائي لقيود المصروفات المحاسبية."
              : "Generate monthly wage disbursements, compute allowances & deductions, and auto-post salary expense GL journal entries."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setYear(new Date().getFullYear());
            setMonth(new Date().getMonth() + 1);
            setTargetBranchId(currentBranch?.id || "");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-[#FDCE0C] shadow-sm hover:bg-slate-800 transition"
        >
          <Play className="h-4 w-4" />
          <span>{isAr ? "+ معالجة مسير رواتب جديد" : "+ Run Payroll Batch"}</span>
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Period Selection & Summary Cards */}
      {payrollPeriods.length > 0 ? (
        <>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700">
              {isAr ? "اختر مسير الشهر:" : "Select Payroll Period:"}
            </label>
            <select
              value={activePeriod?.id || ""}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="rounded-xl border border-ink/10 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-2xs outline-none focus:border-amber-500"
            >
              {payrollPeriods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.year} - {String(p.month).padStart(2, "0")} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isAr ? "الرواتب الأساسية" : "Total Basic Salaries"}
              </p>
              <p className="numeric-ltr mt-1 text-2xl font-black text-slate-900">
                {formatKD(activePeriod?.totalGross)} <span className="text-xs font-semibold text-slate-500">KD</span>
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isAr ? "إجمالي البدلات" : "Total Allowances"}
              </p>
              <p className="numeric-ltr mt-1 text-2xl font-black text-slate-700">
                {formatKD(activePeriod?.totalAllowances)} <span className="text-xs font-semibold text-slate-500">KD</span>
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isAr ? "الاستقطاعات" : "Total Deductions"}
              </p>
              <p className="numeric-ltr mt-1 text-2xl font-black text-red-600">
                {formatKD(activePeriod?.totalDeductions)} <span className="text-xs font-semibold text-slate-500">KD</span>
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isAr ? "صافي الصرف الفعلي" : "Net Disbursed Pay"}
              </p>
              <p className="numeric-ltr mt-1 text-2xl font-black text-emerald-700">
                {formatKD(activePeriod?.totalNet)} <span className="text-xs font-semibold text-slate-500">KD</span>
              </p>
            </div>
          </div>

          {/* Payslips Table */}
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-2xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-slate-600">
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "كود الموظف" : "Emp Code"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "اسم الموظف" : "Employee Name"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "المسمى" : "Position"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "الأساسي" : "Basic (KD)"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "البدلات" : "Allowances (KD)"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "الخصومات" : "Deductions (KD)"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "صافي الراتب" : "Net Salary (KD)"}</th>
                  <th className="px-4 py-3 text-start font-bold">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {slips.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      {isAr ? "لا توجد قسائم رواتب في هذا المسير." : "No payslips recorded in this batch."}
                    </td>
                  </tr>
                ) : (
                  slips.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{s.employee?.code || "-"}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.employee?.name || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{s.employee?.position || "-"}</td>
                      <td className="numeric-ltr px-4 py-3 font-semibold text-slate-900">{formatKD(s.basicSalary)}</td>
                      <td className="numeric-ltr px-4 py-3 text-slate-600">{formatKD(s.allowances)}</td>
                      <td className="numeric-ltr px-4 py-3 text-red-600">{formatKD(s.deductions)}</td>
                      <td className="numeric-ltr px-4 py-3 font-black text-emerald-700">{formatKD(s.netSalary)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          {s.status || "PROCESSED"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center shadow-2xs">
          <Calculator className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-900">
            {isAr ? "لم يتم تشغيل مسير رواتب بعد" : "No Payroll Batches Generated Yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {isAr
              ? "انقر على معالجة مسير رواتب جديد لتوليد مستحقات الموظفين النشطين وترحيل القيود المحاسبية."
              : "Click '+ Run Payroll Batch' to generate monthly employee wages and create balanced double-entry accounting records."}
          </p>
          <button
            type="button"
            onClick={() => {
              setYear(new Date().getFullYear());
              setMonth(new Date().getMonth() + 1);
              setTargetBranchId(currentBranch?.id || "");
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-[#FDCE0C]"
          >
            <Play className="h-4 w-4" />
            <span>{isAr ? "بدء تشغيل أول مسير" : "Run First Payroll Batch"}</span>
          </button>
        </div>
      )}

      {/* Run Payroll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              {isAr ? "تشغيل مسير رواتب الكادر" : "Execute Monthly Payroll Run"}
            </h2>

            <form onSubmit={handleRunPayroll} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "السنة *" : "Year *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="2020"
                    max="2030"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "الشهر *" : "Month (1-12) *"}
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m} - {new Date(2026, m - 1, 1).toLocaleString("en-US", { month: "short" })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isAr ? "نطاق الفرع" : "Branch Scope"}
                </label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                >
                  <option value="">{isAr ? "جميع الفروع والمكتب الرئيسي" : "All Branches & Head Office"}</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-[11px] text-amber-900">
                <p className="font-bold mb-1">{isAr ? "ملاحظة الترحيل المحاسبي:" : "Double-Entry Accounting Notice:"}</p>
                <p>
                  {isAr
                    ? "سيقوم النظام باحتساب استحقاقات جميع الموظفين النشطين تلقائيًا، وإنشاء قيد يومية متوازن (مدين: مصروفات الرواتب 6000 / دائن: نقدية بالبنك 1010)."
                    : "The system will aggregate active staff contracts and auto-generate a balanced journal entry: Dr Salary Expense (6000) / Cr Commercial Bank (1010)."}
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-[#FDCE0C] hover:bg-slate-800"
                >
                  {isProcessing ? (isAr ? "جاري المعالجة..." : "Processing...") : (isAr ? "تنفيذ وترحيل المسير" : "Execute & Post Payroll")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
