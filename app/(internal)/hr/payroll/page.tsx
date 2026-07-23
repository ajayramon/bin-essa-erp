"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { payrollEntries } from "@/lib/mock-data/payroll";
import { employees } from "@/lib/mock-data/employees";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function PayrollPage() {
  const { locale, t } = useLocale();
  const { currentBrand } = useSession();

  const allMonths = Array.from(new Set(payrollEntries.map((p) => p.month))).sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState(allMonths[0] ?? "");

  const brandEmployeeIds = new Set(
    employees
      .filter((e) => (currentBrand ? e.brandId === currentBrand.id : false))
      .map((e) => e.id)
  );

  const filtered = payrollEntries.filter(
    (p) => brandEmployeeIds.has(p.employeeId) && p.month === selectedMonth
  );

  function employeeName(employeeId: string): string {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return employeeId;
    return locale === "ar" ? emp.nameAr : emp.nameEn;
  }

  function statusLabel(status: "draft" | "processed" | "paid"): string {
    if (status === "paid") return t.payroll.paid;
    if (status === "processed") return t.payroll.processed;
    return t.payroll.draft;
  }

  function statusClass(status: "draft" | "processed" | "paid"): string {
    if (status === "paid") return "bg-green-100 text-green-700";
    if (status === "processed") return "bg-gold/20 text-ink";
    return "bg-ink/10 text-ink/50";
  }

  const totalBasic = filtered.reduce((s, p) => s + p.basicSalaryKd, 0);
  const totalAllowances = filtered.reduce((s, p) => s + p.allowancesKd, 0);
  const totalDeductions = filtered.reduce((s, p) => s + p.deductionsKd, 0);
  const totalNet = filtered.reduce((s, p) => s + p.netPayKd, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t.payroll.title}</h1>
          <p className="mt-1 text-ink/60">{t.payroll.subtitle}</p>
        </div>
        {/* STAGE 1: Run Payroll button — placeholder only, no action wired yet */}
        <button className="rounded-2xl bg-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-gold/80">
          {t.payroll.runPayroll}
        </button>
      </div>

      <div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        >
          {allMonths.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.payroll.employee}</th>
              <th className="px-4 py-3 text-start font-medium">{t.payroll.basicSalary}</th>
              <th className="px-4 py-3 text-start font-medium">{t.payroll.allowances}</th>
              <th className="px-4 py-3 text-start font-medium">{t.payroll.deductions}</th>
              <th className="px-4 py-3 text-start font-medium">{t.payroll.netPay}</th>
              <th className="px-4 py-3 text-start font-medium">{t.payroll.status}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                <td className="px-4 py-3 font-medium text-ink">{employeeName(entry.employeeId)}</td>
                <td className="numeric-ltr px-4 py-3 text-ink/70">{formatKD(entry.basicSalaryKd)} KD</td>
                <td className="numeric-ltr px-4 py-3 text-ink/70">{formatKD(entry.allowancesKd)} KD</td>
                <td className="numeric-ltr px-4 py-3 text-ink/70">{formatKD(entry.deductionsKd)} KD</td>
                <td className="numeric-ltr px-4 py-3 font-semibold text-ink">{formatKD(entry.netPayKd)} KD</td>
                <td className="px-4 py-3">
                  <span className={`rounded-lg px-2 py-1 text-xs font-medium ${statusClass(entry.status)}`}>
                    {statusLabel(entry.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr className="border-t border-ink/10 bg-ink/5 font-semibold text-ink">
                <td className="px-4 py-3">{locale === "ar" ? "الإجمالي" : "Total"}</td>
                <td className="numeric-ltr px-4 py-3">{formatKD(totalBasic)} KD</td>
                <td className="numeric-ltr px-4 py-3">{formatKD(totalAllowances)} KD</td>
                <td className="numeric-ltr px-4 py-3">{formatKD(totalDeductions)} KD</td>
                <td className="numeric-ltr px-4 py-3">{formatKD(totalNet)} KD</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.payroll.noResults}</p>
        )}
      </div>
    </div>
  );
}
