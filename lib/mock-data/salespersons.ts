export interface Salesperson {
  id: string;
  nameEn: string;
  nameAr: string;
  code: string;
  branchId: string | null;
}

export const salespersons: Salesperson[] = [
  { id: "sp-01", nameEn: "Mohamed Ali", nameAr: "محمد علي", code: "SP-001", branchId: "br-01" },
  { id: "sp-02", nameEn: "Yousef Al-Ajmi", nameAr: "يوسف العجمي", code: "SP-002", branchId: "br-01" },
  { id: "sp-03", nameEn: "Ahmed Mansour", nameAr: "أحمد منصور", code: "SP-003", branchId: "br-02" },
  { id: "sp-04", nameEn: "Suresh Menon", nameAr: "سوريش مينون", code: "SP-004", branchId: "br-03" },
  { id: "sp-05", nameEn: "Ali Bin Essa", nameAr: "علي بن عيسى", code: "SP-005", branchId: null },
];
