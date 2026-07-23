import { Role } from "@/lib/types";

// STAGE 1 SAMPLE DATA — unconfirmed role/module mapping.
// This is a first-pass guess for which roles can access which modules,
// for client review. Read-only display only — not a permissions editor.
// Module keys mirror the keys used in lib/mock-data/nav.ts.

export type ModuleKey =
  | "dashboard"
  | "groupDashboard"
  | "pos"
  | "inventory"
  | "purchasing"
  | "accounting"
  | "hr"
  | "b2b"
  | "settings";

export interface RolePermission {
  role: Role;
  modules: ModuleKey[];
}

export const rolePermissions: RolePermission[] = [
  {
    role: "admin",
    modules: [
      "dashboard",
      "groupDashboard",
      "pos",
      "inventory",
      "purchasing",
      "accounting",
      "hr",
      "b2b",
      "settings",
    ],
  },
  {
    role: "branch_manager",
    modules: ["dashboard", "pos", "inventory", "purchasing", "hr", "b2b"],
  },
  {
    role: "accountant",
    modules: ["dashboard", "accounting"],
  },
  {
    role: "cashier",
    modules: ["dashboard", "pos"],
  },
  {
    role: "storekeeper",
    modules: ["dashboard", "inventory", "purchasing"],
  },
  {
    role: "sales_rep",
    modules: ["dashboard", "pos", "b2b"],
  },
];
