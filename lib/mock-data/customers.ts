import type { Customer, BrandId } from "@/lib/types";

/**
 * STAGE 1 SAMPLE DATA
 * TEMP: Customer type (lib/types/index.ts) does not yet have a brandId field.
 * Extending locally here until confirmed whether a B2B portal customer belongs
 * to ONE brand or can transact across multiple brands. Ask client.
 * TEMP: no phone/email fields yet — unconfirmed whether portal needs contact info.
 * TEMP: no order-history data yet — out of scope for this file, orders TBD.
 */
export interface B2BCustomer extends Customer {
  brandId: BrandId; // TEMP local extension, not yet in shared Customer type
}

export const customers: B2BCustomer[] = [
  {
    id: "cust-001",
    nameEn: "Al Sultan Trading Co.",
    nameAr: "شركة السلطان التجارية",
    customerType: "wholesale",
    balanceKd: 1250.5,
    creditLimitKd: 5000,
    brandId: "smoking",
  },
  {
    id: "cust-002",
    nameEn: "Marina Gear Kuwait",
    nameAr: "مارينا جير الكويت",
    customerType: "b2b_portal",
    balanceKd: 320,
    creditLimitKd: 2000,
    brandId: "khiran",
  },
  {
    id: "cust-003",
    nameEn: "Gulf Gifts & Signage LLC",
    nameAr: "خليج الهدايا واللافتات",
    customerType: "b2b_portal",
    balanceKd: 0,
    creditLimitKd: 1500,
    brandId: "jmart",
  },
  {
    id: "cust-004",
    nameEn: "Ahmad Retail Shop",
    nameAr: "متجر أحمد للتجزئة",
    customerType: "retail",
    balanceKd: 45.75,
    creditLimitKd: 500,
    brandId: "smoking",
  },
];
