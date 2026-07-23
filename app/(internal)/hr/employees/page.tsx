"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useSession } from "@/lib/context/SessionContext";
import { employees } from "@/lib/mock-data/employees";
import { branches } from "@/lib/mock-data/branches";
import type { Role } from "@/lib/types";

function formatKD(amount: number) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export default function EmployeesPage() {
  const { locale, t } = useLocale();
  const { currentBrand, currentBranch } = useSession();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  function branchLabel(branchId: string | null): string {
    if (!branchId) return t.employees.headOffice;
    const b = branches.find((br) => br.id === branchId);
    if (!b) return branchId;
    return locale === "ar" ? b.nameAr : b.nameEn;
  }

  const brandEmployees = currentBrand
    ? employees.filter((e) => e.brandId === currentBrand.id)
    : [];

  const branchScoped = currentBranch
    ? brandEmployees.filter((e) => e.branchId === currentBranch.id)
    : brandEmployees;

  const roles = Array.from(new Set(brandEmployees.map((e) => e.role)));

  const filteredEmployees = branchScoped.filter((emp) => {
    if (roleFilter !== "all" && emp.role !== roleFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      emp.nameEn.toLowerCase().includes(q) ||
      emp.nameAr.includes(q) ||
      emp.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.employees.title}</h1>
        <p className="mt-1 text-ink/60">{t.employees.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.employees.searchPlaceholder}
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold sm:w-64"
        >
          <option value="all">{t.employees.allRoles}</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {t.roles[r]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-ink/50">
              <th className="px-4 py-3 text-start font-medium">{t.employees.title}</th>
              <th className="px-4 py-3 text-start font-medium">{t.employees.role}</th>
              <th className="px-4 py-3 text-start font-medium">{t.employees.branch}</th>
              <th className="px-4 py-3 text-start font-medium">{t.employees.phone}</th>
              <th className="px-4 py-3 text-start font-medium">{t.employees.basicSalary}</th>
              <th className="px-4 py-3 text-start font-medium">{t.employees.status}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                <td className="px-4 py-3 font-medium text-ink">
                  {locale === "ar" ? emp.nameAr : emp.nameEn}
                </td>
                <td className="px-4 py-3 text-ink/70">{t.roles[emp.role]}</td>
                <td className="px-4 py-3 text-ink/70">{branchLabel(emp.branchId)}</td>
                <td className="numeric-ltr px-4 py-3 text-ink/60">{emp.phone}</td>
                <td className="numeric-ltr px-4 py-3 text-ink">{formatKD(emp.basicSalaryKd)} KD</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-lg px-2 py-1 text-xs font-medium ${
                      emp.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {emp.status === "active" ? t.employees.active : t.employees.inactive}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmployees.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">{t.employees.noResults}</p>
        )}
      </div>
    </div>
  );
}
