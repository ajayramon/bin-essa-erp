const API_BASE = "https://bin-essa-erp.onrender.com";

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
  return res.json();
}