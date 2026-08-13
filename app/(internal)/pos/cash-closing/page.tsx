"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  getCurrentPosShiftRequest,
  openPosShiftRequest,
  closePosShiftRequest,
  reopenPosShiftRequest,
  adjustPosShiftRequest,
  listPosShiftsRequest,
  type PosShiftRecord,
} from "@/lib/api";
import {
  Clock,
  DollarSign,
  CreditCard,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Calculator,
  FileSpreadsheet,
  Coins,
  Receipt,
  RotateCcw,
  Edit,
} from "lucide-react";

interface BanknoteCounter {
  d20: number;
  d10: number;
  d5: number;
  d1: number;
  d05: number;
  d025: number;
}

export default function PosCashClosingPage() {
  const { locale } = useLocale();
  const { user, currentBranch } = useSession();

  const [currentShift, setCurrentShift] = useState<PosShiftRecord | null>(null);
  const [shiftHistory, setShiftHistory] = useState<PosShiftRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Banknote Drawer Denominations
  const [denominations, setDenominations] = useState<BanknoteCounter>({
    d20: 0,
    d10: 0,
    d5: 0,
    d1: 0,
    d05: 0,
    d025: 0,
  });

  // Shift Actions Modal State
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [openingFloatInput, setOpeningFloatInput] = useState(50.0);
  const [notesInput, setNotesInput] = useState("");
  const [closingInProcess, setClosingInProcess] = useState(false);

  // Manager Override Modal State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedShiftForOverride, setSelectedShiftForOverride] = useState<PosShiftRecord | null>(null);
  const [overrideAction, setOverrideAction] = useState<"reopen" | "adjust">("reopen");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideCashInput, setOverrideCashInput] = useState<number>(0);
  const [overrideInProcess, setOverrideInProcess] = useState(false);

  // Calculate counted total from physical banknotes
  const countedCashTotal =
    denominations.d20 * 20.0 +
    denominations.d10 * 10.0 +
    denominations.d5 * 5.0 +
    denominations.d1 * 1.0 +
    denominations.d05 * 0.5 +
    denominations.d025 * 0.25;

  const expectedCashTotal = currentShift
    ? Number(currentShift.openingFloat) + Number(currentShift.cashSalesTotal) - Number(currentShift.returnsTotal || 0)
    : 0;

  const cashVariance = countedCashTotal - expectedCashTotal;

  async function loadShiftData() {
    setLoading(true);
    setError(null);
    try {
      const [shift, history] = await Promise.all([
        getCurrentPosShiftRequest(user?.id, currentBranch?.id),
        listPosShiftsRequest(currentBranch?.id),
      ]);
      setCurrentShift(shift);
      setShiftHistory(history);
    } catch (e: any) {
      setError(e.message || "Failed to load shift details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShiftData();
  }, [user?.id, currentBranch?.id]);

  async function handleOpenShift(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !currentBranch) return;
    setError(null);
    try {
      const newShift = await openPosShiftRequest({
        userId: user.id,
        branchId: currentBranch.id,
        openingFloat: openingFloatInput,
      });
      setCurrentShift(newShift);
      setShowOpenModal(false);
      setSuccessMsg(`Shift #${newShift.shiftNumber} opened successfully!`);
      loadShiftData();
    } catch (e: any) {
      setError(e.message || "Could not open shift");
    }
  }

  async function handleCloseShift() {
    if (!currentShift) return;
    setClosingInProcess(true);
    setError(null);
    try {
      const closed = await closePosShiftRequest(currentShift.id, {
        closingCashActual: countedCashTotal,
        notes: notesInput,
      });
      setCurrentShift(closed);
      setSuccessMsg(`Shift #${closed.shiftNumber} closed & reconciled successfully!`);
      loadShiftData();
    } catch (e: any) {
      setError(e.message || "Failed to close shift");
    } finally {
      setClosingInProcess(false);
    }
  }

  async function handleOverrideSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedShiftForOverride || !overrideReason.trim()) return;
    setOverrideInProcess(true);
    setError(null);
    try {
      if (overrideAction === "reopen") {
        await reopenPosShiftRequest(selectedShiftForOverride.id, {
          userId: user.id,
          userRole: user.role,
          reason: overrideReason,
        });
        setSuccessMsg(`Shift #${selectedShiftForOverride.shiftNumber} reopened successfully! Audit log created.`);
      } else {
        await adjustPosShiftRequest(selectedShiftForOverride.id, {
          userId: user.id,
          userRole: user.role,
          closingCashActual: overrideCashInput,
          reason: overrideReason,
        });
        setSuccessMsg(`Shift #${selectedShiftForOverride.shiftNumber} cash adjusted to ${overrideCashInput.toFixed(3)} KD! Audit log created.`);
      }
      setShowOverrideModal(false);
      setSelectedShiftForOverride(null);
      setOverrideReason("");
      loadShiftData();
    } catch (e: any) {
      setError(e.message || "Override operation failed");
    } finally {
      setOverrideInProcess(false);
    }
  }

  return (
    <div className="p-8 space-y-8 bg-slate-900/40 min-h-screen text-slate-100 font-sans">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {locale === "ar" ? "إقفال الصندوق وتصفية الدرج" : "Daily POS Cash Closing & Shift Reconciliation"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {locale === "ar"
                  ? "إدارة ورديات الكاشير، مطابقة النقدية الفعلية، وحساب الفروقات المالية precision 3 KWD"
                  : "Cashier shift management, physical drawer denomination tally, and double-entry variance posting."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadShiftData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh State
          </button>
          {!currentShift || currentShift.status === "CLOSED" ? (
            <button
              onClick={() => setShowOpenModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              <Unlock className="w-4 h-4" />
              Open New Shift
            </button>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              Active Shift #{currentShift.shiftNumber}
            </span>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Shift Overview */}
      {currentShift && currentShift.status === "OPEN" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live Shift KPI Cards & Banknote Denomination Calculator */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shift KPI Tally Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Opening Float</div>
                <div className="text-xl font-bold text-white font-mono">
                  {Number(currentShift.openingFloat).toFixed(3)} <span className="text-xs text-indigo-400 font-sans">KD</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Cash Sales</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {Number(currentShift.cashSalesTotal).toFixed(3)} <span className="text-xs font-sans">KD</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Card / K-Net</div>
                <div className="text-xl font-bold text-cyan-400 font-mono">
                  {Number(currentShift.cardSalesTotal).toFixed(3)} <span className="text-xs font-sans">KD</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">B2B Credit Sales</div>
                <div className="text-xl font-bold text-amber-400 font-mono">
                  {Number(currentShift.creditSalesTotal).toFixed(3)} <span className="text-xs font-sans">KD</span>
                </div>
              </div>
            </div>

            {/* Physical KWD Banknote & Coin Counter */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Physical Drawer Denomination Counter</h2>
                    <p className="text-xs text-slate-400">Enter physical KWD count per bill/coin denomination</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDenominations({ d20: 0, d10: 0, d5: 0, d1: 0, d05: 0, d025: 0 })
                  }
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Reset Count
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* 20.000 KD */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">20.000 KD Bill</span>
                    <span className="text-xs font-mono text-emerald-400">
                      {(denominations.d20 * 20).toFixed(3)} KD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations.d20 || ""}
                    onChange={(e) =>
                      setDenominations({ ...denominations, d20: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none focus:border-indigo-500"
                    placeholder="Qty"
                  />
                </div>

                {/* 10.000 KD */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">10.000 KD Bill</span>
                    <span className="text-xs font-mono text-emerald-400">
                      {(denominations.d10 * 10).toFixed(3)} KD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations.d10 || ""}
                    onChange={(e) =>
                      setDenominations({ ...denominations, d10: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none focus:border-indigo-500"
                    placeholder="Qty"
                  />
                </div>

                {/* 5.000 KD */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">5.000 KD Bill</span>
                    <span className="text-xs font-mono text-emerald-400">
                      {(denominations.d5 * 5).toFixed(3)} KD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations.d5 || ""}
                    onChange={(e) =>
                      setDenominations({ ...denominations, d5: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none focus:border-indigo-500"
                    placeholder="Qty"
                  />
                </div>

                {/* 1.000 KD */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">1.000 KD Bill</span>
                    <span className="text-xs font-mono text-emerald-400">
                      {(denominations.d1 * 1).toFixed(3)} KD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations.d1 || ""}
                    onChange={(e) =>
                      setDenominations({ ...denominations, d1: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none focus:border-indigo-500"
                    placeholder="Qty"
                  />
                </div>

                {/* 0.500 KD */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">0.500 KD Bill</span>
                    <span className="text-xs font-mono text-emerald-400">
                      {(denominations.d05 * 0.5).toFixed(3)} KD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations.d05 || ""}
                    onChange={(e) =>
                      setDenominations({ ...denominations, d05: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none focus:border-indigo-500"
                    placeholder="Qty"
                  />
                </div>

                {/* 0.250 KD */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">0.250 KD Coin</span>
                    <span className="text-xs font-mono text-emerald-400">
                      {(denominations.d025 * 0.25).toFixed(3)} KD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations.d025 || ""}
                    onChange={(e) =>
                      setDenominations({ ...denominations, d025: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none focus:border-indigo-500"
                    placeholder="Qty"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Shift Reconciliation & Drawer Closing Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Shift Reconcilation Summary</h2>
                  <p className="text-xs text-slate-400">Comparison of expected drawer total vs physical count</p>
                </div>
              </div>

              {/* Expected vs Counted Tally */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">Expected Drawer Cash</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {expectedCashTotal.toFixed(3)} KD
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/30">
                  <span className="text-xs font-semibold text-indigo-300">Counted Physical Cash</span>
                  <span className="text-xl font-black font-mono text-indigo-400">
                    {countedCashTotal.toFixed(3)} KD
                  </span>
                </div>

                {/* Cash Variance Meter */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    cashVariance === 0
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : cashVariance > 0
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cashVariance === 0 ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-xs font-bold">
                      {cashVariance === 0
                        ? "Exact Reconciliation (No Variance)"
                        : cashVariance > 0
                        ? "Cash Overage Detected"
                        : "Cash Shortage (Deficit) Detected"}
                    </span>
                  </div>
                  <span className="text-lg font-black font-mono">
                    {cashVariance > 0 ? `+${cashVariance.toFixed(3)}` : cashVariance.toFixed(3)} KD
                  </span>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Reconciliation & Closing Notes</label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Provide explanation for variance or shift handover comments..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Close Shift Action */}
              <button
                onClick={handleCloseShift}
                disabled={closingInProcess}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                {closingInProcess ? "Closing Shift..." : "Reconcile & Close Cashier Shift"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* No Active Shift Banner */
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Active Cashier Shift</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            There is currently no open shift registered for your user session at branch{" "}
            <span className="text-indigo-400 font-bold">{currentBranch?.nameEn || "Main Store"}</span>.
            Open a shift to start recording register transactions and cash float tracking.
          </p>
          <button
            onClick={() => setShowOpenModal(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg transition inline-flex items-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            Open Shift Now
          </button>
        </div>
      )}

      {/* Shift Audit History Log */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            Historical Closed Shifts & Audits
          </h2>
          <span className="text-xs text-slate-400">{shiftHistory.length} Shifts Recorded</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Shift #</th>
                <th className="p-4">Opened At</th>
                <th className="p-4">Closed At</th>
                <th className="p-4">Opening Float</th>
                <th className="p-4">Cash Sales</th>
                <th className="p-4">Card Sales</th>
                <th className="p-4">Counted Cash</th>
                <th className="p-4">Variance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {shiftHistory.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-bold text-indigo-400">{s.shiftNumber}</td>
                  <td className="p-4">{new Date(s.openedAt).toLocaleString()}</td>
                  <td className="p-4">{s.closedAt ? new Date(s.closedAt).toLocaleString() : "—"}</td>
                  <td className="p-4">{Number(s.openingFloat).toFixed(3)} KD</td>
                  <td className="p-4 text-emerald-400">{Number(s.cashSalesTotal).toFixed(3)} KD</td>
                  <td className="p-4 text-cyan-400">{Number(s.cardSalesTotal).toFixed(3)} KD</td>
                  <td className="p-4">{Number(s.closingCashActual).toFixed(3)} KD</td>
                  <td className={`p-4 font-bold ${Number(s.cashVariance) < 0 ? "text-rose-400" : Number(s.cashVariance) > 0 ? "text-cyan-400" : "text-emerald-400"}`}>
                    {Number(s.cashVariance) > 0 ? `+${Number(s.cashVariance).toFixed(3)}` : Number(s.cashVariance).toFixed(3)} KD
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        s.status === "OPEN"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-end font-sans">
                    {s.status === "CLOSED" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedShiftForOverride(s);
                            setOverrideAction("reopen");
                            setOverrideReason("");
                            setShowOverrideModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-semibold border border-indigo-500/30 transition flex items-center gap-1"
                          title="Reopen Shift (Manager Override)"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reopen
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedShiftForOverride(s);
                            setOverrideAction("adjust");
                            setOverrideCashInput(Number(s.closingCashActual));
                            setOverrideReason("");
                            setShowOverrideModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white text-[11px] font-semibold border border-amber-500/30 transition flex items-center gap-1"
                          title="Adjust Counted Cash (Manager Override)"
                        >
                          <Edit className="w-3 h-3" />
                          Adjust
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {shiftHistory.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    No closed shifts recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Shift Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-400" />
                Open Cashier Register Shift
              </h3>
              <button
                onClick={() => setShowOpenModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOpenShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Opening Cash Float (KD)
                </label>
                <input
                  type="number"
                  step="0.050"
                  required
                  value={openingFloatInput}
                  onChange={(e) => setOpeningFloatInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOpenModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Confirm & Open Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manager Override Modal */}
      {showOverrideModal && selectedShiftForOverride && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {overrideAction === "reopen" ? (
                  <>
                    <RotateCcw className="w-5 h-5 text-indigo-400" />
                    Reopen Shift #{selectedShiftForOverride.shiftNumber}
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5 text-amber-400" />
                    Adjust Cash for Shift #{selectedShiftForOverride.shiftNumber}
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
                ⚠️ All reopen and adjustment actions create an immutable audit trail entry recording your user ID and justification.
              </div>

              {overrideAction === "adjust" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Revised Physical Cash Counted (KD)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={overrideCashInput}
                    onChange={(e) => setOverrideCashInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Manager Justification Reason (Mandatory)
                </label>
                <textarea
                  rows={3}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Provide operational reason for reopening or adjusting..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={overrideInProcess}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {overrideInProcess ? "Executing..." : "Confirm & Save Audit Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
