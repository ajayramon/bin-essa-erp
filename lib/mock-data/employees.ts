import { Employee } from "@/lib/types";

// STAGE 1 SAMPLE DATA — realistic placeholder staff list only.
// Salary/allowance figures are placeholders, not client-confirmed payroll data.
export const employees: Employee[] = [
  { id: "emp-01", nameEn: "Mohammed Al-Bin Essa", nameAr: "محمد البن عيسى", role: "admin", brandId: "smoking", branchId: null, phone: "+965 6000 1001", joinDate: "2019-01-15", basicSalaryKd: 900, allowancesKd: 150, status: "active" },
  { id: "emp-02", nameEn: "Fahad Al-Mutairi", nameAr: "فهد المطيري", role: "branch_manager", brandId: "smoking", branchId: "br-01", phone: "+965 6000 1002", joinDate: "2020-03-10", basicSalaryKd: 500, allowancesKd: 80, status: "active" },
  { id: "emp-03", nameEn: "Rajesh Kumar", nameAr: "راجيش كومار", role: "cashier", brandId: "smoking", branchId: "br-01", phone: "+965 6000 1003", joinDate: "2021-06-01", basicSalaryKd: 220, allowancesKd: 30, status: "active" },
  { id: "emp-04", nameEn: "Suresh Nair", nameAr: "سوريش نائر", role: "cashier", brandId: "smoking", branchId: "br-02", phone: "+965 6000 1004", joinDate: "2021-09-12", basicSalaryKd: 220, allowancesKd: 30, status: "active" },
  { id: "emp-05", nameEn: "Anoop Menon", nameAr: "أنوب مينون", role: "storekeeper", brandId: "smoking", branchId: "br-08", phone: "+965 6000 1005", joinDate: "2020-11-20", basicSalaryKd: 260, allowancesKd: 40, status: "active" },
  { id: "emp-06", nameEn: "Yousef Al-Ajmi", nameAr: "يوسف العجمي", role: "sales_rep", brandId: "smoking", branchId: "br-09", phone: "+965 6000 1006", joinDate: "2022-02-01", basicSalaryKd: 250, allowancesKd: 60, status: "active" },
  { id: "emp-07", nameEn: "Latifa Al-Sabah", nameAr: "لطيفة الصباح", role: "accountant", brandId: "smoking", branchId: null, phone: "+965 6000 1007", joinDate: "2020-07-01", basicSalaryKd: 480, allowancesKd: 70, status: "active" },
  { id: "emp-08", nameEn: "Bijoy Thomas", nameAr: "بيجوي توماس", role: "cashier", brandId: "smoking", branchId: "br-13", phone: "+965 6000 1008", joinDate: "2023-01-10", basicSalaryKd: 220, allowancesKd: 30, status: "active" },
  { id: "emp-09", nameEn: "Sanjay Pillai", nameAr: "سانجاي بيلاي", role: "branch_manager", brandId: "khiran", branchId: "br-15", phone: "+965 6000 1009", joinDate: "2021-04-05", basicSalaryKd: 500, allowancesKd: 80, status: "active" },
  { id: "emp-10", nameEn: "Dana Al-Fadhli", nameAr: "دانة الفضلي", role: "sales_rep", brandId: "khiran", branchId: "br-15", phone: "+965 6000 1010", joinDate: "2022-08-15", basicSalaryKd: 250, allowancesKd: 50, status: "active" },
  { id: "emp-11", nameEn: "Ahmad Al-Rashidi", nameAr: "أحمد الرشيدي", role: "branch_manager", brandId: "jmart", branchId: "br-16", phone: "+965 6000 1011", joinDate: "2021-10-01", basicSalaryKd: 500, allowancesKd: 80, status: "active" },
  { id: "emp-12", nameEn: "Priya Varma", nameAr: "بريا فارما", role: "cashier", brandId: "jmart", branchId: "br-16", phone: "+965 6000 1012", joinDate: "2022-05-20", basicSalaryKd: 220, allowancesKd: 30, status: "active" },
  { id: "emp-13", nameEn: "Naser Al-Enezi", nameAr: "ناصر العنزي", role: "sales_rep", brandId: "jmart", branchId: "br-17", phone: "+965 6000 1013", joinDate: "2023-03-01", basicSalaryKd: 250, allowancesKd: 50, status: "active" },
  { id: "emp-14", nameEn: "Deepak Menon", nameAr: "ديباك مينون", role: "storekeeper", brandId: "smoking", branchId: "br-04", phone: "+965 6000 1014", joinDate: "2019-12-01", basicSalaryKd: 260, allowancesKd: 40, status: "inactive" },
];
