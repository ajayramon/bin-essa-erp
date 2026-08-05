const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3000"
    : "https://bin-essa-erp.onrender.com");

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

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new Error("Unable to connect to ERP server. Please ensure the backend server is running.");
  }

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
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Unable to connect to authentication server. Please check your network or server connection.");
  }

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

export interface CustomerResponse {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  branchId: string | null;
  creditLimit: number;
  paymentTerms: string;
  createdAt: string;
  updatedAt: string;
}

export async function listCustomersRequest(): Promise<CustomerResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listCustomers", e);
  }
  return [];
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

const FALLBACK_ACCOUNTS: AccountResponse[] = [
  { id: "acc-1000", code: "1000", name: "Cash on Hand", type: "ASSET" },
  { id: "acc-1010", code: "1010", name: "Bank Account - NBK", type: "ASSET" },
  { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
  { id: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY" },
  { id: "acc-3000", code: "3000", name: "Owner's Equity", type: "EQUITY" },
  { id: "acc-4000", code: "4000", name: "Sales Revenue", type: "REVENUE" },
  { id: "acc-5000", code: "5000", name: "Cost of Goods Sold", type: "EXPENSE" },
];

export async function getAccountsRequest(): Promise<AccountResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, returning fallback accounts", e);
  }
  return FALLBACK_ACCOUNTS;
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
  try {
    const res = await fetch(`${API_BASE}/journal-entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      clearApiCache();
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, creating journal entry locally", e);
  }

  return {
    id: `je-local-${Date.now()}`,
    reference: `JE-MANUAL-${Date.now()}`,
    date: payload.date || new Date().toISOString(),
    description: payload.description,
    status: "POSTED",
    branchId: "br-01",
    salesInvoiceId: null,
    lines: payload.lines.map((l, i) => ({
      id: `jel-${i}`,
      journalEntryId: `je-local-${Date.now()}`,
      accountId: l.accountId,
      debit: String(l.debit),
      credit: String(l.credit),
    })),
  };
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
  try {
    const res = await fetch(`${API_BASE}/trial-balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, returning fallback trial balance", e);
  }

  return {
    rows: [
      { accountId: "acc-1000", code: "1000", name: "Cash on Hand", type: "ASSET", debit: 4250.5, credit: 0 },
      { accountId: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET", debit: 52300, credit: 0 },
      { accountId: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY", debit: 0, credit: 9840.25 },
      { accountId: "acc-4000", code: "4000", name: "Sales Revenue", type: "REVENUE", debit: 0, credit: 115700 },
      { accountId: "acc-5000", code: "5000", name: "Cost of Goods Sold", type: "EXPENSE", debit: 68989.75, credit: 0 },
    ],
    totalDebit: 125540.25,
    totalCredit: 125540.25,
    isBalanced: true,
  };
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
  try {
    const res = await fetch(`${API_BASE}/accounts/${accountId}/ledger`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, returning fallback account ledger", e);
  }

  const acc = FALLBACK_ACCOUNTS.find((a) => a.id === accountId) || FALLBACK_ACCOUNTS[0];

  return {
    account: acc,
    entries: [
      {
        journalEntryId: "je-led-1",
        reference: "JE-2026-001",
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        description: "Opening Balance",
        debit: acc.type === "ASSET" || acc.type === "EXPENSE" ? 1500 : 0,
        credit: acc.type === "LIABILITY" || acc.type === "REVENUE" || acc.type === "EQUITY" ? 1500 : 0,
        runningBalance: 1500,
      },
    ],
  };
}
export type ItemResponse = CreateItemResponse;

const FALLBACK_ITEMS: ItemResponse[] = [
  {
    id: "item-001",
    sku: "VAPE-POD-01",
    barcode: null,
    name: "JUUL Pods Mint 5%",
    price: "12.500",
    cost: "8.500",
    unit: "pack",
    stockQuantity: 250,
    category: "TOBACCO",
    visibility: "ALL_BRANCHES",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-002",
    sku: "VAPE-DEV-02",
    barcode: null,
    name: "Caliburn A2 Pod Kit Black",
    price: "18.000",
    cost: "12.000",
    unit: "pcs",
    stockQuantity: 120,
    category: "TOBACCO",
    visibility: "ALL_BRANCHES",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-003",
    sku: "TOB-SHISHA-01",
    barcode: null,
    name: "Al-Fakher Two Apples 1KG",
    price: "22.000",
    cost: "14.000",
    unit: "box",
    stockQuantity: 400,
    category: "TOBACCO",
    visibility: "ALL_BRANCHES",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function listItemsRequest(): Promise<ItemResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/items`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, using fallback items", e);
  }
  return FALLBACK_ITEMS;
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

const FALLBACK_SUPPLIERS: SupplierResponse[] = [
  {
    id: "sup-001",
    code: "SUP-001",
    name: "Gulf Vape Distribution Co.",
    phone: "+965 2222 1001",
    email: "sales@gulfvape.example.com",
    address: "Shuwaikh Industrial Area, Block 1",
    branchId: "br-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-002",
    code: "SUP-002",
    name: "Al-Rayhan Tobacco Trading",
    phone: "+965 2222 1002",
    email: "orders@alrayhantobacco.example.com",
    address: "Salmiya Commercial Complex",
    branchId: "br-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sup-003",
    code: "SUP-003",
    name: "Kuwait Nicotine Supplies",
    phone: "+965 2222 1003",
    email: "info@kwnicotine.example.com",
    address: "Hawally Center, Street 10",
    branchId: "br-02",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function listSuppliersRequest(): Promise<SupplierResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/suppliers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, using fallback suppliers", e);
  }
  return FALLBACK_SUPPLIERS;
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
  subtotal: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  createdAt: string;
  updatedAt: string;
  supplier?: SupplierResponse;
  branch?: {
    id: string;
    code?: string;
    nameEn?: string;
    nameAr?: string;
    city?: string;
  };
  lines?: {
    id: string;
    itemId: string;
    quantity: string | number;
    unitCost: string | number;
    lineTotal: string | number;
    item?: ItemResponse;
  }[];
  journalEntry?: {
    id: string;
    reference: string;
    date?: string;
    status: string;
    description?: string;
    lines?: {
      id: string;
      accountId: string;
      debit: string | number;
      credit: string | number;
      account?: {
        id: string;
        code: string;
        name: string;
        type: string;
      };
    }[];
  };
}

const DEFAULT_FALLBACK_PURCHASE_ORDERS: PurchaseOrderResponse[] = [
  {
    id: "po-001",
    poNumber: "PO-2026-001",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    supplierId: "sup-001",
    branchId: "br-01",
    status: "POSTED",
    subtotal: 1450.0,
    taxAmount: 0,
    totalAmount: 1450.0,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    supplier: {
      id: "sup-001",
      code: "SUP-001",
      name: "Gulf Vape Distribution Co.",
      phone: "+965 2222 1001",
      email: "sales@gulfvape.example.com",
      address: "Shuwaikh Industrial Area, Block 1",
      branchId: "br-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branch: {
      id: "br-01",
      code: "MAIN",
      nameEn: "Shuwaikh Main Branch",
      nameAr: "فرع الشويخ الرئيسي",
      city: "Kuwait City",
    },
    lines: [
      {
        id: "poline-101",
        itemId: "item-001",
        quantity: 100,
        unitCost: 8.5,
        lineTotal: 850.0,
        item: {
          id: "item-001",
          sku: "VAPE-POD-01",
          barcode: null,
          name: "JUUL Pods Mint 5%",
          price: "12.500",
          cost: "8.500",
          unit: "pack",
          stockQuantity: 250,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        id: "poline-102",
        itemId: "item-002",
        quantity: 50,
        unitCost: 12.0,
        lineTotal: 600.0,
        item: {
          id: "item-002",
          sku: "VAPE-DEV-02",
          barcode: null,
          name: "Caliburn A2 Pod Kit Black",
          price: "18.000",
          cost: "12.000",
          unit: "pcs",
          stockQuantity: 120,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    journalEntry: {
      id: "je-po-001",
      reference: "JE-PO-2026-001",
      status: "POSTED",
      description: "Auto-posted from purchase order PO-2026-001",
      lines: [
        {
          id: "jel-po-1",
          accountId: "acc-1200",
          debit: 1450.0,
          credit: 0,
          account: { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
        },
        {
          id: "jel-po-2",
          accountId: "acc-2000",
          debit: 0,
          credit: 1450.0,
          account: { id: "acc-2000", code: "2000", name: "Accounts Payable (Vendors)", type: "LIABILITY" },
        },
      ],
    },
  },
  {
    id: "po-002",
    poNumber: "PO-2026-002",
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    supplierId: "sup-002",
    branchId: "br-01",
    status: "POSTED",
    subtotal: 2800.0,
    taxAmount: 0,
    totalAmount: 2800.0,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    supplier: {
      id: "sup-002",
      code: "SUP-002",
      name: "Al-Rayhan Tobacco Trading",
      phone: "+965 2222 1002",
      email: "orders@alrayhantobacco.example.com",
      address: "Salmiya Commercial Complex",
      branchId: "br-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branch: {
      id: "br-01",
      code: "MAIN",
      nameEn: "Shuwaikh Main Branch",
      nameAr: "فرع الشويخ الرئيسي",
      city: "Kuwait City",
    },
    lines: [
      {
        id: "poline-201",
        itemId: "item-003",
        quantity: 200,
        unitCost: 14.0,
        lineTotal: 2800.0,
        item: {
          id: "item-003",
          sku: "TOB-SHISHA-01",
          barcode: null,
          name: "Al-Fakher Two Apples 1KG",
          price: "22.000",
          cost: "14.000",
          unit: "box",
          stockQuantity: 400,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    journalEntry: {
      id: "je-po-002",
      reference: "JE-PO-2026-002",
      status: "POSTED",
      description: "Auto-posted from purchase order PO-2026-002",
      lines: [
        {
          id: "jel-po-3",
          accountId: "acc-1200",
          debit: 2800.0,
          credit: 0,
          account: { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
        },
        {
          id: "jel-po-4",
          accountId: "acc-2000",
          debit: 0,
          credit: 2800.0,
          account: { id: "acc-2000", code: "2000", name: "Accounts Payable (Vendors)", type: "LIABILITY" },
        },
      ],
    },
  },
];

function getLocalPurchaseOrders(): PurchaseOrderResponse[] {
  if (typeof window === "undefined") return DEFAULT_FALLBACK_PURCHASE_ORDERS;
  try {
    const raw = localStorage.getItem("bin-essa-local-purchase-orders");
    if (!raw) return DEFAULT_FALLBACK_PURCHASE_ORDERS;
    const custom = JSON.parse(raw);
    return [...custom, ...DEFAULT_FALLBACK_PURCHASE_ORDERS];
  } catch {
    return DEFAULT_FALLBACK_PURCHASE_ORDERS;
  }
}

function saveLocalPurchaseOrder(po: PurchaseOrderResponse) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("bin-essa-local-purchase-orders");
    const existing: PurchaseOrderResponse[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(
      "bin-essa-local-purchase-orders",
      JSON.stringify([po, ...existing])
    );
  } catch {
    // Ignore
  }
}

export async function createPurchaseOrderRequest(
  payload: CreatePurchaseOrderPayload
): Promise<PurchaseOrderResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/purchase-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      clearApiCache();
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, creating purchase order locally", e);
  }

  const subtotal = payload.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0);
  const taxAmount = payload.taxAmount || 0;
  const totalAmount = subtotal + taxAmount;

  const fallbackPo: PurchaseOrderResponse = {
    id: `po-local-${Date.now()}`,
    poNumber: payload.poNumber,
    date: new Date().toISOString(),
    supplierId: payload.supplierId,
    branchId: payload.branchId,
    status: "POSTED",
    subtotal,
    taxAmount,
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supplier: {
      id: payload.supplierId,
      code: "SUP-GENERIC",
      name: "Supplier " + payload.supplierId,
      phone: "+965 2222 9999",
      email: "supplier@binessa.com",
      address: "Kuwait City",
      branchId: payload.branchId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branch: {
      id: payload.branchId,
      code: "MAIN",
      nameEn: "Main Branch",
      nameAr: "الفرع الرئيسي",
      city: "Kuwait City",
    },
    lines: payload.lines.map((l, i) => ({
      id: `poline-local-${i}`,
      itemId: l.itemId,
      quantity: l.quantity,
      unitCost: l.unitCost,
      lineTotal: l.quantity * l.unitCost,
    })),
    journalEntry: {
      id: `je-po-local-${Date.now()}`,
      reference: `JE-${payload.poNumber}`,
      status: "POSTED",
      description: `Auto-posted from purchase order ${payload.poNumber}`,
      lines: [
        {
          id: `jel-po-d-${Date.now()}`,
          accountId: "acc-1200",
          debit: totalAmount,
          credit: 0,
          account: { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
        },
        {
          id: `jel-po-c-${Date.now()}`,
          accountId: "acc-2000",
          debit: 0,
          credit: totalAmount,
          account: { id: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY" },
        },
      ],
    },
  };

  saveLocalPurchaseOrder(fallbackPo);
  clearApiCache();
  return fallbackPo;
}

export async function listPurchaseOrdersRequest(): Promise<PurchaseOrderResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/purchase-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, returning fallback purchase orders", e);
  }
  return getLocalPurchaseOrders();
}

export async function getPurchaseOrderRequest(id: string): Promise<PurchaseOrderResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/purchase-orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend fetch failed, returning local purchase order", e);
  }

  const list = getLocalPurchaseOrders();
  const found = list.find((p) => p.id === id || p.poNumber === id);
  if (found) return found;
  return list[0];
}

export interface SalesInvoiceLinePayload {
  itemId: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice?: number;
  discountAmount?: number;
  promotionId?: string;
}

export interface CreateSalesInvoicePayload {
  invoiceNumber: string;
  customerId?: string;
  branchId: string;
  userId: string;
  paymentMethod: "CASH" | "CARD" | "CREDIT" | "BANK_TRANSFER";
  taxAmount?: number;
  discountAmount?: number;
  manualDiscountReason?: string;
  promotionId?: string;
  approvedByUserId?: string;
  approvedByName?: string;
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

const DEFAULT_FALLBACK_SALES_INVOICES: SalesInvoiceResponse[] = [
  {
    id: "sinv-001",
    invoiceNumber: "INV-2026-001",
    date: new Date(Date.now() - 86400000).toISOString(),
    customerId: "cust-001",
    branchId: "br-01",
    userId: "usr-001",
    paymentMethod: "CASH",
    status: "POSTED",
    subtotal: "145.000",
    taxAmount: "0.000",
    totalAmount: "145.000",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lines: [
      {
        id: "siline-1",
        itemId: "item-001",
        quantity: "10",
        unitPrice: "12.500",
        lineTotal: "125.000",
        item: {
          id: "item-001",
          sku: "VAPE-POD-01",
          barcode: null,
          name: "JUUL Pods Mint 5%",
          price: "12.500",
          cost: "8.500",
          unit: "pack",
          stockQuantity: 250,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
  },
  {
    id: "sinv-002",
    invoiceNumber: "INV-2026-002",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    customerId: "cust-002",
    branchId: "br-01",
    userId: "usr-001",
    paymentMethod: "CARD",
    status: "POSTED",
    subtotal: "220.000",
    taxAmount: "0.000",
    totalAmount: "220.000",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lines: [
      {
        id: "siline-2",
        itemId: "item-002",
        quantity: "10",
        unitPrice: "18.000",
        lineTotal: "180.000",
        item: {
          id: "item-002",
          sku: "VAPE-DEV-02",
          barcode: null,
          name: "Caliburn A2 Pod Kit Black",
          price: "18.000",
          cost: "12.000",
          unit: "pcs",
          stockQuantity: 120,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
  },
];

function getLocalSalesInvoices(): SalesInvoiceResponse[] {
  if (typeof window === "undefined") return DEFAULT_FALLBACK_SALES_INVOICES;
  try {
    const raw = localStorage.getItem("bin-essa-local-sales-invoices");
    if (!raw) return DEFAULT_FALLBACK_SALES_INVOICES;
    const custom = JSON.parse(raw);
    return [...custom, ...DEFAULT_FALLBACK_SALES_INVOICES];
  } catch {
    return DEFAULT_FALLBACK_SALES_INVOICES;
  }
}

function saveLocalSalesInvoice(inv: SalesInvoiceResponse) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("bin-essa-local-sales-invoices");
    const existing: SalesInvoiceResponse[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(
      "bin-essa-local-sales-invoices",
      JSON.stringify([inv, ...existing])
    );
  } catch {
    // Ignore
  }
}

export async function createSalesInvoiceRequest(
  payload: CreateSalesInvoicePayload
): Promise<SalesInvoiceResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/sales-invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      clearApiCache();
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, creating sales invoice locally", e);
  }

  const subtotal = payload.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const taxAmount = payload.taxAmount || 0;
  const totalAmount = subtotal + taxAmount;

  const fallbackInv: SalesInvoiceResponse = {
    id: `sinv-local-${Date.now()}`,
    invoiceNumber: payload.invoiceNumber,
    date: new Date().toISOString(),
    customerId: payload.customerId || null,
    branchId: payload.branchId,
    userId: payload.userId,
    paymentMethod: payload.paymentMethod,
    status: "POSTED",
    subtotal: subtotal.toFixed(3),
    taxAmount: taxAmount.toFixed(3),
    totalAmount: totalAmount.toFixed(3),
    createdAt: new Date().toISOString(),
    lines: payload.lines.map((l, i) => ({
      id: `siline-local-${i}`,
      itemId: l.itemId,
      quantity: String(l.quantity),
      unitPrice: String(l.unitPrice),
      lineTotal: String(l.quantity * l.unitPrice),
    })),
  };

  saveLocalSalesInvoice(fallbackInv);
  clearApiCache();
  return fallbackInv;
}

export async function listSalesInvoicesRequest(): Promise<SalesInvoiceResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/sales-invoices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, returning fallback sales invoices", e);
  }
  return getLocalSalesInvoices();
}

export async function getSalesInvoiceRequest(id: string): Promise<SalesInvoiceResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/sales-invoices/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend fetch failed, returning local sales invoice", e);
  }

  const list = getLocalSalesInvoices();
  const found = list.find((s) => s.id === id || s.invoiceNumber === id);
  if (found) return found;
  return list[0];
}

export interface PurchaseInvoiceLinePayload {
  itemId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseInvoicePayload {
  invoiceNumber: string;
  supplierId: string;
  branchId: string;
  paymentTerms?: string;
  taxAmount?: number;
  lines: PurchaseInvoiceLinePayload[];
}

export interface PurchaseInvoiceResponse {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  paymentTerms: string;
  supplierId: string;
  branchId: string;
  status: string;
  subtotal: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  createdAt: string;
  updatedAt: string;
  supplier?: SupplierResponse;
  branch?: {
    id: string;
    code?: string;
    nameEn?: string;
    nameAr?: string;
    city?: string;
  };
  lines?: {
    id: string;
    itemId: string;
    quantity: string | number;
    unitCost: string | number;
    lineTotal: string | number;
    item?: ItemResponse;
  }[];
  journalEntry?: {
    id: string;
    reference: string;
    date?: string;
    status: string;
    description?: string;
    lines?: {
      id: string;
      accountId: string;
      debit: string | number;
      credit: string | number;
      account?: {
        id: string;
        code: string;
        name: string;
        type: string;
      };
    }[];
  };
}

// Demo Fallback Data for Purchase Invoices
const DEFAULT_FALLBACK_PURCHASE_INVOICES: PurchaseInvoiceResponse[] = [
  {
    id: "pinv-001",
    invoiceNumber: "PINV-2026-001",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    paymentTerms: "NET 30",
    supplierId: "sup-001",
    branchId: "br-01",
    status: "POSTED",
    subtotal: 1450.0,
    taxAmount: 0,
    totalAmount: 1450.0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    supplier: {
      id: "sup-001",
      code: "SUP-001",
      name: "Gulf Vape Distribution Co.",
      phone: "+965 2222 1001",
      email: "sales@gulfvape.example.com",
      address: "Shuwaikh Industrial Area, Block 1",
      branchId: "br-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branch: {
      id: "br-01",
      code: "MAIN",
      nameEn: "Shuwaikh Main Branch",
      nameAr: "فرع الشويخ الرئيسي",
      city: "Kuwait City",
    },
    lines: [
      {
        id: "piline-101",
        itemId: "item-001",
        quantity: 100,
        unitCost: 8.5,
        lineTotal: 850.0,
        item: {
          id: "item-001",
          sku: "VAPE-POD-01",
          barcode: null,
          name: "JUUL Pods Mint 5%",
          price: "12.500",
          cost: "8.500",
          unit: "pack",
          stockQuantity: 250,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        id: "piline-102",
        itemId: "item-002",
        quantity: 50,
        unitCost: 12.0,
        lineTotal: 600.0,
        item: {
          id: "item-002",
          sku: "VAPE-DEV-02",
          barcode: null,
          name: "Caliburn A2 Pod Kit Black",
          price: "18.000",
          cost: "12.000",
          unit: "pcs",
          stockQuantity: 120,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    journalEntry: {
      id: "je-pinv-001",
      reference: "JE-PINV-2026-001",
      status: "POSTED",
      description: "Auto-posted from purchase invoice PINV-2026-001",
      lines: [
        {
          id: "jel-1",
          accountId: "acc-1200",
          debit: 1450.0,
          credit: 0,
          account: { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
        },
        {
          id: "jel-2",
          accountId: "acc-2000",
          debit: 0,
          credit: 1450.0,
          account: { id: "acc-2000", code: "2000", name: "Accounts Payable (Vendors)", type: "LIABILITY" },
        },
      ],
    },
  },
  {
    id: "pinv-002",
    invoiceNumber: "PINV-2026-002",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    paymentTerms: "IMMEDIATE",
    supplierId: "sup-002",
    branchId: "br-01",
    status: "POSTED",
    subtotal: 2800.0,
    taxAmount: 0,
    totalAmount: 2800.0,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    supplier: {
      id: "sup-002",
      code: "SUP-002",
      name: "Al-Rayhan Tobacco Trading",
      phone: "+965 2222 1002",
      email: "orders@alrayhantobacco.example.com",
      address: "Salmiya Commercial Complex",
      branchId: "br-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branch: {
      id: "br-01",
      code: "MAIN",
      nameEn: "Shuwaikh Main Branch",
      nameAr: "فرع الشويخ الرئيسي",
      city: "Kuwait City",
    },
    lines: [
      {
        id: "piline-201",
        itemId: "item-003",
        quantity: 200,
        unitCost: 14.0,
        lineTotal: 2800.0,
        item: {
          id: "item-003",
          sku: "TOB-SHISHA-01",
          barcode: null,
          name: "Al-Fakher Two Apples 1KG",
          price: "22.000",
          cost: "14.000",
          unit: "box",
          stockQuantity: 400,
          category: "TOBACCO",
          visibility: "ALL_BRANCHES",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    journalEntry: {
      id: "je-pinv-002",
      reference: "JE-PINV-2026-002",
      status: "POSTED",
      description: "Auto-posted from purchase invoice PINV-2026-002",
      lines: [
        {
          id: "jel-3",
          accountId: "acc-1200",
          debit: 2800.0,
          credit: 0,
          account: { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
        },
        {
          id: "jel-4",
          accountId: "acc-2000",
          debit: 0,
          credit: 2800.0,
          account: { id: "acc-2000", code: "2000", name: "Accounts Payable (Vendors)", type: "LIABILITY" },
        },
      ],
    },
  },
];

function getLocalPurchaseInvoices(): PurchaseInvoiceResponse[] {
  if (typeof window === "undefined") return DEFAULT_FALLBACK_PURCHASE_INVOICES;
  try {
    const raw = localStorage.getItem("bin-essa-local-purchase-invoices");
    if (!raw) return DEFAULT_FALLBACK_PURCHASE_INVOICES;
    const custom = JSON.parse(raw);
    return [...custom, ...DEFAULT_FALLBACK_PURCHASE_INVOICES];
  } catch {
    return DEFAULT_FALLBACK_PURCHASE_INVOICES;
  }
}

function saveLocalPurchaseInvoice(inv: PurchaseInvoiceResponse) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("bin-essa-local-purchase-invoices");
    const existing: PurchaseInvoiceResponse[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(
      "bin-essa-local-purchase-invoices",
      JSON.stringify([inv, ...existing])
    );
  } catch {
    // Ignore storage errors
  }
}

export async function createPurchaseInvoiceRequest(
  payload: CreatePurchaseInvoicePayload
): Promise<PurchaseInvoiceResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/purchase-invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      clearApiCache();
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, using local invoice store", e);
  }

  // Resilient Fallback Creation
  const subtotal = payload.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0);
  const taxAmount = payload.taxAmount || 0;
  const totalAmount = subtotal + taxAmount;

  const fallbackInv: PurchaseInvoiceResponse = {
    id: `pinv-local-${Date.now()}`,
    invoiceNumber: payload.invoiceNumber,
    date: new Date().toISOString(),
    paymentTerms: payload.paymentTerms || "IMMEDIATE",
    supplierId: payload.supplierId,
    branchId: payload.branchId,
    status: "POSTED",
    subtotal,
    taxAmount,
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supplier: {
      id: payload.supplierId,
      code: "SUP-GENERIC",
      name: "Supplier " + payload.supplierId,
      phone: "+965 2222 9999",
      email: "supplier@binessa.com",
      address: "Kuwait City",
      branchId: payload.branchId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branch: {
      id: payload.branchId,
      code: "MAIN",
      nameEn: "Main Branch",
      nameAr: "الفرع الرئيسي",
      city: "Kuwait City",
    },
    lines: payload.lines.map((l, i) => ({
      id: `piline-local-${i}`,
      itemId: l.itemId,
      quantity: l.quantity,
      unitCost: l.unitCost,
      lineTotal: l.quantity * l.unitCost,
    })),
    journalEntry: {
      id: `je-local-${Date.now()}`,
      reference: `JE-${payload.invoiceNumber}`,
      status: "POSTED",
      description: `Auto-posted from purchase invoice ${payload.invoiceNumber}`,
      lines: [
        {
          id: `jel-d-${Date.now()}`,
          accountId: "acc-1200",
          debit: totalAmount,
          credit: 0,
          account: { id: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET" },
        },
        {
          id: `jel-c-${Date.now()}`,
          accountId: "acc-2000",
          debit: 0,
          credit: totalAmount,
          account: { id: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY" },
        },
      ],
    },
  };

  saveLocalPurchaseInvoice(fallbackInv);
  clearApiCache();
  return fallbackInv;
}

export async function listPurchaseInvoicesRequest(): Promise<PurchaseInvoiceResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/purchase-invoices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend unavailable, returning resilient local purchase invoices", e);
  }
  return getLocalPurchaseInvoices();
}

export async function getPurchaseInvoiceRequest(id: string): Promise<PurchaseInvoiceResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/purchase-invoices/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend fetch failed, searching local purchase invoices", e);
  }

  const list = getLocalPurchaseInvoices();
  const found = list.find((i) => i.id === id || i.invoiceNumber === id);
  if (found) return found;
  return list[0];
}

// ================= PROMOTION & DISCOUNT API CLIENT =================

export interface PromotionRecord {
  id: string;
  code: string;
  nameEn: string;
  nameAr?: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  maxQuantity?: number;
  isCombinable: boolean;
  isActive: boolean;
  targetType: "PRODUCT" | "PRODUCT_GROUP" | "CATEGORY" | "ALL_PRODUCTS";
  branchScope: "ALL_BRANCHES" | "SPECIFIC_BRANCHES";
  customerScope: "ALL_CUSTOMERS" | "SPECIFIC_CUSTOMER" | "CUSTOMER_GROUP";
  customerGroup?: string;
  itemIds?: string[];
  branchIds?: string[];
  customerIds?: string[];
  items?: Array<{ itemId: string; item?: ItemResponse }>;
  branches?: Array<{ branchId: string }>;
  customers?: Array<{ customerId: string }>;
}

export interface UserDiscountPermissionRecord {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  maxDiscountPercent: number;
  canEditPrices: boolean;
  requiresManagerApproval: boolean;
  allowedBranchIds: string[];
}

export interface DiscountAuditLogRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  branchId: string;
  invoiceNumber: string;
  discountType: "MANUAL_LINE" | "MANUAL_HEADER" | "PROMOTION";
  promotionId?: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  reason?: string;
  approvedByUserId?: string;
  approvedByName?: string;
  createdAt: string;
}

export async function listPromotionsRequest(): Promise<PromotionRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/promotions`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listPromotions", e);
  }
  return [];
}

export async function createPromotionRequest(payload: Partial<PromotionRecord> & { code: string; nameEn: string }): Promise<PromotionRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/promotions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create promotion");
  }
  clearApiCache();
  return res.json();
}

export async function updatePromotionRequest(id: string, payload: Partial<PromotionRecord>): Promise<PromotionRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/promotions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update promotion");
  }
  clearApiCache();
  return res.json();
}

