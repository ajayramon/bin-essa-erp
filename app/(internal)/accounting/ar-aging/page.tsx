"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  getCustomerArAgingReportRequest,
  type CustomerArAgingRecord,
} from "@/lib/api";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

export default function CustomerArAgingPage() {
  const { locale } = useLocale();

  const [records, setRecords] = useState<CustomerArAgingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomerArAgingReportRequest();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load AR aging report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalAr = records.reduce((acc, r) => acc + r.totalOutstanding, 0);
  const totalOverdue = records.reduce((acc, r) => acc + r.days31to60 + r.days61to90 + r.days90Plus, 0);

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-indigo-600" />
            Accounts Receivable (AR) Aging Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Commercial Customer AR Aging Buckets (Current, 1–30, 31–60, 61–90, 90+ Days) & Credit Exposure Breakdown
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
        >
          Refresh Ledger
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Receivables</div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalAr.toFixed(3)} KD</div>
          <div className="text-[11px] text-slate-400">Total outstanding customer balances</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/30 shadow-sm space-y-1">
          <div className="text-xs text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Total Overdue (&gt;30 Days)
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">{totalOverdue.toFixed(3)} KD</div>
          <div className="text-[11px] text-rose-500 font-medium">Requires collection follow-up</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Credit Customers</div>
          <div className="text-2xl font-black text-indigo-600 font-mono">{records.length}</div>
          <div className="text-[11px] text-slate-400">Accounts with active credit terms</div>
        </div>
      </div>

      {/* Aging Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading AR aging report...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Credit Limit</th>
                  <th className="px-5 py-3.5 text-right">Current (0-30 Days)</th>
                  <th className="px-5 py-3.5 text-right">31–60 Days</th>
                  <th className="px-5 py-3.5 text-right">61–90 Days</th>
                  <th className="px-5 py-3.5 text-right text-rose-600">90+ Days</th>
                  <th className="px-5 py-3.5 text-right">Total Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium font-mono">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400 font-sans">
                      No active customer receivables found.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.customerId} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-sans font-bold text-slate-900">
                        <div>{r.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">#{r.customerCode}</div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">{r.creditLimit.toFixed(3)} KD</td>

                      <td className="px-5 py-4 text-right text-emerald-700 font-bold">
                        {r.current > 0 ? `${r.current.toFixed(3)} KD` : "-"}
                      </td>

                      <td className="px-5 py-4 text-right text-amber-700 font-bold">
                        {r.days31to60 > 0 ? `${r.days31to60.toFixed(3)} KD` : "-"}
                      </td>

                      <td className="px-5 py-4 text-right text-orange-700 font-bold">
                        {r.days61to90 > 0 ? `${r.days61to90.toFixed(3)} KD` : "-"}
                      </td>

                      <td className="px-5 py-4 text-right text-rose-700 font-black">
                        {r.days90Plus > 0 ? `${r.days90Plus.toFixed(3)} KD` : "-"}
                      </td>

                      <td className="px-5 py-4 text-right font-black text-indigo-900 text-sm">
                        {r.totalOutstanding.toFixed(3)} KD
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
