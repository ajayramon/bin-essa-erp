const API_BASE = "https://bin-essa-erp.onrender.com";

const apiCache = new Map<string, { data: any; expiresAt: number }>();

export function clearApiCache() {
  apiCache.clear();
}

async function fetchWithCache<T>(url: string, init?: RequestInit, ttlMs = 10000): Promise<T> {
  const cacheKey = `${init?.method || 'GET'}:${url}`;
  const now = Date.now();

  if ((!init?.method || init.method === 'GET') && apiCache.has(cacheKey)) {
    const entry = apiCache.get(cacheKey)!;
    if (entry.expiresAt > now) {
      return entry.data;
    }
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Request failed");
  }
  const data = await res.json();

  if (!init?.method || init.method === 'GET') {
    apiCache.set(cacheKey, { data, expiresAt: now + ttlMs });
  }

  return data;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    branchId: string | null;
  };
}

export async function loginRequest(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Login failed");
  }
  return res.json();
}

export type ItemCategory =
  | "TOBACCO"
  | "ACCESSORIES"
  | "ELECTRONICS"
  | "ART_SUPPLIES"
  | "OTHER";

export type ItemVisibility = "ALL_BRANCHES" | "SPECIFIC_BRANCHES";

export interface CreateItemPayload {
  sku: string;
  barcode?: string;
  name: string;
  category: ItemCategory;
  visibility?: ItemVisibility;
  price: number;
  cost: number;
  unit?: string;
  isActive?: boolean;
  stockQuantity?: number;
}

export interface CreateItemResponse {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  category: ItemCategory;
  visibility: ItemVisibility;
  price: string;
  cost: string;
  unit: string;
  isActive: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export async function createItemRequest(
  payload: CreateItemPayload
): Promise<CreateItemResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to create item");
  }
  clearApiCache();
  return res.json();
}

export interface CreateCustomerPayload {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  branchId?: string;
}

export interface CreateCustomerResponse {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  branchId: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createCustomerRequest(
  payload: CreateCustomerPayload
): Promise<CreateCustomerResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to create customer");
  }
  clearApiCache();
  return res.json();
}

export interface CreateSupplierPayload {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  branchId?: string;
}

export interface CreateSupplierResponse {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  branchId: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createSupplierRequest(
  payload: CreateSupplierPayload
): Promise<CreateSupplierResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to create supplier");
  }
  clearApiCache();
  return res.json();
}

export interface AccountResponse {
  id: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
}

export async function getAccountsRequest(): Promise<AccountResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/accounts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load accounts");
  }
  return res.json();
}

export interface CreateJournalEntryLinePayload {
  accountId: string;
  debit: number;
  credit: number;
}

export interface CreateJournalEntryPayload {
  date: string;
  description: string;
  lines: CreateJournalEntryLinePayload[];
}

export interface JournalEntryLineResponse {
  id: string;
  journalEntryId: string;
  accountId: string;
  debit: string;
  credit: string;
}

export interface CreateJournalEntryResponse {
  id: string;
  reference: string;
  date: string;
  description: string;
  status: "DRAFT" | "POSTED";
  branchId: string | null;
  salesInvoiceId: string | null;
  lines: JournalEntryLineResponse[];
}

export async function createJournalEntryRequest(
  payload: CreateJournalEntryPayload
): Promise<CreateJournalEntryResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/journal-entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to create journal entry");
  }
  clearApiCache();
  return res.json();
}

export interface TrialBalanceRow {
  accountId: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  debit: number;
  credit: number;
}

export interface TrialBalanceResponse {
  rows: TrialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export async function getTrialBalanceRequest(): Promise<TrialBalanceResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/trial-balance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load trial balance");
  }
  return res.json();
}

export interface LedgerEntry {
  journalEntryId: string;
  reference: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface AccountLedgerResponse {
  account: {
    id: string;
    code: string;
    name: string;
    type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  };
  entries: LedgerEntry[];
}

export async function getAccountLedgerRequest(
  accountId: string
): Promise<AccountLedgerResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/accounts/${accountId}/ledger`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load account ledger");
  }
  return res.json();
}
export type ItemResponse = CreateItemResponse;

export async function listItemsRequest(): Promise<ItemResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/items`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load items");
  }
  return res.json();
}

export async function updateItemRequest(
  id: string,
  payload: Partial<CreateItemPayload>
): Promise<ItemResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to update item");
  }
  clearApiCache();
  return res.json();
}

export async function deleteItemRequest(id: string): Promise<void> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to delete item");
  }
  clearApiCache();
}

export type SupplierResponse = CreateSupplierResponse;

export async function listSuppliersRequest(): Promise<SupplierResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/suppliers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load suppliers");
  }
  return res.json();
}

export interface PurchaseOrderLinePayload {
  itemId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseOrderPayload {
  poNumber: string;
  supplierId: string;
  branchId: string;
  taxAmount?: number;
  lines: PurchaseOrderLinePayload[];
}

export interface PurchaseOrderResponse {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  branchId: string;
  status: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  supplier?: SupplierResponse;
  lines?: {
    id: string;
    itemId: string;
    quantity: string;
    unitCost: string;
    lineTotal: string;
    item?: ItemResponse;
  }[];
}

export async function createPurchaseOrderRequest(
  payload: CreatePurchaseOrderPayload
): Promise<PurchaseOrderResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/purchase-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to create purchase order");
  }
  clearApiCache();
  return res.json();
}

export async function listPurchaseOrdersRequest(): Promise<PurchaseOrderResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/purchase-orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load purchase orders");
  }
  return res.json();
}

export interface SalesInvoiceLinePayload {
  itemId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalesInvoicePayload {
  invoiceNumber: string;
  customerId?: string;
  branchId: string;
  userId: string;
  paymentMethod: "CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER";
  taxAmount?: number;
  lines: SalesInvoiceLinePayload[];
}

export interface SalesInvoiceResponse {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string | null;
  branchId: string;
  userId: string;
  paymentMethod: string;
  status: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
  createdAt: string;
  lines?: {
    id: string;
    itemId: string;
    quantity: string;
    unitPrice: string;
    lineTotal: string;
    item?: ItemResponse;
  }[];
}

export async function createSalesInvoiceRequest(
  payload: CreateSalesInvoicePayload
): Promise<SalesInvoiceResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/sales-invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to create sales invoice");
  }
  clearApiCache();
  return res.json();
}

export async function listSalesInvoicesRequest(): Promise<SalesInvoiceResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/sales-invoices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to load sales invoices");
  }
  return res.json();
}