export async function deletePromotionRequest(id: string): Promise<void> {
  const token = localStorage.getItem("bin-essa-access-token");
  await fetch(`${API_BASE}/promotions/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  clearApiCache();
}

export async function evaluatePromotionsRequest(payload: {
  branchId: string;
  customerId?: string;
  lines: Array<{ itemId: string; quantity: number; unitPrice: number }>;
}): Promise<{
  totalDiscount: number;
  lineDiscounts: Record<string, { discountAmount: number; promotionId: string; promotionName: string }>;
  appliedPromotionsCount: number;
}> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/promotions/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for evaluatePromotions", e);
  }
  return { totalDiscount: 0, lineDiscounts: {}, appliedPromotionsCount: 0 };
}

export async function listDiscountPermissionsRequest(): Promise<UserDiscountPermissionRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/discount-permissions`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for discount permissions", e);
  }
  return [];
}

export async function updateDiscountPermissionRequest(
  userId: string,
  payload: {
    maxDiscountPercent: number;
    canEditPrices: boolean;
    requiresManagerApproval: boolean;
    allowedBranchIds: string[];
  }
): Promise<UserDiscountPermissionRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/discount-permissions/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update user discount permissions");
  }
  return res.json();
}

export async function verifyManagerPinRequest(passcode: string): Promise<{
  authorized: boolean;
  approvedByUserId: string;
  approvedByName: string;
}> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/discount-permissions/verify-manager-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) {
    throw new Error("Invalid Manager PIN or Passcode");
  }
  return res.json();
}

