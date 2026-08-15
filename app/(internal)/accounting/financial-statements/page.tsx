"use client";

import { useEffect, useState } from "react";
import { Calculator, BarChart3, TrendingUp, Scale, DollarSign, RefreshCw } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  getIncomeStatementRequest,
  getBalanceSheetRequest,
  getCashFlowRequest,
  getInventoryValuationRequest,
  type IncomeStatementResponse,
  type BalanceSheetResponse,
  type CashFlowResponse,
  type InventoryValuationResponse,
} from "@/lib/api";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

type TabType = "PNL" | "BALANCE_SHEET" | "CASH_FLOW" | "VALUATION";

export default function FinancialStatementsPage() {
  const { locale, t } = useLocale();
  const { currentBranch, isHeadOffice } = useSession();

  const [activeTab, setActiveTab] = useState<TabType>("PNL");
  const [pnl, setPnl] = useState<IncomeStatementResponse | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetResponse | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowResponse | null>(null);
  const [valuation, setValuation] = useState<InventoryValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatements() {
      setIsLoading(true);
      setError(null);
      try {
        const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
        const [pnlData, bsData, cfData, valData] = await Promise.all([
          getIncomeStatementRequest(undefined, undefined, branchId),
          getBalanceSheetRequest(undefined, branchId),
          getCashFlowRequest(undefined, undefined, branchId),
          getInventoryValuationRequest(branchId),
        ]);

        if (!cancelled) {
          setPnl(pnlData);
          setBalanceSheet(bsData);
          setCashFlow(cfData);
          setValuation(valData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load financial statements");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadStatements();
    return () => {
      cancelled = true;
    };
  }, [currentBranch, isHeadOffice]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "القوائم المالية والتقارير الختامية" : "Official Financial Statements"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar"
              ? "قائمة الدخل (الأرباح والخسائر)، الميزانية العمومية، وقائمة التدفقات النقدية المتوازنة محاسبيًا."
              : "Live IFRS-compliant financial statements: Income Statement (P&L), Balance Sheet, Cash Flow, and Valuation."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-ink/10 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("PNL")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "PNL"
                ? "bg-ink text-paper"
                : "text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {locale === "ar" ? "قائمة الدخل (P&L)" : "Income Statement (P&L)"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("BALANCE_SHEET")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "BALANCE_SHEET"
                ? "bg-ink text-paper"
                : "text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {locale === "ar" ? "الميزانية العمومية" : "Balance Sheet"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CASH_FLOW")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "CASH_FLOW"
                ? "bg-ink text-paper"
                : "text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {locale === "ar" ? "التدفقات النقدية" : "Cash Flow"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("VALUATION")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "VALUATION"
                ? "bg-ink text-paper"
                : "text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {locale === "ar" ? "تقييم المخزون" : "Inventory Valuation"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center text-sm text-ink/50 shadow-sm">
          {locale === "ar" ? "جارٍ إعداد القوائم المالية..." : "Calculating balanced financial statements..."}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* TAB 1: P&L */}
          {activeTab === "PNL" && pnl && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "إجمالي الإيرادات" : "Gross Revenue"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
                    {formatKD(pnl.revenue)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "تكلفة المبيعات (COGS)" : "Cost of Goods Sold"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-ink/80">
                    {formatKD(pnl.cogs)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "مجمل الربح (Gross Profit)" : "Gross Profit"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
                    {formatKD(pnl.grossProfit)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "صافي الربح (Net Profit)" : "Net Profit / Loss"}
                  </p>
                  <p
                    className={`numeric-ltr mt-2 text-2xl font-bold ${
                      pnl.netProfit >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {formatKD(pnl.netProfit)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>
              </div>

              {/* Statement Breakdown Table */}
              <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
                <div className="border-b border-ink/10 bg-ink/[0.02] px-6 py-4">
                  <h3 className="font-bold text-ink">Income Statement (Profit & Loss)</h3>
                </div>
                <div className="divide-y divide-ink/5 p-6 space-y-4">
                  <div className="flex justify-between py-2 text-sm font-bold text-ink">
                    <span>Operating Revenue (Sales Invoices)</span>
                    <span className="numeric-ltr font-mono">{formatKD(pnl.revenue)} KD</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm text-ink/80">
                    <span className="ps-4">Less: Cost of Goods Sold (Account 5000)</span>
                    <span className="numeric-ltr font-mono text-red-600">({formatKD(pnl.cogs)}) KD</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm font-bold text-emerald-700">
                    <span>Gross Operating Margin</span>
                    <span className="numeric-ltr font-mono">{formatKD(pnl.grossProfit)} KD</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm text-ink/80">
                    <span className="ps-4">Less: Operating Expenses (Account 6000 & Salaries)</span>
                    <span className="numeric-ltr font-mono text-red-600">
                      ({formatKD(pnl.operatingExpenses)}) KD
                    </span>
                  </div>
                  <div className="flex justify-between border-t-2 border-ink/20 pt-4 text-base font-extrabold text-ink">
                    <span>Net Operating Income (Loss)</span>
                    <span
                      className={`numeric-ltr font-mono ${
                        pnl.netProfit >= 0 ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {formatKD(pnl.netProfit)} KD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BALANCE SHEET */}
          {activeTab === "BALANCE_SHEET" && balanceSheet && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "إجمالي الأصول (Assets)" : "Total Assets"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
                    {formatKD(balanceSheet.assets.totalAssets)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "إجمالي الالتزامات (Liabilities)" : "Total Liabilities"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
                    {formatKD(balanceSheet.liabilities.totalLiabilities)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "حقوق الملكية (Equity)" : "Total Equity"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
                    {formatKD(balanceSheet.equity.totalEquity)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>
              </div>

              {/* Balance Verification Banner */}
              <div
                className={`flex items-center justify-between rounded-2xl border p-4 ${
                  balanceSheet.isBalanced
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                }`}
              >
                <div className="text-sm font-semibold">
                  {balanceSheet.isBalanced
                    ? "✓ Balance Sheet Equation Satisfied: Total Assets === Total Liabilities + Equity"
                    : "Accounting Variance Detected"}
                </div>
                <div className="numeric-ltr font-mono text-sm font-bold">
                  {formatKD(balanceSheet.assets.totalAssets)} KD ==={" "}
                  {formatKD(balanceSheet.totalLiabilitiesAndEquity)} KD
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CASH FLOW */}
          {activeTab === "CASH_FLOW" && cashFlow && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "التدفقات النقدية الداخلة" : "Operating Inflows"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-emerald-600">
                    {formatKD(cashFlow.operatingInflows.totalInflow)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "التدفقات النقدية الخارجة" : "Operating Outflows"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-red-600">
                    {formatKD(cashFlow.operatingOutflows.totalOutflow)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "صافي التدفق النقدي" : "Net Cash Position"}
                  </p>
                  <p
                    className={`numeric-ltr mt-2 text-2xl font-bold ${
                      cashFlow.netCashFlow >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {formatKD(cashFlow.netCashFlow)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY VALUATION */}
          {activeTab === "VALUATION" && valuation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "إجمالي التقييم المالي للمخزون" : "Total Inventory Valuation"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
                    {formatKD(valuation.totalValuation)}{" "}
                    <span className="text-sm font-normal text-ink/50">KD</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {locale === "ar" ? "إجمالي كميات الأصناف بالمستودعات" : "Total Units in Stock"}
                  </p>
                  <p className="numeric-ltr mt-2 text-2xl font-bold text-ink">
                    {valuation.totalItemsCount.toLocaleString()} Units
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
                <table className="w-full text-start text-sm">
                  <thead className="border-b border-ink/10 bg-ink/[0.02] text-xs font-semibold text-ink/60">
                    <tr>
                      <th className="px-5 py-3.5 text-start">SKU</th>
                      <th className="px-5 py-3.5 text-start">Item Name</th>
                      <th className="px-5 py-3.5 text-end">On-Hand Quantity</th>
                      <th className="px-5 py-3.5 text-end">Unit Cost (WAC)</th>
                      <th className="px-5 py-3.5 text-end">Valuation Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {valuation.itemsValuation.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-sm text-ink/40">
                          No valuation records found.
                        </td>
                      </tr>
                    ) : (
                      valuation.itemsValuation.map((v) => (
                        <tr key={v.itemId} className="transition-colors hover:bg-ink/[0.01]">
                          <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">
                            {v.sku}
                          </td>
                          <td className="px-5 py-4 font-semibold text-ink">{v.name}</td>
                          <td className="numeric-ltr px-5 py-4 text-end text-ink">
                            {v.quantity.toLocaleString()}
                          </td>
                          <td className="numeric-ltr px-5 py-4 text-end text-ink/70">
                            {formatKD(v.unitCost)} KD
                          </td>
                          <td className="numeric-ltr px-5 py-4 text-end font-bold text-ink">
                            {formatKD(v.valuation)} KD
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
