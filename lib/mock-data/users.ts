import { User } from "@/lib/types";

// One sample user per role, for Stage 1 role-based landing demo.
// No real auth yet — login screen will just let you "sign in as" one of these.
export const users: User[] = [
  {
    id: "u-001",
    nameEn: "Ahmad Al-Bin Essa",
    nameAr: "أحمد بن عيسى",
    role: "admin",
    branchId: null,
  },
  {
    id: "u-002",
    nameEn: "Fahad Al-Mutairi",
    nameAr: "فهد المطيري",
    role: "branch_manager",
    branchId: "br-01",
  },
  {
    id: "u-003",
    nameEn: "Priya Nair",
    nameAr: "بريا نايير",
    role: "accountant",
    branchId: null,
  },
  {
    id: "u-004",
    nameEn: "Ravi Kumar",
    nameAr: "رافي كومار",
    role: "cashier",
    branchId: "br-02",
  },
  {
    id: "u-005",
    nameEn: "Suresh Menon",
    nameAr: "سوريش مينون",
    role: "storekeeper",
    branchId: "br-03",
  },
  {
    id: "u-006",
    nameEn: "Yousef Al-Ajmi",
    nameAr: "يوسف العجمي",
    role: "sales_rep",
    branchId: "br-08",
  },
];