export async function listDiscountAuditLogsRequest(): Promise<DiscountAuditLogRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/promotions/audit-logs`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for audit logs", e);
  }
  return [];
}

// ================= USER & ROLE PERMISSIONS API CLIENT =================

export interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  role: string;
  branchId: string | null;
  isActive: boolean;
  createdAt: string;
  branch?: { id: string; name: string; code: string } | null;
  discountPermission?: UserDiscountPermissionRecord | null;
}

export interface RolePermissionRecord {
  role: string;
  modules: string[];
}

export interface BranchResponse {
  id: string;
  name: string;
  code: string;
}

export async function listBranchesRequest(): Promise<BranchResponse[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/settings/branches`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listBranches", e);
  }
  return [
    { id: "br-01", name: "Salmiya Main", code: "BR-01" },
    { id: "br-02", name: "Hawally Branch", code: "BR-02" },
    { id: "br-03", name: "Farwaniya Branch", code: "BR-03" },
    { id: "br-15", name: "Khiran Marine", code: "BR-15" },
    { id: "br-16", name: "JM Art Zone", code: "BR-16" },
  ];
}

export async function listUsersRequest(): Promise<UserRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listUsers", e);
  }
  return [];
}

export async function createUserRequest(payload: {
  username: string;
  password: string;
  fullName: string;
  role: string;
  branchId?: string;
  isActive?: boolean;
}): Promise<UserRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create user");
  }
  clearApiCache();
  return res.json();
}

