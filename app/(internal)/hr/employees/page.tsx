"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Users, Building2, DollarSign, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import {
  listEmployeesRequest,
  createEmployeeRequest,
  listBranchesRequest,
  type EmployeeRecord,
  type BranchRecord,
} from "@/lib/api";

function formatKD(amount: number | string | undefined) {
  const num = Number(amount) || 0;
  return num.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function EmployeesPage() {
  const { locale, t } = useLocale();
  const { currentBrand, currentBranch, isHeadOffice } = useSession();
  const isAr = locale === "ar";

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [civilId, setCivilId] = useState("");
  const [position, setPosition] = useState("Storekeeper");
  const [department, setDepartment] = useState("Operations");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [basicSalary, setBasicSalary] = useState(350);
  const [housingAllowance, setHousingAllowance] = useState(50);
  const [transportAllowance, setTransportAllowance] = useState(25);
  const [otherAllowances, setOtherAllowances] = useState(0);
  const [hireDate, setHireDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const branchId = !isHeadOffice && currentBranch ? currentBranch.id : undefined;
      const [empData, brData] = await Promise.all([
        listEmployeesRequest(branchId),
        listBranchesRequest(),
      ]);
      setEmployees(empData || []);
      setBranches(brData || []);
      if (brData && brData.length > 0 && !selectedBranchId) {
        setSelectedBranchId(brData[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load employee directory");
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch, isHeadOffice, selectedBranchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleOpenCreateModal() {
    setCode(`EMP-${Date.now().toString().slice(-4)}`);
    setName("");
    setCivilId("");
    setPosition("Storekeeper");
    setDepartment("Operations");
    if (branches.length > 0) {
      setSelectedBranchId(currentBranch?.id || branches[0].id);
    }
    setBasicSalary(350);
    setHousingAllowance(50);
    setTransportAllowance(25);
    setOtherAllowances(0);
    setHireDate(new Date().toISOString().slice(0, 10));
    setIsModalOpen(true);
  }

  async function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createEmployeeRequest({
        code: code.trim(),
        name: name.trim(),
        civilId: civilId.trim() || undefined,
        position,
        department,
        branchId: selectedBranchId || undefined,
        basicSalary: Number(basicSalary) || 0,
        housingAllowance: Number(housingAllowance) || 0,
        transportAllowance: Number(transportAllowance) || 0,
        otherAllowances: Number(otherAllowances) || 0,
        hireDate,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to register employee");
    } finally {
      setIsSubmitting(false);
    }
  }

  const departments = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));

  const filteredEmployees = employees.filter((emp) => {
    if (departmentFilter !== "all" && emp.department !== departmentFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.code?.toLowerCase().includes(q) ||
      emp.position?.toLowerCase().includes(q) ||
      (emp.civilId && emp.civilId.includes(q))
    );
  });

  const totalPayrollBudget = employees.reduce(
    (sum, e) =>
      sum +
      (Number(e.basicSalary) || 0) +
      (Number(e.housingAllowance) || 0) +
      (Number(e.transportAllowance) || 0) +
      (Number(e.otherAllowances) || 0),
    0
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink">
              {isAr ? "دليل الموظفين وسجلات الكادر" : "Employee Master Directory"}
            </h1>
            <span className="rounded-full bg-slate-900 text-[#FDCE0C] px-2.5 py-0.5 text-xs font-bold">
              {employees.length} {isAr ? "موظف مسجل" : "Staff Active"}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/60">
            {isAr
              ? "إدارة بيانات الموظفين، الرواتب الأساسية والبدلات، والربط مع الفروع ومسير الرواتب الآلي."
              : "Enterprise human resources records, position grading, salary packages, and branch staffing governance."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-[#FDCE0C] shadow-sm hover:bg-slate-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>{isAr ? "+ تسجيل موظف جديد" : "+ Register New Employee"}</span>
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "إجمالي الكادر الوظيفي" : "Active Staff Headcount"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-slate-900">{employees.length}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "إجمالي مسير الرواتب الشهري" : "Monthly Payroll Commitment"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-slate-900">
            {formatKD(totalPayrollBudget)} <span className="text-xs font-semibold text-slate-500">KD</span>
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isAr ? "الأقسام التشغيلية" : "Operational Departments"}
          </p>
          <p className="numeric-ltr mt-1 text-2xl font-black text-slate-900">
            {departments.length || 1}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-ink/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? "بحث بالاسم، الكود، المسمى الوظيفي، أو الرقم المدني..." : "Search by name, code, position, or civil ID..."}
            className="w-full rounded-xl border border-ink/10 bg-white ps-10 pe-4 py-2.5 text-xs shadow-2xs outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-xs shadow-2xs outline-none focus:border-amber-500 sm:w-56"
        >
          <option value="all">{isAr ? "جميع الأقسام" : "All Departments"}</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-2xs">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ink/10 bg-slate-50 text-slate-600">
              <th className="px-4 py-3 text-start font-bold">{isAr ? "كود الموظف" : "Employee Code"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "الاسم الكامل" : "Full Name"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "المسمى الوظيفي" : "Position"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "القسم" : "Department"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "الفرع" : "Branch"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "الراتب الأساسي" : "Basic Salary"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "إجمالي البدلات" : "Allowances"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "الصافي المستحق" : "Total Package"}</th>
              <th className="px-4 py-3 text-start font-bold">{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500 font-semibold">
                  {isAr ? "جاري تحميل سجلات الكادر الوظيفي..." : "Loading employee records from live database..."}
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                  <Users className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="font-bold">{isAr ? "لا توجد سجلات موظفين مطابقة" : "No employee records found"}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAr ? "انقر على تسجيل موظف جديد لإنشاء بطاقة كادر جديدة." : "Click register new employee to record an employee profile."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const allowances =
                  (Number(emp.housingAllowance) || 0) +
                  (Number(emp.transportAllowance) || 0) +
                  (Number(emp.otherAllowances) || 0);
                const total = (Number(emp.basicSalary) || 0) + allowances;

                return (
                  <tr key={emp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{emp.code}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div>{emp.name}</div>
                      {emp.civilId && (
                        <div className="text-[10px] text-slate-400">Civil ID: {emp.civilId}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{emp.position}</td>
                    <td className="px-4 py-3 text-slate-600">{emp.department}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {emp.branch?.name || (isAr ? "المكتب الرئيسي" : "Head Office")}
                    </td>
                    <td className="numeric-ltr px-4 py-3 font-semibold text-slate-900">
                      {formatKD(emp.basicSalary)} KD
                    </td>
                    <td className="numeric-ltr px-4 py-3 text-slate-600">{formatKD(allowances)} KD</td>
                    <td className="numeric-ltr px-4 py-3 font-black text-emerald-700">{formatKD(total)} KD</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        {isAr ? "نشط" : "Active"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              {isAr ? "تسجيل موظف جديد في الكادر" : "Register New Employee"}
            </h2>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "كود الموظف *" : "Employee Code *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "الرقم المدني (Civil ID)" : "Civil ID Number"}
                  </label>
                  <input
                    type="text"
                    value={civilId}
                    onChange={(e) => setCivilId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isAr ? "الاسم الكامل *" : "Full Legal Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Al-Mansoor"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "المسمى الوظيفي *" : "Position / Role *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "القسم *" : "Department *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "الفرع المخصص" : "Assigned Branch"}
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  >
                    <option value="">{isAr ? "المكتب الرئيسي" : "Head Office"}</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? "تاريخ التعيين" : "Hire Date"}
                  </label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Salary Structure */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-800 mb-2">
                  {isAr ? "هيكل الراتب والبدلات (KWD)" : "Salary & Allowance Structure (KWD)"}
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Basic Salary</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      required
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Housing</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={housingAllowance}
                      onChange={(e) => setHousingAllowance(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Transport</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={transportAllowance}
                      onChange={(e) => setTransportAllowance(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
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
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-[#FDCE0C] hover:bg-slate-800"
                >
                  {isSubmitting ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ الموظف" : "Save Employee")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
