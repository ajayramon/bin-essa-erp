"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  listPdcChecksRequest,
  createPdcCheckRequest,
  clearPdcCheckRequest,
  listCustomersRequest,
  type PdcCheckRecord,
  type CustomerResponse,
} from "@/lib/api";
import {
  FileCheck,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  DollarSign,
  UserCheck,
} from "lucide-react";

export default function PdcTrackingPage() {
  const { locale } = useLocale();

  const [checks, setChecks] = useState<PdcCheckRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New PDC Check Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    checkNumber: "",
    bankName: "NBK (National Bank of Kuwait)",
    dueDate: new Date().toISOString().split("T")[0],
    amount: 150.0,
    customerId: "",
    notes: "",
  });

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [checksData, customersData] = await Promise.all([
        listPdcChecksRequest(),
        listCustomersRequest().catch(() => []),
      ]);
      setChecks(checksData);
      setCustomers(customersData);
      if (customersData.length > 0 && !form.customerId) {
        setForm((f) => ({ ...f, customerId: customersData[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDC checks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createPdcCheckRequest({
        checkNumber: form.checkNumber.trim(),
        bankName: form.bankName.trim(),
        dueDate: form.dueDate,
        amount: Number(form.amount),
        customerId: form.customerId,
        notes: form.notes.trim() || undefined,
      });

      setSuccessMsg(`PDC Check #${form.checkNumber} registered successfully`);
      setShowModal(false);
      setForm({
        checkNumber: "",
        bankName: "NBK (National Bank of Kuwait)",
        dueDate: new Date().toISOString().split("T")[0],
        amount: 150.0,
        customerId: customers[0]?.id || "",
        notes: "",
      });
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register PDC Check");
    }
  }

  async function handleClearCheck(id: string, checkNumber: string) {
    setError(null);
    try {
      await clearPdcCheckRequest(id);
      setSuccessMsg(`PDC Check #${checkNumber} cleared and journal entry posted`);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear check");
    }
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-indigo-600" />
            Post-Dated Check (PDC) Settlement & Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounts Receivable — Commercial Post-Dated Check Clearing & Automated Double-Entry Journal Integration
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Receive New PDC Check
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading PDC checks...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Check #</th>
                <th className="px-5 py-3.5">Issuing Bank</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Amount (KWD)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {checks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No Post-Dated Checks registered yet. Click <strong>Receive New PDC Check</strong> above to add one.
                  </td>
                </tr>
              ) : (
                checks.map((chk) => (
                  <tr key={chk.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-900 font-mono">{chk.checkNumber}</td>
                    <td className="px-5 py-4 text-slate-700">{chk.bankName}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">
                      {chk.customer ? chk.customer.name : "Walk-in B2B Customer"}
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-mono">
                      {new Date(chk.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 font-bold text-indigo-700 font-mono">
                      {Number(chk.amount).toFixed(3)} KD
                    </td>
                    <td className="px-5 py-4">
                      {chk.status === "CLEARED" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          CLEARED
                        </span>
                      )}
                      {chk.status === "RECEIVED" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          PENDING DUE
                        </span>
                      )}
                      {chk.status === "BOUNCED" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          BOUNCED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {chk.status === "RECEIVED" ? (
                        <button
                          onClick={() => handleClearCheck(chk.id, chk.checkNumber)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition"
                        >
                          Clear & Post Journal
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Receive Customer Post-Dated Check</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Check Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CHK-990182"
                  value={form.checkNumber}
                  onChange={(e) => setForm({ ...form, checkNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issuing Bank</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Bank of Kuwait (NBK)"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check Amount (KWD)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maturity / Due Date</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drawer Customer Account</label>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 font-medium"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Receive Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