export async function updateUserRequest(
  id: string,
  payload: {
    fullName?: string;
    role?: string;
    branchId?: string;
    isActive?: boolean;
    password?: string;
  }
): Promise<UserRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update user");
  }
  clearApiCache();
  return res.json();
}

export async function listRolePermissionsRequest(): Promise<RolePermissionRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/users/role-permissions`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listRolePermissions", e);
  }
  return [];
}

export async function updateRolePermissionRequest(role: string, modules: string[]): Promise<RolePermissionRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/users/role-permissions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ role, modules }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update role permissions");
  }
  clearApiCache();
  return res.json();
}

// ================= POS SHIFT & PDC CHECK API CLIENT =================

export interface PosShiftRecord {
  id: string;
  shiftNumber: string;
  userId: string;
  branchId: string;
  openingFloat: number;
  cashSalesTotal: number;
  cardSalesTotal: number;
  creditSalesTotal: number;
  closingCashExpected: number;
  closingCashActual: number;
  cashVariance: number;
  status: "OPEN" | "CLOSED";
  notes?: string;
  openedAt: string;
  closedAt?: string;
  user?: { id: string; fullName: string; username: string };
  branch?: { id: string; name: string; code: string };
}

export interface PdcCheckRecord {
  id: string;
  checkNumber: string;
  bankName: string;
  dueDate: string;
  amount: number;
  status: "RECEIVED" | "DEPOSITED" | "CLEARED" | "BOUNCED";
  customerId: string;
  customer?: { id: string; name: string; code: string };
  notes?: string;
  depositedAt?: string;
  clearedAt?: string;
  bouncedAt?: string;
  createdAt: string;
}

export async function getCurrentPosShiftRequest(userId: string, branchId: string): Promise<PosShiftRecord | null> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/pos-shifts/current?userId=${userId}&branchId=${branchId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    }
  } catch (e) {
    console.warn("Backend unavailable for getCurrentPosShift", e);
  }
  return null;
}

export async function openPosShiftRequest(payload: {
  userId: string;
  branchId: string;
  openingFloat: number;
}): Promise<PosShiftRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/pos-shifts/open`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to open POS Shift");
  }
  clearApiCache();
  return res.json();
}

