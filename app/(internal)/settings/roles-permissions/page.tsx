"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listUsersRequest,
  createUserRequest,
  updateUserRequest,
  listRolePermissionsRequest,
  updateRolePermissionRequest,
  listBranchesRequest,
  type UserRecord,
  type RolePermissionRecord,
  type BranchResponse,
} from "@/lib/api";
import {
  ShieldCheck,
  Users,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Lock,
  Building,
  Key,
  Check,
} from "lucide-react";

const ALL_ROLES = [
  "ADMIN",
  "MANAGER",
  "CASHIER",
  "ACCOUNTANT",
  "STOREKEEPER",
  "SALES_REP",
  "B2B_CUSTOMER",
];

const MODULE_LIST: Array<{ key: string; labelEn: string; labelAr: string }> = [
  { key: "dashboard", labelEn: "Dashboard", labelAr: "لوحة التحكم" },
  { key: "groupDashboard", labelEn: "Group Dashboard", labelAr: "لوحة تحكم المجموعة" },
  { key: "pos", labelEn: "Point of Sale (POS)", labelAr: "نقطة البيع" },
  { key: "promotions", labelEn: "Promotions & Discounts", labelAr: "العروض والتخفيضات" },
  { key: "inventory", labelEn: "Inventory Management", labelAr: "إدارة المخزون" },
  { key: "purchasing", labelEn: "Purchasing & Bills", labelAr: "المشتريات والفواتير" },
  { key: "accounting", labelEn: "Accounting & Ledger", labelAr: "المحاسبة والدفاتر" },
  { key: "hr", labelEn: "HR & Payroll", labelAr: "الموارد البشرية" },
  { key: "b2b", labelEn: "B2B Customer Portal", labelAr: "بوابة عملاء الجملة" },
  { key: "settings", labelEn: "Settings & Administration", labelAr: "الإعدادات" },
];

export default function RolesPermissionsPage() {
  const { locale, t } = useLocale();
  const { user: currentUser } = useSession();

  const [activeTab, setActiveTab] = useState<"MATRIX" | "USERS">("MATRIX");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [branches, setBranches] = useState<BranchResponse[]>([]);

  // New User Form Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "CASHIER",
    branchId: "",
    isActive: true,
  });

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolePermsData, branchData] = await Promise.all([
        listUsersRequest(),
        listRolePermissionsRequest(),
        listBranchesRequest().catch(() => []),
      ]);
      setUsers(usersData);
      setBranches(branchData);

      const matrix: Record<string, string[]> = {};
      rolePermsData.forEach((rp) => {
        matrix[rp.role] = rp.modules;
      });
      setRolePermissions(matrix);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roles and permissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function toggleModulePermission(role: string, moduleKey: string) {
    const current = rolePermissions[role] || [];
    const next = current.includes(moduleKey)
      ? current.filter((m) => m !== moduleKey)
      : [...current, moduleKey];

    setRolePermissions({
      ...rolePermissions,
      [role]: next,
    });
  }

  async function saveRolePermission(role: string) {
    setError(null);
    try {
      const modules = rolePermissions[role] || [];
      await updateRolePermissionRequest(role, modules);
      setSuccessMsg(`Permissions for role ${role} saved successfully`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role permission");
    }
  }

  async function handleUserUpdate(
    userId: string,
    updates: { fullName?: string; role?: string; branchId?: string; isActive?: boolean }
  ) {
    setError(null);
    try {
      const updated = await updateUserRequest(userId, updates);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
      setSuccessMsg("User account updated");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createUserRequest({
        username: newUserForm.username.trim(),
        password: newUserForm.password,
        fullName: newUserForm.fullName.trim(),
        role: newUserForm.role,
        branchId: newUserForm.branchId || undefined,
        isActive: newUserForm.isActive,
      });

      setSuccessMsg(`User ${newUserForm.username} created successfully`);
      setShowCreateModal(false);
      setNewUserForm({
        username: "",
        password: "",
        fullName: "",
        role: "CASHIER",
        branchId: "",
        isActive: true,
      });
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    }
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Main Admin — Roles & User Authorizations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Production Control Center for System Roles, User Accounts, Branch Scope, and Module Access Matrix
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("MATRIX")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "MATRIX" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Role Module Matrix
          </button>

          <button
            onClick={() => setActiveTab("USERS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "USERS" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            User Accounts & Roles ({users.length})
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

      {/* TAB 1: EDITABLE ROLE MODULE MATRIX */}
      {activeTab === "MATRIX" && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-2xl text-xs space-y-1">
            <p className="font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              Live Role-Based Module Access Control
            </p>
            <p className="text-indigo-800/80">
              Main Admin can toggle permitted system modules per role. Clicking <strong>Save</strong> updates the PostgreSQL database in real-time.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading role permissions matrix...</div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 sticky left-0 bg-slate-100 z-10 w-48">System Module</th>
                      {ALL_ROLES.map((role) => (
                        <th key={role} className="px-4 py-3.5 text-center min-w-[120px]">
                          <div className="font-bold text-slate-900">{role}</div>
                          <button
                            onClick={() => saveRolePermission(role)}
                            className="mt-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center justify-center gap-1 mx-auto"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {MODULE_LIST.map((mod) => (
                      <tr key={mod.key} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900 sticky left-0 bg-white shadow-sm">
                          <div>{locale === "ar" ? mod.labelAr : mod.labelEn}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{mod.key}</div>
                        </td>

                        {ALL_ROLES.map((role) => {
                          const isChecked = (rolePermissions[role] || []).includes(mod.key);
                          const isAdminRole = role === "ADMIN";

                          return (
                            <td key={role} className="px-4 py-3 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  disabled={isAdminRole}
                                  checked={isAdminRole ? true : isChecked}
                                  onChange={() => toggleModulePermission(role, mod.key)}
                                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS & EDITABLE ROLES */}
      {activeTab === "USERS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Production User Directory & Role Assignments</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Create New User
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Branch Boundary</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Discount Limit</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div>
                        <input
                          type="text"
                          defaultValue={u.fullName}
                          onBlur={(e) => handleUserUpdate(u.id, { fullName: e.target.value })}
                          className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-none"
                        />
                        <div className="text-[11px] text-slate-400">@{u.username}</div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUserUpdate(u.id, { role: e.target.value })}
                        className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                      >
                        {ALL_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={u.branchId || ""}
                        onChange={(e) => handleUserUpdate(u.id, { branchId: e.target.value || undefined })}
                        className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 max-w-[180px]"
                      >
                        <option value="">Head Office (All Branches)</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.code})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={u.isActive}
                          onChange={(e) => handleUserUpdate(u.id, { isActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        <span className="ml-2 text-xs font-medium text-slate-600">
                          {u.isActive ? "Active" : "Disabled"}
                        </span>
                      </label>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-indigo-700">
                        {u.discountPermission ? `${u.discountPermission.maxDiscountPercent}%` : "10% (Default)"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-[11px] text-slate-400">Auto-persisted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Create Production User Account</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ali_cashier"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Ahmed"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Boundary</label>
                  <select
                    value={newUserForm.branchId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, branchId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="">Head Office (All)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
