"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listPromotionsRequest,
  createPromotionRequest,
  deletePromotionRequest,
  listDiscountPermissionsRequest,
  updateDiscountPermissionRequest,
  listDiscountAuditLogsRequest,
  listItemsRequest,
  listCustomersRequest,
  type PromotionRecord,
  type UserDiscountPermissionRecord,
  type DiscountAuditLogRecord,
  type ItemResponse,
  type CustomerResponse,
} from "@/lib/api";
import {
  Tag,
  ShieldAlert,
  History,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Building,
  UserCheck,
  Percent,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Lock,
} from "lucide-react";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function PromotionsManagementPage() {
  const { t } = useLocale();
  const { user } = useSession();

  const [activeTab, setActiveTab] = useState<"PROMOTIONS" | "PERMISSIONS" | "AUDIT_LOGS">("PROMOTIONS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data lists
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [permissions, setPermissions] = useState<UserDiscountPermissionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<DiscountAuditLogRecord[]>([]);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);

  // Promotion Form Modal
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState<{
    code: string;
    nameEn: string;
    nameAr: string;
    description: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    maxQuantity: string;
    isCombinable: boolean;
    isActive: boolean;
    targetType: "PRODUCT" | "PRODUCT_GROUP" | "CATEGORY" | "ALL_PRODUCTS";
    branchScope: "ALL_BRANCHES" | "SPECIFIC_BRANCHES";
    customerScope: "ALL_CUSTOMERS" | "SPECIFIC_CUSTOMER" | "CUSTOMER_GROUP";
    customerGroup: string;
    selectedItemIds: string[];
    selectedBranchIds: string[];
    selectedCustomerIds: string[];
  }>({
    code: "",
    nameEn: "",
    nameAr: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    maxQuantity: "",
    isCombinable: false,
    isActive: true,
    targetType: "ALL_PRODUCTS",
    branchScope: "ALL_BRANCHES",
    customerScope: "ALL_CUSTOMERS",
    customerGroup: "",
    selectedItemIds: [],
    selectedBranchIds: [],
    selectedCustomerIds: [],
  });

  // Filter state for Audit Logs
  const [auditQuery, setAuditQuery] = useState("");

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [promosData, permsData, logsData, itemsData, custsData] = await Promise.all([
        listPromotionsRequest(),
        listDiscountPermissionsRequest(),
        listDiscountAuditLogsRequest(),
        listItemsRequest().catch(() => []),
        listCustomersRequest().catch(() => []),
      ]);
      setPromotions(promosData);
      setPermissions(permsData);
      setAuditLogs(logsData);
      setItems(itemsData);
      setCustomers(custsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load management data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreatePromotion(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createPromotionRequest({
        code: promoForm.code.trim() || `PROMO-${Date.now().toString().slice(-4)}`,
        nameEn: promoForm.nameEn,
        nameAr: promoForm.nameAr || undefined,
        description: promoForm.description || undefined,
        discountType: promoForm.discountType,
        discountValue: Number(promoForm.discountValue),
        startDate: new Date(promoForm.startDate).toISOString(),
        endDate: new Date(promoForm.endDate).toISOString(),
        startTime: promoForm.startTime || undefined,
        endTime: promoForm.endTime || undefined,
        maxQuantity: promoForm.maxQuantity ? parseInt(promoForm.maxQuantity, 10) : undefined,
        isCombinable: promoForm.isCombinable,
        isActive: promoForm.isActive,
        targetType: promoForm.targetType,
        branchScope: promoForm.branchScope,
        customerScope: promoForm.customerScope,
        customerGroup: promoForm.customerGroup || undefined,
        itemIds: promoForm.targetType === "PRODUCT" ? promoForm.selectedItemIds : undefined,
        customerIds: promoForm.customerScope === "SPECIFIC_CUSTOMER" ? promoForm.selectedCustomerIds : undefined,
      });

      setSuccessMsg("Promotion created successfully!");
      setShowPromoModal(false);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save promotion");
    }
  }

  async function handleDeletePromotion(id: string) {
    if (!confirm("Are you sure you want to delete this promotion rule?")) return;
    try {
      await deletePromotionRequest(id);
      setSuccessMsg("Promotion rule deleted");
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete promotion");
    }
  }

  async function handlePermissionUpdate(
    userId: string,
    updates: {
      maxDiscountPercent?: number;
      canEditPrices?: boolean;
      requiresManagerApproval?: boolean;
      allowedBranchIds?: string[];
    }
  ) {
    const target = permissions.find((p) => p.userId === userId);
    if (!target) return;

    try {
      const updated = await updateDiscountPermissionRequest(userId, {
        maxDiscountPercent: updates.maxDiscountPercent ?? target.maxDiscountPercent,
        canEditPrices: updates.canEditPrices ?? target.canEditPrices,
        requiresManagerApproval: updates.requiresManagerApproval ?? target.requiresManagerApproval,
        allowedBranchIds: updates.allowedBranchIds ?? target.allowedBranchIds,
      });

      setPermissions(permissions.map((p) => (p.userId === userId ? updated : p)));
      setSuccessMsg("Cashier discount permission updated");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update permission");
    }
  }

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.invoiceNumber.toLowerCase().includes(auditQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditQuery.toLowerCase()) ||
      (log.reason ?? "").toLowerCase().includes(auditQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-indigo-600" />
            Promotion & Discount Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System Administrator Control Center for Retail Discounts, User Limits, & Audit Trails
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("PROMOTIONS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "PROMOTIONS" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tag className="w-4 h-4" />
            Promotions Builder ({promotions.length})
          </button>

          <button
            onClick={() => setActiveTab("PERMISSIONS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "PERMISSIONS" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            User Discount Control ({permissions.length})
          </button>

          <button
            onClick={() => setActiveTab("AUDIT_LOGS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "AUDIT_LOGS" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-4 h-4" />
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Global Alerts */}
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

      {/* TAB 1: PROMOTIONS BUILDER */}
      {activeTab === "PROMOTIONS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Active & Scheduled ERP Promotional Rules</h2>
            <button
              onClick={() => setShowPromoModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Promotion
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading promotion rules...</div>
          ) : promotions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No active promotions defined</p>
              <p className="text-xs text-slate-400">Create target promotions for specific products, branches, or customer tiers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((promo) => {
                const now = new Date();
                const start = new Date(promo.startDate);
                const end = new Date(promo.endDate);
                const isCurrent = promo.isActive && now >= start && now <= end;

                return (
                  <div key={promo.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                          {promo.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{promo.nameEn}</h3>
                        {promo.description && <p className="text-xs text-slate-500 line-clamp-1">{promo.description}</p>}
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCurrent ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isCurrent ? "ACTIVE" : "INACTIVE / EXPIRED"}
                      </span>
                    </div>

                    {/* Discount Value Badge */}
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Discount Value:</span>
                      <span className="text-sm font-bold text-indigo-700">
                        {promo.discountType === "PERCENTAGE" ? `${promo.discountValue}% OFF` : `KWD ${formatKD(promo.discountValue)} OFF`}
                      </span>
                    </div>

                    {/* Scope details */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Branch Scope: <strong>{promo.branchScope}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Target: <strong>{promo.targetType}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dates: {start.toLocaleDateString()} - {end.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {promo.isCombinable ? "Combinable with other promos" : "Non-combinable"}
                      </span>
                      <button
                        onClick={() => handleDeletePromotion(promo.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERMISSION-BASED DISCOUNT CONTROL */}
      {activeTab === "PERMISSIONS" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs space-y-1">
            <p className="font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700" />
              Cashier Discount & Price Authorization Controls
            </p>
            <p className="text-amber-800/80">
              Configure maximum discount percentages permitted without manager intervention, allow price overrides, and require PIN authorization.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Max Discount %</th>
                  <th className="px-5 py-3.5">Price Editing</th>
                  <th className="px-5 py-3.5">Manager Override</th>
                  <th className="px-5 py-3.5">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {permissions.map((perm) => (
                  <tr key={perm.userId} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-bold text-slate-900">{perm.fullName}</div>
                        <div className="text-[11px] text-slate-400">@{perm.username}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-[11px] font-semibold">
                        {perm.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          defaultValue={perm.maxDiscountPercent}
                          onBlur={(e) =>
                            handlePermissionUpdate(perm.userId, {
                              maxDiscountPercent: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-20 rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-900 font-semibold focus:border-indigo-600 outline-none"
                        />
                        <span className="text-slate-400 font-bold">%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perm.canEditPrices}
                          onChange={(e) =>
                            handlePermissionUpdate(perm.userId, { canEditPrices: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-2 text-xs text-slate-600 font-medium">
                          {perm.canEditPrices ? "Allowed" : "Disabled"}
                        </span>
                      </label>
                    </td>
                    <td className="px-5 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perm.requiresManagerApproval}
                          onChange={(e) =>
                            handlePermissionUpdate(perm.userId, {
                              requiresManagerApproval: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-2 text-xs text-slate-600 font-medium">
                          {perm.requiresManagerApproval ? "Required" : "Bypassed"}
                        </span>
                      </label>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] text-slate-400">Auto-saved</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISCOUNT AUDIT TRAIL LOGS */}
      {activeTab === "AUDIT_LOGS" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800">Complete Discount & Override Audit Trail</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search invoice #, user, reason..."
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:border-indigo-600 outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Cashier</th>
                  <th className="px-5 py-3.5">Discount Type</th>
                  <th className="px-5 py-3.5">Original Amt</th>
                  <th className="px-5 py-3.5">Discount</th>
                  <th className="px-5 py-3.5">Final Total</th>
                  <th className="px-5 py-3.5">Reason / Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                      No discount audit trail records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{log.invoiceNumber}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{log.userName}</div>
                        <div className="text-[10px] text-slate-400">{log.userRole}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.discountType === "PROMOTION"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {log.discountType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-semibold">KD {formatKD(log.originalAmount)}</td>
                      <td className="px-5 py-3.5 text-rose-600 font-bold">- KD {formatKD(log.discountAmount)}</td>
                      <td className="px-5 py-3.5 text-emerald-700 font-bold">KD {formatKD(log.finalAmount)}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800">{log.reason || "N/A"}</div>
                        {log.approvedByName && (
                          <div className="text-[10px] text-indigo-600 font-semibold">
                            Appr: {log.approvedByName}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PROMOTION MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Define Enterprise Promotion Rule</h2>
              <button
                onClick={() => setShowPromoModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER2026"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Promotion Name (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10% Summer Discount"
                    value={promoForm.nameEn}
                    onChange={(e) => setPromoForm({ ...promoForm, nameEn: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        discountType: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT",
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (KWD)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={promoForm.discountValue}
                    onChange={(e) => setPromoForm({ ...promoForm, discountValue: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={promoForm.startDate}
                    onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={promoForm.endDate}
                    onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Start Time (Optional)</label>
                  <input
                    type="time"
                    value={promoForm.startTime}
                    onChange={(e) => setPromoForm({ ...promoForm, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily End Time (Optional)</label>
                  <input
                    type="time"
                    value={promoForm.endTime}
                    onChange={(e) => setPromoForm({ ...promoForm, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Product Scope</label>
                  <select
                    value={promoForm.targetType}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        targetType: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="ALL_PRODUCTS">All Products</option>
                    <option value="PRODUCT">Specific Product(s)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Scope</label>
                  <select
                    value={promoForm.branchScope}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        branchScope: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="ALL_BRANCHES">All Branches</option>
                    <option value="SPECIFIC_BRANCHES">Specific Branches</option>
                  </select>
                </div>
              </div>

              {promoForm.targetType === "PRODUCT" && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Eligible Products</label>
                  <select
                    multiple
                    value={promoForm.selectedItemIds}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        selectedItemIds: Array.from(e.target.selectedOptions, (o) => o.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 h-24"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.sku})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={promoForm.isCombinable}
                    onChange={(e) => setPromoForm({ ...promoForm, isCombinable: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  Combinable with other promotions
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={promoForm.isActive}
                    onChange={(e) => setPromoForm({ ...promoForm, isActive: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  Activate immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