export async function closePosShiftRequest(
  id: string,
  payload: { closingCashActual: number; notes?: string }
): Promise<PosShiftRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/pos-shifts/${id}/close`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to close POS Shift");
  }
  clearApiCache();
  return res.json();
}

export async function listPdcChecksRequest(): Promise<PdcCheckRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/pdc-checks`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listPdcChecks", e);
  }
  return [];
}

export async function createPdcCheckRequest(payload: {
  checkNumber: string;
  bankName: string;
  dueDate: string;
  amount: number;
  customerId: string;
  notes?: string;
}): Promise<PdcCheckRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/pdc-checks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create PDC check");
  }
  clearApiCache();
  return res.json();
}

export async function clearPdcCheckRequest(id: string): Promise<PdcCheckRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/pdc-checks/${id}/clear`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to clear PDC check");
  }
  clearApiCache();
  return res.json();
}

// ================= ITEM VARIANTS & AGING REPORTS API CLIENT =================

export interface ItemVariantRecord {
  id: string;
  itemId: string;
  sku: string;
  barcode: string;
  variantName: string;
  price: number;
  cost: number;
  stock: number;
}

export interface CustomerArAgingRecord {
  customerId: string;
  customerCode: string;
  customerName: string;
  creditLimit: number;
  current: number;
  days31to60: number;
  days61to90: number;
  days90Plus: number;
  totalOutstanding: number;
}

export async function listItemVariantsRequest(itemId: string): Promise<ItemVariantRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/item-variants/item/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listItemVariants", e);
  }
  return [];
}

export async function createItemVariantRequest(payload: {
  itemId: string;
  sku: string;
  barcode: string;
  variantName: string;
  price: number;
  cost?: number;
  stock?: number;
}): Promise<ItemVariantRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  const res = await fetch(`${API_BASE}/item-variants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create variant");
  }
  clearApiCache();
  return res.json();
}

export async function getCustomerArAgingReportRequest(): Promise<CustomerArAgingRecord[]> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/aging-reports/customer-ar`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for AR aging report", e);
  }
  return [];
}

