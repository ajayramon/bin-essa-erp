// STAGE 1 — sales invoice types. NOT client-confirmed shape.
// Built ad-hoc to unblock: invoice creation -> inventory update -> journal auto-post.
// Flag for client review: invoice numbering scheme, tax/VAT handling, walk-in customer rules,
// void/return flow (not implemented).

import type { BrandId } from "./index";

export interface SalesInvoiceLine {
  itemId: string;
  quantity: number;
  unitPriceKd: number;
  discountKd: number;
  lineTotalKd: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string; // TEMP: plain string, no confirmed numbering format
  brandId: BrandId;
  branchId: string;
  customerId: string | null; // null = walk-in retail sale
  date: string; // ISO date string
  lines: SalesInvoiceLine[];
  subtotalKd: number;
  discountKd: number;
  taxKd: number; // TEMP: placeholder, VAT applicability not confirmed by client
  totalKd: number;
  paymentMethod: "cash" | "card" | "knet" | "online";
  amountPaidKd: number;
  status: "draft" | "posted" | "void";
  createdByUserId: string;
  journalEntryId: string | null; // set once journal entry auto-posts
}
