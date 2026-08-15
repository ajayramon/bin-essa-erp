const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? "/api"
    : (process.env.INTERNAL_API_URL || "http://backend:4000"));


const apiCache = new Map<string, { data: any; expiresAt: number }>();

export function clearApiCache() {
  apiCache.clear();
}

async function fetchWithCache<T>(url: string, init?: RequestInit, ttlMs = 60000): Promise<T> {
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
  let res: Response | null = null;

  // 1. Try configured API endpoint
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    // If backend connection fails, proceed to local Next.js API handler
  }

  // 2. If primary fetch failed to connect or returned an error, fallback to local Next.js /api/auth/login
  if (!res || !res.ok) {
    try {
      const fallbackRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (fallbackRes.ok) {
        return fallbackRes.json();
      }

      if (!res) {
        const body = await fallbackRes.json().catch(() => null);
        throw new Error(body?.message ?? "Authentication failed");
      }
    } catch (err: any) {
      if (!res) {
        throw new Error(err?.message || "Unable to connect to authentication server. Please check your network connection.");
      }
    }
  }

  if (res && !res.ok) {
    const body = await res.json().catch(() => null);
    const errorMsg =
      typeof body?.message === "string"
        ? body.message
        : Array.isArray(body?.message)
        ? body.message.join(", ")
        : "Invalid username or password";
    throw new Error(errorMsg);
  }

  if (!res) {
    throw new Error("Unable to connect to authentication service.");
  }

  return res.json();
}


export type ItemCategory =
  | "disposable_vapes"
  | "pod_systems"
  | "nicotine_pouches"
  | "dokha_medwakh"
  | "cigarette_lighters"
  | "rolling_papers"
  | "rolling_tobacco_hbt"
  | "pipe_accessories"
  | "general_smoking_accessories"
  | "marine_outdoor"
  | "custom_gifts_signage"
  | "licensed_collectibles"
  | string;

export type ItemVisibility = "ALL_BRANCHES" | "SPECIFIC_BRANCHES";

export interface SubCategory {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
  subcategories: SubCategory[];
}

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-001",
    code: "disposable_vapes",
    nameEn: "Disposable Vapes",
    nameAr: "سحبات جاهزة (فيب)",
    isActive: true,
    subcategories: [
      { id: "sub-101", code: "disp_5k_7k", nameEn: "5,000 - 7,000 Puffs", nameAr: "5000 - 7000 سحبة", isActive: true },
      { id: "sub-102", code: "disp_8k_plus", nameEn: "8,000+ Puffs", nameAr: "8000+ سحبة", isActive: true },
      { id: "sub-103", code: "disp_rechargeable", nameEn: "Rechargeable Disposables", nameAr: "سحبات قابلة لإعادة الشحن", isActive: true },
      { id: "sub-104", code: "disp_nic_free", nameEn: "Zero Nicotine Disposables", nameAr: "سحبات خالية من النيكوتين", isActive: true },
    ],
  },
  {
    id: "cat-002",
    code: "pod_systems",
    nameEn: "Pod Systems & Liquids",
    nameAr: "أجهزة بود ونكهات",
    isActive: true,
    subcategories: [
      { id: "sub-201", code: "pod_starter_kits", nameEn: "Pod Starter Kits", nameAr: "أجهزة بود سيستم", isActive: true },
      { id: "sub-202", code: "pod_replacement_coils", nameEn: "Replacement Pods & Coils", nameAr: "بودات وكويلات استبدال", isActive: true },
      { id: "sub-203", code: "pod_salt_nic", nameEn: "Salt Nicotine (30ml)", nameAr: "نكهات سولت نيكوتين 30 مل", isActive: true },
      { id: "sub-204", code: "pod_freebase", nameEn: "Freebase E-Liquids (60ml)", nameAr: "نكهات فري بيس 60 مل", isActive: true },
    ],
  },
  {
    id: "cat-003",
    code: "nicotine_pouches",
    nameEn: "Nicotine Pouches",
    nameAr: "أكياس النيكوتين (سيبيريا/فوكس)",
    isActive: true,
    subcategories: [
      { id: "sub-301", code: "pouch_siberia", nameEn: "Siberia (Slim & White)", nameAr: "سيبيريا (سليم/وايت)", isActive: true },
      { id: "sub-302", code: "pouch_white_fox", nameEn: "White Fox", nameAr: "وايت فوكس", isActive: true },
      { id: "sub-303", code: "pouch_velo_lyft", nameEn: "Velo / Lyft", nameAr: "فيلو / ليفت", isActive: true },
      { id: "sub-304", code: "pouch_killa_pablo", nameEn: "Killa / Pablo", nameAr: "كيلا / بابلو", isActive: true },
    ],
  },
  {
    id: "cat-004",
    code: "dokha_medwakh",
    nameEn: "Dokha & Medwakh",
    nameAr: "دوخة ومدواخ",
    isActive: true,
    subcategories: [
      { id: "sub-401", code: "dokha_bottles", nameEn: "Premium Dokha Bottles", nameAr: "عبوات دوخة فاخرة", isActive: true },
      { id: "sub-402", code: "medwakh_pipes", nameEn: "Wooden & Brass Medwakh Pipes", nameAr: "مداويخ خشبية ومعدنية", isActive: true },
      { id: "sub-403", code: "medwakh_filters", nameEn: "Medwakh Filters", nameAr: "فلاتر مدواخ", isActive: true },
      { id: "sub-404", code: "medwakh_cleaning", nameEn: "Cleaning & Starter Kits", nameAr: "أدوات تنظيف ومستلزمات", isActive: true },
    ],
  },
  {
    id: "cat-005",
    code: "cigarette_lighters",
    nameEn: "Cigarette Lighters",
    nameAr: "ولاعات (كريكيت/فويغو)",
    isActive: true,
    subcategories: [
      { id: "sub-501", code: "lighter_cricket", nameEn: "Cricket Disposable Lighters", nameAr: "ولاعات كريكيت عادية", isActive: true },
      { id: "sub-502", code: "lighter_jet_torch", nameEn: "Jet Torch & Refillable Lighters", nameAr: "ولاعات جت تورش نفاثة", isActive: true },
      { id: "sub-503", code: "lighter_clipper", nameEn: "Clipper Classic Lighters", nameAr: "ولاعات كليبر كلاسيك", isActive: true },
      { id: "sub-504", code: "lighter_gas_flints", nameEn: "Refill Gas & Flints", nameAr: "غاز تعبئة وحجر ولاعة", isActive: true },
    ],
  },
  {
    id: "cat-006",
    code: "rolling_papers",
    nameEn: "Rolling Papers & Cones",
    nameAr: "ورق لف ومخاريط (RAW)",
    isActive: true,
    subcategories: [
      { id: "sub-601", code: "papers_raw_classic", nameEn: "RAW Classic King Size Slim", nameAr: "ورق راو كلاسيك كينج سايز", isActive: true },
      { id: "sub-602", code: "papers_organic_hemp", nameEn: "Organic Hemp Papers", nameAr: "ورق قنب عضوي", isActive: true },
      { id: "sub-603", code: "papers_pre_rolled", nameEn: "Pre-Rolled Cones", nameAr: "مخاريط جاهزة للتعبئة", isActive: true },
      { id: "sub-604", code: "papers_tips_filters", nameEn: "Filter Tips & Roaches", nameAr: "فلاتر وتبس ورقي", isActive: true },
    ],
  },
  {
    id: "cat-007",
    code: "rolling_tobacco_hbt",
    nameEn: "Rolling Tobacco (HBT)",
    nameAr: "تبغ لف السجائر (HBT)",
    isActive: true,
    subcategories: [
      { id: "sub-701", code: "tobacco_amber_leaf", nameEn: "Amber Leaf", nameAr: "أمبر ليف", isActive: true },
      { id: "sub-702", code: "tobacco_golden_virginia", nameEn: "Golden Virginia", nameAr: "جولدن فرجينيا", isActive: true },
      { id: "sub-703", code: "tobacco_drum", nameEn: "Drum", nameAr: "درم", isActive: true },
      { id: "sub-704", code: "tobacco_pueblo", nameEn: "Pueblo", nameAr: "بويبلو", isActive: true },
    ],
  },
  {
    id: "cat-008",
    code: "pipe_accessories",
    nameEn: "Pipe & Cigar Accessories",
    nameAr: "مستلزمات الغليون والسيجار",
    isActive: true,
    subcategories: [
      { id: "sub-801", code: "pipes_briar", nameEn: "Briar Wood Pipes", nameAr: "غليون خشب براير فاخر", isActive: true },
      { id: "sub-802", code: "cigar_cutters", nameEn: "Cigar Cutters & Punches", nameAr: "قطاعات قواطع سيجار", isActive: true },
      { id: "sub-803", code: "cigar_humidors", nameEn: "Humidors & Hygrometers", nameAr: "صناديق ترطيب هيمودور", isActive: true },
      { id: "sub-804", code: "pipe_cleaners", nameEn: "Pipe Cleaners & Tampers", nameAr: "منظفات ومستلزمات الغليون", isActive: true },
    ],
  },
  {
    id: "cat-009",
    code: "general_smoking_accessories",
    nameEn: "Charcoal & Accessories",
    nameAr: "مستلزمات تدخين وفحم كراون",
    isActive: true,
    subcategories: [
      { id: "sub-901", code: "charcoal_crown", nameEn: "Crown Quick-Light Charcoal", nameAr: "فحم كراون سريع الاشتعال", isActive: true },
      { id: "sub-902", code: "charcoal_coconut", nameEn: "Coconut Cube Charcoal", nameAr: "فحم جوز الهند مكعبات", isActive: true },
      { id: "sub-903", code: "ashtrays", nameEn: "Ashtrays & Trays", nameAr: "طفايات سجائر وسيجار", isActive: true },
      { id: "sub-904", code: "grinders", nameEn: "Herb Grinders & Crushers", nameAr: "مطاحن ومفرمات أعشاب", isActive: true },
    ],
  },
  {
    id: "cat-010",
    code: "marine_outdoor",
    nameEn: "Khiran Marine & Outdoor",
    nameAr: "بن عيسى الخيران (بحري)",
    isActive: true,
    subcategories: [
      { id: "sub-1001", code: "marine_fishing", nameEn: "Fishing Rods & Reels", nameAr: "صنارات وبكرات صيد", isActive: true },
      { id: "sub-1002", code: "marine_safety", nameEn: "Life Jackets & Safety", nameAr: "سترات نجاة ومعدات سلامة", isActive: true },
      { id: "sub-1003", code: "marine_watersports", nameEn: "Watersports & Gym Boards", nameAr: "ألواح تزلج ورياضات مائية", isActive: true },
      { id: "sub-1004", code: "outdoor_camping", nameEn: "Camping & Outdoor Gear", nameAr: "معدات رحلات وتخييم", isActive: true },
    ],
  },
  {
    id: "cat-011",
    code: "custom_gifts_signage",
    nameEn: "JM Art Zone Gifts",
    nameAr: "جي إم آرت زون (هدايا/أكريليك)",
    isActive: true,
    subcategories: [
      { id: "sub-1101", code: "acrylic_plaques", nameEn: "Custom Acrylic Plaques", nameAr: "دروع ولوحات أكريليك مخصصة", isActive: true },
      { id: "sub-1102", code: "custom_mugs", nameEn: "Personalized Mugs & Tumblers", nameAr: "أكواب وطباعة حرارية", isActive: true },
      { id: "sub-1103", code: "commercial_signage", nameEn: "Commercial Signage & Letters", nameAr: "لوحات إعلانية ومضيئة", isActive: true },
      { id: "sub-1104", code: "custom_frames", nameEn: "Gift Frames & Engraving", nameAr: "إطارات وهدايا تذكارية", isActive: true },
    ],
  },
  {
    id: "cat-012",
    code: "licensed_collectibles",
    nameEn: "Licensed Collectibles",
    nameAr: "مقتنيات ومجسمات مرخصة",
    isActive: true,
    subcategories: [
      { id: "sub-1201", code: "statues_anime", nameEn: "Anime & Movie Statues", nameAr: "مجسمات أنمي وأفلام", isActive: true },
      { id: "sub-1202", code: "diecast_models", nameEn: "Diecast Metal Models", nameAr: "سيارات ومجسمات معدنية", isActive: true },
      { id: "sub-1203", code: "novelty_items", nameEn: "Exclusive Novelty Collectibles", nameAr: "تحف واكسسوارات حصرية", isActive: true },
    ],
  },
];

const CATEGORIES_STORAGE_KEY = "bin-essa-categories-v2";

export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return FALLBACK_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse error
  }
  return FALLBACK_CATEGORIES;
}

export function saveStoredCategories(categories: Category[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Ignore storage error
  }
}

export async function listCategoriesRequest(): Promise<Category[]> {
  return getStoredCategories();
}

export async function saveCategoryRequest(category: Omit<Category, "id"> & { id?: string }): Promise<Category> {
  const current = getStoredCategories();
  const id = category.id || `cat-${Date.now()}`;
  const existingIdx = current.findIndex((c) => c.id === id || c.code === category.code);
  const newCat: Category = {
    id,
    code: category.code,
    nameEn: category.nameEn,
    nameAr: category.nameAr,
    isActive: category.isActive ?? true,
    subcategories: category.subcategories || [],
  };

  let updated: Category[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newCat;
  } else {
    updated = [...current, newCat];
  }
  saveStoredCategories(updated);
  return newCat;
}

export async function toggleCategoryStatus(id: string): Promise<Category[]> {
  const current = getStoredCategories();
  const updated = current.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
  saveStoredCategories(updated);
  return updated;
}

export interface CreateItemPayload {
  sku: string;
  barcode?: string;
  name: string;
  nameEn?: string;
  nameAr?: string;
  category: ItemCategory;
  subCategory?: string;
  brand?: string;
  countryOfOrigin?: string;
  imageUrl?: string;
  visibility?: ItemVisibility;
  price: number;
  cost: number;
  unit?: string;
  isActive?: boolean;
  allowSale?: boolean;
  allowPurchase?: boolean;
  allowDiscount?: boolean;
  maxDiscountPercent?: number;
  allowGift?: boolean;
  expiryRequired?: boolean;
  posVisibility?: boolean;
  stockQuantity?: number;
  retailPrice?: number;
  semiWholesalePrice?: number;
  wholesalePrice?: number;
  trackExpiry?: boolean;
  blockFreeGift?: boolean;
  blockDiscount?: boolean;
  additionalBarcodes?: string[];
  uoms?: ItemUomPayload[];
}

export interface CreateItemResponse {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  nameEn?: string;
  nameAr?: string;
  category: ItemCategory;
  subCategory?: string;
  brand?: string;
  countryOfOrigin?: string;
  imageUrl?: string;
  visibility: ItemVisibility;
  price: string;
  cost: string;
  unit: string;
  isActive: boolean;
  allowSale?: boolean;
  allowPurchase?: boolean;
  allowDiscount?: boolean;
  maxDiscountPercent?: string | number;
  allowGift?: boolean;
  expiryRequired?: boolean;
  posVisibility?: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export async function createItemRequest(
  payload: CreateItemPayload
): Promise<CreateItemResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const createdItem = await res.json();
      const currentItems = getStoredItems();
      saveStoredItems([createdItem, ...currentItems]);
      clearApiCache();
      return createdItem;
    }
  } catch (e) {
    console.warn("Backend unavailable, saving new item in local persistent store", e);
  }

  const nameEn = payload.nameEn || payload.name;
  const nameAr = payload.nameAr || payload.name;

  const newItem: ItemResponse = {
    id: `item-${Date.now()}`,
    sku: payload.sku,
    barcode: payload.barcode || null,
    name: payload.name || nameEn,
    nameEn,
    nameAr,
    category: payload.category,
    subCategory: payload.subCategory,
    brand: payload.brand,
    countryOfOrigin: payload.countryOfOrigin,
    imageUrl: payload.imageUrl,
    visibility: payload.visibility || "ALL_BRANCHES",
    price: payload.price.toFixed(3),
    cost: payload.cost.toFixed(3),
    unit: payload.unit || "pcs",
    stockQuantity: payload.stockQuantity ?? 0,
    isActive: payload.isActive ?? true,
    allowSale: payload.allowSale ?? true,
    allowPurchase: payload.allowPurchase ?? true,
    allowDiscount: payload.allowDiscount ?? !payload.blockDiscount,
    maxDiscountPercent: payload.maxDiscountPercent !== undefined ? String(payload.maxDiscountPercent) : "10",
    allowGift: payload.allowGift ?? !payload.blockFreeGift,
    expiryRequired: payload.expiryRequired ?? payload.trackExpiry ?? false,
    posVisibility: payload.posVisibility ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    retailPrice: (payload.retailPrice || payload.price).toFixed(3),
    semiWholesalePrice: (payload.semiWholesalePrice || payload.price).toFixed(3),
    wholesalePrice: (payload.wholesalePrice || payload.price).toFixed(3),
    trackExpiry: payload.expiryRequired ?? payload.trackExpiry ?? false,
    blockFreeGift: payload.allowGift !== undefined ? !payload.allowGift : (payload.blockFreeGift ?? false),
    blockDiscount: payload.allowDiscount !== undefined ? !payload.allowDiscount : (payload.blockDiscount ?? false),
    additionalBarcodes: (payload.additionalBarcodes || []).map((b, i) => ({ id: `b-${i}`, barcode: b })),
    uoms: payload.uoms || [],
  };

  const currentItems = getStoredItems();
  saveStoredItems([newItem, ...currentItems]);

  // Also register initial branch stock for the new item across branches
  if (typeof window !== "undefined") {
    try {
      const rawBranchStock = localStorage.getItem("bin-essa-branch-stock-v2");
      const branchStockMap = rawBranchStock ? JSON.parse(rawBranchStock) : {};
      branchStockMap[newItem.id] = {
        "br-01": payload.stockQuantity ?? 10,
        "br-02": 5,
        "br-08": 50,
      };
      localStorage.setItem("bin-essa-branch-stock-v2", JSON.stringify(branchStockMap));
    } catch {
      // Ignore
    }
  }

  clearApiCache();
  return newItem as any;
}

export interface CreateCustomerPayload {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  branchId?: string;
  customerGroup?: string;
  creditLimit?: number;
  paymentTerms?: string;
}

export interface CustomerResponse {
  id: string;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  branchId?: string | null;
  customerGroup?: string;
  creditLimit?: number;
  paymentTerms?: string;
  branch?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export type CustomerRecord = CustomerResponse;
export type CreateCustomerResponse = CustomerResponse;

export async function listCustomersRequest(branchId?: string): Promise<CustomerResponse[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/customers${query}`, {
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
): Promise<CustomerResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
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
  { id: "acc-1100", code: "1100", name: "Accounts Receivable", type: "ASSET" },
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

export function getLocalJournalEntries(): CreateJournalEntryResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("bin-essa-local-journal-entries");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalJournalEntry(entry: CreateJournalEntryResponse) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalJournalEntries();
    localStorage.setItem("bin-essa-local-journal-entries", JSON.stringify([entry, ...existing]));
  } catch {
    // Ignore
  }
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

  const localJe: CreateJournalEntryResponse = {
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

  saveLocalJournalEntry(localJe);
  clearApiCache();
  return localJe;
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

  const baseRows: TrialBalanceRow[] = [
    { accountId: "acc-1000", code: "1000", name: "Cash on Hand", type: "ASSET", debit: 4250.5, credit: 0 },
    { accountId: "acc-1100", code: "1100", name: "Accounts Receivable", type: "ASSET", debit: 0, credit: 0 },
    { accountId: "acc-1200", code: "1200", name: "Inventory Asset", type: "ASSET", debit: 52300, credit: 0 },
    { accountId: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY", debit: 0, credit: 9840.25 },
    { accountId: "acc-4000", code: "4000", name: "Sales Revenue", type: "REVENUE", debit: 0, credit: 115700 },
    { accountId: "acc-5000", code: "5000", name: "Cost of Goods Sold", type: "EXPENSE", debit: 68989.75, credit: 0 },
  ];

  // Dynamically accumulate amounts from all locally posted Double-Entry journal entries
  const localJes = getLocalJournalEntries();
  localJes.forEach((je) => {
    je.lines.forEach((line) => {
      const d = Number(line.debit) || 0;
      const c = Number(line.credit) || 0;
      const target = baseRows.find((r) => r.accountId === line.accountId || r.code === line.accountId);
      if (target) {
        target.debit += d;
        target.credit += c;
      }
    });
  });

  const totalDebit = baseRows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = baseRows.reduce((s, r) => s + r.credit, 0);

  return {
    rows: baseRows,
    totalDebit,
    totalCredit,
    isBalanced: Math.abs(totalDebit - totalCredit) < 0.001,
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

  const acc = FALLBACK_ACCOUNTS.find((a) => a.id === accountId || a.code === accountId) || FALLBACK_ACCOUNTS[0];

  const localJes = getLocalJournalEntries();
  const dynamicEntries: LedgerEntry[] = [
    {
      journalEntryId: "je-led-1",
      reference: "JE-OPENING-2026",
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      description: "Opening Balance",
      debit: acc.type === "ASSET" || acc.type === "EXPENSE" ? 1500 : 0,
      credit: acc.type === "LIABILITY" || acc.type === "REVENUE" || acc.type === "EQUITY" ? 1500 : 0,
      runningBalance: 1500,
    },
  ];

  let currentBalance = 1500;
  localJes.forEach((je) => {
    je.lines.forEach((line) => {
      if (line.accountId === acc.id || line.accountId === acc.code) {
        const d = Number(line.debit) || 0;
        const c = Number(line.credit) || 0;
        if (acc.type === "ASSET" || acc.type === "EXPENSE") {
          currentBalance += d - c;
        } else {
          currentBalance += c - d;
        }
        dynamicEntries.push({
          journalEntryId: je.id,
          reference: je.reference,
          date: je.date,
          description: je.description,
          debit: d,
          credit: c,
          runningBalance: currentBalance,
        });
      }
    });
  });

  return {
    account: acc,
    entries: dynamicEntries,
  };
}
export interface ItemUomPayload {
  id?: string;
  unitName: string;
  conversionRatio: number;
  barcode?: string;
  retailPrice?: number;
  wholesalePrice?: number;
  customCost?: number;
  customPrice?: number;
  isBase?: boolean;
}

export interface ItemResponse {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  nameEn?: string;
  nameAr?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  countryOfOrigin?: string;
  imageUrl?: string;
  visibility: string;
  price: string | number;
  cost: string | number;
  unit: string;
  stockQuantity: number;
  isActive: boolean;
  allowSale?: boolean;
  allowPurchase?: boolean;
  allowDiscount?: boolean;
  maxDiscountPercent?: string | number;
  allowGift?: boolean;
  expiryRequired?: boolean;
  posVisibility?: boolean;
  createdAt: string;
  updatedAt: string;
  retailPrice?: string | number;
  semiWholesalePrice?: string | number;
  wholesalePrice?: string | number;
  trackExpiry?: boolean;
  blockFreeGift?: boolean;
  blockDiscount?: boolean;
  blockSale?: boolean;
  additionalBarcodes?: Array<{ id: string; barcode: string; note?: string }>;
  uoms?: ItemUomPayload[];
}

export type ItemRecord = ItemResponse;

const FALLBACK_ITEMS: ItemResponse[] = [
  {
    id: "item-001",
    sku: "VP-BECO-PRO-6K",
    barcode: "6281234500019",
    name: "Beco Pro 6000 Puffs - Tropical Mix",
    nameEn: "Beco Pro 6000 Puffs - Tropical Mix",
    nameAr: "بيكو برو 6000 سحبة - تروبيكال مكس",
    price: "5.500",
    cost: "2.800",
    unit: "pcs",
    stockQuantity: 485,
    category: "disposable_vapes",
    subCategory: "disp_5k_7k",
    brand: "Beco",
    countryOfOrigin: "China",
    imageUrl: "",
    visibility: "ALL_BRANCHES",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "15",
    allowGift: true,
    expiryRequired: false,
    posVisibility: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-006",
    sku: "NP-FOX-WHT-16G",
    barcode: "6281234500064",
    name: "White Fox All White Nicotine Pouches 16mg",
    nameEn: "White Fox All White Nicotine Pouches 16mg",
    nameAr: "أكياس وايت فوكس أول وايت نيكوتين 16 ملغ",
    price: "1.750",
    cost: "0.950",
    unit: "can",
    stockQuantity: 600,
    category: "nicotine_pouches",
    subCategory: "pouch_white_fox",
    brand: "White Fox",
    countryOfOrigin: "Sweden",
    imageUrl: "",
    visibility: "ALL_BRANCHES",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "10",
    allowGift: true,
    expiryRequired: true,
    posVisibility: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-009",
    sku: "LT-CRK-ORIG-01",
    barcode: "6281234500095",
    name: "Cricket Original Lighter - Box of 50",
    nameEn: "Cricket Original Lighter - Box of 50",
    nameAr: "ولاعة كريكيت الأصلية - علبة 50 حبة",
    price: "7.500",
    cost: "4.500",
    unit: "box",
    stockQuantity: 200,
    category: "cigarette_lighters",
    subCategory: "lighter_cricket",
    brand: "Cricket",
    countryOfOrigin: "Netherlands",
    imageUrl: "",
    visibility: "ALL_BRANCHES",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "20",
    allowGift: true,
    expiryRequired: false,
    posVisibility: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-011",
    sku: "RP-RAW-KS-SLM",
    barcode: "6281234500118",
    name: "RAW Classic King Size Slim (Box of 50)",
    nameEn: "RAW Classic King Size Slim (Box of 50)",
    nameAr: "ورق راو كلاسيك كينج سايز سليم (علبة 50)",
    price: "12.000",
    cost: "6.500",
    unit: "box",
    stockQuantity: 220,
    category: "rolling_papers",
    subCategory: "papers_raw_classic",
    brand: "RAW",
    countryOfOrigin: "Spain",
    imageUrl: "",
    visibility: "ALL_BRANCHES",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "10",
    allowGift: false,
    expiryRequired: false,
    posVisibility: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-014",
    sku: "CH-CRW-40M-BOX",
    barcode: "6281234500149",
    name: "CHARCOAL CROWN 40 MM Quick-Light Coal",
    nameEn: "CHARCOAL CROWN 40 MM Quick-Light Coal",
    nameAr: "فحم كراون 40 ملم سريع الاشتعال (علبة)",
    price: "3.000",
    cost: "1.600",
    unit: "box",
    stockQuantity: 450,
    category: "general_smoking_accessories",
    subCategory: "charcoal_crown",
    brand: "Crown",
    countryOfOrigin: "Kuwait",
    imageUrl: "",
    visibility: "ALL_BRANCHES",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "25",
    allowGift: true,
    expiryRequired: false,
    posVisibility: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-015",
    sku: "DK-BAS-MED-01B",
    barcode: "6281234500156",
    name: "Al Basha Special Dokha Warm 50ml",
    nameEn: "Al Basha Special Dokha Warm 50ml",
    nameAr: "دوخة الباشا الخاصة دافئ 50 مل",
    price: "3.500",
    cost: "1.800",
    unit: "bottle",
    stockQuantity: 300,
    category: "dokha_medwakh",
    subCategory: "dokha_bottles",
    brand: "Al Basha",
    countryOfOrigin: "United Arab Emirates",
    imageUrl: "",
    visibility: "ALL_BRANCHES",
    isActive: true,
    allowSale: true,
    allowPurchase: true,
    allowDiscount: true,
    maxDiscountPercent: "10",
    allowGift: true,
    expiryRequired: true,
    posVisibility: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ITEMS_STORAGE_KEY = "bin-essa-items-stock-v2";

export function getStoredItems(): ItemResponse[] {
  if (typeof window === "undefined") return FALLBACK_ITEMS;
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse error
  }
  return FALLBACK_ITEMS;
}

export function saveStoredItems(items: ItemResponse[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage error
  }
}

export async function listItemsRequest(branchId?: string): Promise<ItemResponse[]> {
  clearApiCache();
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const storedItems = getStoredItems();
  const query = branchId ? `&branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/items?_t=${Date.now()}${query}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      const data: ItemResponse[] = await res.json();
      const merged = data.map((serverItem) => {
        const local = storedItems.find((s) => s.id === serverItem.id || s.sku === serverItem.sku);
        if (local && local.stockQuantity !== undefined) {
          const localQty = Number(local.stockQuantity);
          const serverQty = Number(serverItem.stockQuantity);
          const effectiveStock = Math.min(localQty, serverQty);
          return { ...serverItem, stockQuantity: effectiveStock };
        }
        return serverItem;
      });
      saveStoredItems(merged);
      return merged;
    }
  } catch (e) {
    console.warn("Backend unavailable, using persistent stored items", e);
  }
  return storedItems;
}

export async function updateItemRequest(
  id: string,
  payload: Partial<CreateItemPayload>
): Promise<ItemResponse> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updatedItem = await res.json();
      const currentItems = getStoredItems();
      const idx = currentItems.findIndex((i) => i.id === id);
      if (idx >= 0) {
        currentItems[idx] = { ...currentItems[idx], ...updatedItem };
        saveStoredItems(currentItems);
      }
      clearApiCache();
      return updatedItem;
    }
  } catch (e) {
    console.warn("Backend unavailable, updating item in local persistent store", e);
  }

  const currentItems = getStoredItems();
  const item = currentItems.find((i) => i.id === id) || FALLBACK_ITEMS.find((i) => i.id === id);
  if (item) {
    if (payload.name) item.name = payload.name;
    if (payload.nameEn) item.nameEn = payload.nameEn;
    if (payload.nameAr) item.nameAr = payload.nameAr;
    if (payload.sku) item.sku = payload.sku;
    if (payload.barcode !== undefined) item.barcode = payload.barcode || null;
    if (payload.category) item.category = payload.category;
    if (payload.subCategory !== undefined) item.subCategory = payload.subCategory;
    if (payload.brand !== undefined) item.brand = payload.brand;
    if (payload.countryOfOrigin !== undefined) item.countryOfOrigin = payload.countryOfOrigin;
    if (payload.imageUrl !== undefined) item.imageUrl = payload.imageUrl;
    if (payload.price !== undefined) item.price = String(payload.price);
    if (payload.cost !== undefined) item.cost = String(payload.cost);
    if (payload.retailPrice !== undefined) item.retailPrice = String(payload.retailPrice);
    if (payload.semiWholesalePrice !== undefined) item.semiWholesalePrice = String(payload.semiWholesalePrice);
    if (payload.wholesalePrice !== undefined) item.wholesalePrice = String(payload.wholesalePrice);
    if (payload.unit) item.unit = payload.unit;
    if (payload.stockQuantity !== undefined) item.stockQuantity = payload.stockQuantity;
    if (payload.isActive !== undefined) item.isActive = payload.isActive;
    if (payload.allowSale !== undefined) item.allowSale = payload.allowSale;
    if (payload.allowPurchase !== undefined) item.allowPurchase = payload.allowPurchase;
    if (payload.allowDiscount !== undefined) {
      item.allowDiscount = payload.allowDiscount;
      item.blockDiscount = !payload.allowDiscount;
    }
    if (payload.maxDiscountPercent !== undefined) item.maxDiscountPercent = String(payload.maxDiscountPercent);
    if (payload.allowGift !== undefined) {
      item.allowGift = payload.allowGift;
      item.blockFreeGift = !payload.allowGift;
    }
    if (payload.expiryRequired !== undefined) {
      item.expiryRequired = payload.expiryRequired;
      item.trackExpiry = payload.expiryRequired;
    }
    if (payload.posVisibility !== undefined) item.posVisibility = payload.posVisibility;
    if (payload.additionalBarcodes !== undefined) {
      item.additionalBarcodes = payload.additionalBarcodes.map((b, i) => ({ id: `b-${i}`, barcode: b }));
    }
    item.updatedAt = new Date().toISOString();

    saveStoredItems(currentItems);
    clearApiCache();
    return item;
  }
  throw new Error("Item not found");
}

export async function toggleItemActiveRequest(id: string): Promise<ItemResponse> {
  const currentItems = getStoredItems();
  const item = currentItems.find((i) => i.id === id);
  if (!item) throw new Error("Item not found");
  const newActive = !item.isActive;
  return updateItemRequest(id, { isActive: newActive });
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

export type SupplierRecord = SupplierResponse;

export async function listSuppliersRequest(branchId?: string): Promise<SupplierResponse[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/suppliers${query}`, {
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

export function getLocalSalesInvoices(): SalesInvoiceResponse[] {
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

export function saveLocalSalesInvoice(inv: SalesInvoiceResponse) {
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
  
  // 1. Decrement persistent stock quantity for each sold line item immediately
  const storedItems = getStoredItems();
  let totalCost = 0;
  payload.lines.forEach((l) => {
    const item = storedItems.find((i) => i.id === l.itemId) || FALLBACK_ITEMS.find((i) => i.id === l.itemId);
    if (item) {
      const itemCost = Number(item.cost || 0);
      totalCost += l.quantity * itemCost;
      item.stockQuantity = Math.max(0, Number(item.stockQuantity || 0) - l.quantity);
    }
  });
  saveStoredItems(storedItems);

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

  // 2. Save sales invoice locally
  saveLocalSalesInvoice(fallbackInv);

  // 3. Auto-post balanced Double-Entry Journal Entry (Revenue & COGS)
  const isCash = payload.paymentMethod === "CASH" || payload.paymentMethod === "CARD";
  const journalEntry: CreateJournalEntryResponse = {
    id: `je-sale-${Date.now()}`,
    reference: `JE-${payload.invoiceNumber}`,
    date: new Date().toISOString(),
    description: `Auto GL Entry for Sales Invoice ${payload.invoiceNumber}`,
    status: "POSTED",
    branchId: payload.branchId,
    salesInvoiceId: fallbackInv.id,
    lines: [
      {
        id: `jel-s1-${Date.now()}`,
        journalEntryId: `je-sale-${Date.now()}`,
        accountId: isCash ? "acc-1000" : "acc-1100", // Cash (1000) or AR (1100)
        debit: totalAmount.toFixed(3),
        credit: "0.000",
      },
      {
        id: `jel-s2-${Date.now()}`,
        journalEntryId: `je-sale-${Date.now()}`,
        accountId: "acc-4000", // Sales Revenue (4000)
        debit: "0.000",
        credit: totalAmount.toFixed(3),
      },
      {
        id: `jel-s3-${Date.now()}`,
        journalEntryId: `je-sale-${Date.now()}`,
        accountId: "acc-5000", // Cost of Goods Sold (5000)
        debit: (totalCost || totalAmount * 0.6).toFixed(3),
        credit: "0.000",
      },
      {
        id: `jel-s4-${Date.now()}`,
        journalEntryId: `je-sale-${Date.now()}`,
        accountId: "acc-1200", // Inventory Asset (1200)
        debit: "0.000",
        credit: (totalCost || totalAmount * 0.6).toFixed(3),
      },
    ],
  };

  saveLocalJournalEntry(journalEntry);

  // 4. Record System Audit Log
  saveSystemAuditLog({
    id: `audit-${Date.now()}`,
    action: "POS_SALE",
    entityId: fallbackInv.id,
    referenceNumber: payload.invoiceNumber,
    branchId: payload.branchId,
    userId: payload.userId,
    description: `POS Checkout Completed: Invoice ${payload.invoiceNumber} posted for Total ${totalAmount.toFixed(3)} KWD`,
    createdAt: new Date().toISOString(),
  });

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
    console.warn("Backend unavailable, using local sales invoice fallback", e);
  }

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
  
  // 1. Increment persistent stock quantity & calculate Weighted Average Cost (WAC) for each purchased line item
  const storedItems = getStoredItems();
  payload.lines.forEach((l) => {
    const item = storedItems.find((i) => i.id === l.itemId) || FALLBACK_ITEMS.find((i) => i.id === l.itemId);
    if (item) {
      const currentStock = Math.max(0, Number(item.stockQuantity || 0));
      const currentCost = Number(item.cost || 0);
      const newQty = l.quantity;
      const newUnitCost = Number(l.unitCost || 0);

      const totalQty = currentStock + newQty;
      if (totalQty > 0 && newUnitCost > 0) {
        // Weighted Average Cost Formula: (Existing Stock * Existing Cost + New Qty * New Cost) / Total Qty
        const wacCost = (currentStock * currentCost + newQty * newUnitCost) / totalQty;
        item.cost = Number(wacCost.toFixed(3));
      }
      item.stockQuantity = totalQty;
    }
  });
  saveStoredItems(storedItems);

  // Increment branch-level persistent stock
  if (typeof window !== "undefined") {
    try {
      const rawBranchStock = localStorage.getItem("bin-essa-branch-stock-v2");
      const branchStockMap = rawBranchStock ? JSON.parse(rawBranchStock) : {};
      payload.lines.forEach((l) => {
        if (!branchStockMap[l.itemId]) {
          branchStockMap[l.itemId] = {};
        }
        const cur = branchStockMap[l.itemId][payload.branchId] || 0;
        branchStockMap[l.itemId][payload.branchId] = cur + l.quantity;
      });
      localStorage.setItem("bin-essa-branch-stock-v2", JSON.stringify(branchStockMap));
    } catch {
      // Ignore
    }
  }

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

  // 2. Save purchase invoice locally
  saveLocalPurchaseInvoice(fallbackInv);

  // 3. Auto-post balanced Double-Entry Journal Entry to GL
  const journalEntry: CreateJournalEntryResponse = {
    id: `je-purch-${Date.now()}`,
    reference: `JE-${payload.invoiceNumber}`,
    date: new Date().toISOString(),
    description: `Auto GL Entry for Purchase Invoice ${payload.invoiceNumber}`,
    status: "POSTED",
    branchId: payload.branchId,
    salesInvoiceId: null,
    lines: [
      {
        id: `jel-p1-${Date.now()}`,
        journalEntryId: `je-purch-${Date.now()}`,
        accountId: "acc-1200", // Inventory Asset (1200)
        debit: totalAmount.toFixed(3),
        credit: "0.000",
      },
      {
        id: `jel-p2-${Date.now()}`,
        journalEntryId: `je-purch-${Date.now()}`,
        accountId: "acc-2000", // Accounts Payable (2000)
        debit: "0.000",
        credit: totalAmount.toFixed(3),
      },
    ],
  };

  saveLocalJournalEntry(journalEntry);

  // 4. Record System Audit Log
  saveSystemAuditLog({
    id: `audit-${Date.now()}`,
    action: "PURCHASE_RECEIVED",
    entityId: fallbackInv.id,
    referenceNumber: payload.invoiceNumber,
    branchId: payload.branchId,
    userId: null,
    description: `Goods Receipt / Purchase Invoice ${payload.invoiceNumber} posted: Stock increased & AP GL entry for ${totalAmount.toFixed(3)} KWD created`,
    createdAt: new Date().toISOString(),
  });

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
    console.warn("Backend unavailable, using local invoice fallback", e);
  }

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

export interface PdcCheckRecord {
  id: string;
  checkNumber: string;
  bankName: string;
  dueDate: string;
  amount: number;
  customerId: string;
  status: "RECEIVED" | "CLEARED" | "BOUNCED" | "CANCELLED";
  notes?: string;
  customer?: { id: string; name: string };
  createdAt: string;
}

export interface SystemAuditLogRecord {
  id: string;
  action:
    | "PRODUCT_CREATED"
    | "PURCHASE_RECEIVED"
    | "POS_SALE"
    | "STOCK_ADJUSTMENT"
    | "SHIFT_OPEN"
    | "SHIFT_CLOSE"
    | "SHIFT_REOPEN"
    | "SHIFT_ADJUSTMENT"
    | string;
  entityId: string;
  referenceNumber: string;
  branchId: string | null;
  userId: string | null;
  description: string;
  createdAt: string;
}

export function getLocalAuditLogs(): SystemAuditLogRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("bin-essa-audit-logs");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSystemAuditLog(log: SystemAuditLogRecord) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalAuditLogs();
    localStorage.setItem("bin-essa-audit-logs", JSON.stringify([log, ...existing]));
  } catch {
    // Ignore storage errors
  }
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

export type BranchRecord = BranchResponse;

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
  knetSalesTotal?: number;
  hesabiSalesTotal?: number;
  tabbySalesTotal?: number;
  cardSalesTotal: number;
  creditSalesTotal: number;
  otherSalesTotal?: number;
  totalSales?: number;
  returnsTotal?: number;
  discountsTotal?: number;
  giftsTotal?: number;
  giftsCount?: number;
  closingCashExpected: number;
  closingCashActual: number;
  cashVariance: number;
  status: "OPEN" | "CLOSED";
  notes?: string;
  openedAt: string;
  closedAt?: string;
  reopenedAt?: string;
  reopenedByUserId?: string;
  adjustedAt?: string;
  adjustedByUserId?: string;
  adjustmentReason?: string;
  user?: { id: string; fullName: string; username: string };
  branch?: { id: string; name: string; code: string };
}

export function getLocalPosShifts(): PosShiftRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("bin-essa-pos-shifts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalPosShift(shift: PosShiftRecord) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalPosShifts();
    const idx = existing.findIndex((s) => s.id === shift.id);
    if (idx >= 0) {
      existing[idx] = shift;
    } else {
      existing.unshift(shift);
    }
    localStorage.setItem("bin-essa-pos-shifts", JSON.stringify(existing));
  } catch {
    // Ignore storage errors
  }
}

export async function getCurrentPosShiftRequest(userId?: string, branchId?: string): Promise<PosShiftRecord | null> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = new URLSearchParams();
  if (userId) query.set("userId", userId);
  if (branchId) query.set("branchId", branchId);
  try {
    const res = await fetch(`${API_BASE}/pos-shifts/current?${query.toString()}`, {
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

  // Local storage fallback
  const local = getLocalPosShifts();
  return (
    local.find(
      (s) =>
        s.status === "OPEN" &&
        (!userId || s.userId === userId) &&
        (!branchId || s.branchId === branchId)
    ) || null
  );
}

export async function openPosShiftRequest(payload: {
  userId: string;
  branchId: string;
  openingFloat: number;
}): Promise<PosShiftRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  
  const fallbackShift: PosShiftRecord = {
    id: `shift-local-${Date.now()}`,
    shiftNumber: `SHIFT-${String(getLocalPosShifts().length + 1).padStart(4, "0")}`,
    userId: payload.userId,
    branchId: payload.branchId,
    openingFloat: payload.openingFloat,
    cashSalesTotal: 0,
    knetSalesTotal: 0,
    hesabiSalesTotal: 0,
    tabbySalesTotal: 0,
    cardSalesTotal: 0,
    creditSalesTotal: 0,
    otherSalesTotal: 0,
    totalSales: 0,
    returnsTotal: 0,
    discountsTotal: 0,
    giftsTotal: 0,
    giftsCount: 0,
    closingCashExpected: payload.openingFloat,
    closingCashActual: 0,
    cashVariance: 0,
    status: "OPEN",
    openedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE}/pos-shifts/open`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalPosShift(data);
      clearApiCache();
      return data;
    }
  } catch (e) {
    console.warn("Backend unavailable for openPosShift, using local fallback", e);
  }

  saveLocalPosShift(fallbackShift);
  saveSystemAuditLog({
    id: `audit-${Date.now()}`,
    action: "SHIFT_OPEN",
    entityId: fallbackShift.id,
    referenceNumber: fallbackShift.shiftNumber,
    branchId: payload.branchId,
    userId: payload.userId,
    description: `POS Shift #${fallbackShift.shiftNumber} opened with float ${payload.openingFloat.toFixed(3)} KWD`,
    createdAt: new Date().toISOString(),
  });
  clearApiCache();
  return fallbackShift;
}

export async function closePosShiftRequest(
  id: string,
  payload: {
    closingCashActual: number;
    notes?: string;
    metrics?: {
      cashSalesTotal?: number;
      knetSalesTotal?: number;
      hesabiSalesTotal?: number;
      tabbySalesTotal?: number;
      cardSalesTotal?: number;
      creditSalesTotal?: number;
      otherSalesTotal?: number;
      totalSales?: number;
      returnsTotal?: number;
      discountsTotal?: number;
      giftsTotal?: number;
      giftsCount?: number;
    };
  }
): Promise<PosShiftRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/pos-shifts/${id}/close`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        closingCashActual: payload.closingCashActual,
        notes: payload.notes,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalPosShift(data);
      clearApiCache();
      return data;
    }
  } catch (e) {
    console.warn("Backend unavailable for closePosShift, using local fallback", e);
  }

  // Local fallback
  const local = getLocalPosShifts();
  const existing = local.find((s) => s.id === id);
  const openingFloat = existing ? Number(existing.openingFloat) : 0;
  const cashSales = payload.metrics?.cashSalesTotal ?? (existing ? Number(existing.cashSalesTotal) : 0);
  const returns = payload.metrics?.returnsTotal ?? (existing ? Number(existing.returnsTotal || 0) : 0);
  const expected = openingFloat + cashSales;
  const variance = payload.closingCashActual - expected;

  const closedShift: PosShiftRecord = {
    ...(existing || {
      id,
      shiftNumber: "SHIFT-0001",
      userId: "user-1",
      branchId: "br-01",
      openingFloat,
      openedAt: new Date().toISOString(),
    }),
    cashSalesTotal: cashSales,
    knetSalesTotal: payload.metrics?.knetSalesTotal ?? Number(existing?.knetSalesTotal || 0),
    hesabiSalesTotal: payload.metrics?.hesabiSalesTotal ?? Number(existing?.hesabiSalesTotal || 0),
    tabbySalesTotal: payload.metrics?.tabbySalesTotal ?? Number(existing?.tabbySalesTotal || 0),
    cardSalesTotal: payload.metrics?.cardSalesTotal ?? Number(existing?.cardSalesTotal || 0),
    creditSalesTotal: payload.metrics?.creditSalesTotal ?? Number(existing?.creditSalesTotal || 0),
    otherSalesTotal: payload.metrics?.otherSalesTotal ?? Number(existing?.otherSalesTotal || 0),
    totalSales: payload.metrics?.totalSales ?? Number(existing?.totalSales || 0),
    returnsTotal: returns,
    discountsTotal: payload.metrics?.discountsTotal ?? Number(existing?.discountsTotal || 0),
    giftsTotal: payload.metrics?.giftsTotal ?? Number(existing?.giftsTotal || 0),
    giftsCount: payload.metrics?.giftsCount ?? Number(existing?.giftsCount || 0),
    closingCashExpected: expected,
    closingCashActual: payload.closingCashActual,
    cashVariance: variance,
    status: "CLOSED",
    notes: payload.notes,
    closedAt: new Date().toISOString(),
  };

  saveLocalPosShift(closedShift);
  saveSystemAuditLog({
    id: `audit-${Date.now()}`,
    action: "SHIFT_CLOSE",
    entityId: closedShift.id,
    referenceNumber: closedShift.shiftNumber,
    branchId: closedShift.branchId,
    userId: closedShift.userId,
    description: `POS Shift #${closedShift.shiftNumber} closed. Expected: ${expected.toFixed(3)} KWD, Counted: ${payload.closingCashActual.toFixed(3)} KWD, Variance: ${variance.toFixed(3)} KWD`,
    createdAt: new Date().toISOString(),
  });
  clearApiCache();
  return closedShift;
}

export async function reopenPosShiftRequest(
  id: string,
  payload: { userId: string; userRole: string; reason: string }
): Promise<PosShiftRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/pos-shifts/${id}/reopen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalPosShift(data);
      clearApiCache();
      return data;
    }
  } catch (e) {
    console.warn("Backend unavailable for reopenPosShift, using local fallback", e);
  }

  // Local fallback
  const local = getLocalPosShifts();
  const existing = local.find((s) => s.id === id);
  if (!existing) throw new Error("Shift not found");

  const reopened: PosShiftRecord = {
    ...existing,
    status: "OPEN",
    reopenedAt: new Date().toISOString(),
    reopenedByUserId: payload.userId,
    adjustmentReason: payload.reason,
  };
  saveLocalPosShift(reopened);
  saveSystemAuditLog({
    id: `audit-${Date.now()}`,
    action: "SHIFT_REOPEN",
    entityId: id,
    referenceNumber: existing.shiftNumber,
    branchId: existing.branchId,
    userId: payload.userId,
    description: `POS Shift #${existing.shiftNumber} reopened by ${payload.userRole} (${payload.userId}). Reason: ${payload.reason}`,
    createdAt: new Date().toISOString(),
  });
  clearApiCache();
  return reopened;
}

export async function adjustPosShiftRequest(
  id: string,
  payload: { userId: string; userRole: string; closingCashActual: number; reason: string }
): Promise<PosShiftRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/pos-shifts/${id}/adjust`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalPosShift(data);
      clearApiCache();
      return data;
    }
  } catch (e) {
    console.warn("Backend unavailable for adjustPosShift, using local fallback", e);
  }

  // Local fallback
  const local = getLocalPosShifts();
  const existing = local.find((s) => s.id === id);
  if (!existing) throw new Error("Shift not found");

  const newVariance = payload.closingCashActual - Number(existing.closingCashExpected);
  const adjusted: PosShiftRecord = {
    ...existing,
    closingCashActual: payload.closingCashActual,
    cashVariance: newVariance,
    adjustedAt: new Date().toISOString(),
    adjustedByUserId: payload.userId,
    adjustmentReason: payload.reason,
  };
  saveLocalPosShift(adjusted);
  saveSystemAuditLog({
    id: `audit-${Date.now()}`,
    action: "SHIFT_ADJUSTMENT",
    entityId: id,
    referenceNumber: existing.shiftNumber,
    branchId: existing.branchId,
    userId: payload.userId,
    description: `POS Shift #${existing.shiftNumber} cash adjusted from ${Number(existing.closingCashActual).toFixed(3)} to ${payload.closingCashActual.toFixed(3)} KWD by ${payload.userRole}. Reason: ${payload.reason}`,
    createdAt: new Date().toISOString(),
  });
  clearApiCache();
  return adjusted;
}

export async function listPosShiftsRequest(branchId?: string): Promise<PosShiftRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/pos-shifts${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn("Backend unavailable for listPosShifts", e);
  }
  const local = getLocalPosShifts();
  return branchId ? local.filter((s) => s.branchId === branchId) : local;
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

export async function updateItemVariantRequest(
  variantId: string,
  payload: {
    sku?: string;
    barcode?: string;
    variantName?: string;
    price?: number;
    cost?: number;
    stock?: number;
  }
): Promise<ItemVariantRecord> {
  const token = localStorage.getItem("bin-essa-access-token");
  try {
    const res = await fetch(`${API_BASE}/item-variants/${variantId}`, {
      method: "PATCH",
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
    console.warn("Backend unavailable for updateItemVariant", e);
  }
  clearApiCache();
  return {
    id: variantId,
    itemId: "",
    sku: payload.sku || "",
    barcode: payload.barcode || "",
    variantName: payload.variantName || "",
    price: payload.price ?? 0,
    cost: payload.cost ?? 0,
    stock: payload.stock ?? 0,
  };
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

// ================= ENTERPRISE FULL BUSINESS SCOPE API CLIENT =================

export async function getCustomerStatementRequest(customerId: string): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/customer-payments/statement/${customerId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for customer statement", e);
  }
  return null;
}

// 2. Stock Adjustments & Counts
export interface StockAdjustmentRecord {
  id: string;
  adjustmentNumber: string;
  branchId: string;
  reason: string;
  status: string;
  totalValue: number;
  notes?: string;
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantityChange: number;
    unitCost: number;
    totalCost: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listStockAdjustmentsRequest(branchId?: string): Promise<StockAdjustmentRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/stock-adjustments${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listStockAdjustments", e);
  }
  return [];
}

export async function createStockAdjustmentRequest(payload: {
  adjustmentNumber: string;
  branchId: string;
  reason: string;
  notes?: string;
  lines: Array<{ itemId: string; quantityChange: number; unitCost?: number }>;
}): Promise<StockAdjustmentRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/stock-adjustments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create stock adjustment");
  }
  clearApiCache();
  return res.json();
}

export interface StockCountRecord {
  id: string;
  countNumber: string;
  branchId: string;
  status: string;
  countedAt: string;
  notes?: string;
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    systemQuantity: number;
    countedQuantity: number;
    variance: number;
    unitCost: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listStockCountsRequest(branchId?: string): Promise<StockCountRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/stock-counts${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listStockCounts", e);
  }
  return [];
}

export async function createStockCountRequest(payload: {
  countNumber: string;
  branchId: string;
  notes?: string;
  lines: Array<{ itemId: string; countedQuantity: number; systemQuantity?: number; unitCost?: number }>;
}): Promise<StockCountRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/stock-counts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create stock count");
  }
  clearApiCache();
  return res.json();
}

export interface StockTransferRecord {
  id: string;
  transferNumber: string;
  fromBranchId: string;
  toBranchId: string;
  status: string;
  notes?: string;
  fromBranch?: { id: string; name: string };
  toBranch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantityRequested: number;
    quantityDispatched?: number;
    quantityReceived?: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listStockTransfersRequest(): Promise<StockTransferRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/stock-transfers`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listStockTransfers", e);
  }
  return [];
}

export async function createStockTransferRequest(payload: {
  transferNumber: string;
  fromBranchId: string;
  toBranchId: string;
  notes?: string;
  lines: Array<{ itemId: string; quantityRequested: number }>;
}): Promise<StockTransferRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/stock-transfers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create stock transfer");
  }
  clearApiCache();
  return res.json();
}

// 3. Purchasing Lifecycle (PR, GRN, Payment Vouchers)
export interface PurchaseRequisitionRecord {
  id: string;
  prNumber: string;
  branchId: string;
  requestedByUserId?: string;
  status: string;
  notes?: string;
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantity: number;
    notes?: string;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listPurchaseRequisitionsRequest(branchId?: string): Promise<PurchaseRequisitionRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/purchase-requisitions${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listPurchaseRequisitions", e);
  }
  return [];
}

export async function createPurchaseRequisitionRequest(payload: {
  prNumber: string;
  branchId: string;
  requestedByUserId?: string;
  notes?: string;
  lines: Array<{ itemId: string; quantity: number; notes?: string }>;
}): Promise<PurchaseRequisitionRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/purchase-requisitions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create purchase requisition");
  }
  clearApiCache();
  return res.json();
}

export interface GoodsReceiptRecord {
  id: string;
  grnNumber: string;
  supplierId: string;
  branchId: string;
  purchaseOrderId?: string;
  status: string;
  notes?: string;
  receivedAt: string;
  supplier?: { id: string; name: string; code: string };
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantityReceived: number;
    unitCost: number;
    lineTotal: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listGoodsReceiptsRequest(branchId?: string): Promise<GoodsReceiptRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/goods-receipts${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listGoodsReceipts", e);
  }
  return [];
}

export async function createGoodsReceiptRequest(payload: {
  grnNumber: string;
  supplierId: string;
  branchId: string;
  purchaseOrderId?: string;
  notes?: string;
  lines: Array<{ itemId: string; quantityReceived: number; unitCost: number }>;
}): Promise<GoodsReceiptRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/goods-receipts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create goods receipt");
  }
  clearApiCache();
  return res.json();
}

// 4. Sales Lifecycle (Quotations, Orders, Deliveries, Receipt Vouchers)
export interface QuotationRecord {
  id: string;
  quoteNumber: string;
  customerId: string;
  branchId: string;
  validUntil?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  notes?: string;
  customer?: { id: string; name: string; code: string };
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listQuotationsRequest(branchId?: string): Promise<QuotationRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/quotations${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listQuotations", e);
  }
  return [];
}

export async function createQuotationRequest(payload: {
  quoteNumber: string;
  customerId: string;
  branchId: string;
  validUntil?: string;
  notes?: string;
  lines: Array<{ itemId: string; quantity: number; unitPrice: number }>;
}): Promise<QuotationRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create quotation");
  }
  clearApiCache();
  return res.json();
}

export interface SalesOrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  branchId: string;
  quotationId?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  notes?: string;
  date?: string;
  customer?: { id: string; name: string; code: string };
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listSalesOrdersRequest(branchId?: string): Promise<SalesOrderRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/sales-orders${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listSalesOrders", e);
  }
  return [];
}

export async function createSalesOrderRequest(payload: {
  orderNumber: string;
  customerId: string;
  branchId: string;
  quotationId?: string;
  notes?: string;
  lines: Array<{ itemId: string; quantity: number; unitPrice: number }>;
}): Promise<SalesOrderRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/sales-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create sales order");
  }
  clearApiCache();
  return res.json();
}

export interface DeliveryNoteRecord {
  id: string;
  deliveryNumber: string;
  customerId: string;
  branchId: string;
  salesOrderId?: string;
  status: string;
  notes?: string;
  dispatchedAt: string;
  customer?: { id: string; name: string; code: string };
  branch?: { id: string; name: string };
  lines?: Array<{
    id: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
    item?: { id: string; name: string; sku: string };
  }>;
  createdAt: string;
}

export async function listDeliveryNotesRequest(branchId?: string): Promise<DeliveryNoteRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/delivery-notes${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listDeliveryNotes", e);
  }
  return [];
}

export async function createDeliveryNoteRequest(payload: {
  deliveryNumber: string;
  customerId: string;
  branchId: string;
  salesOrderId?: string;
  notes?: string;
  lines: Array<{ itemId: string; quantity: number; unitPrice: number }>;
}): Promise<DeliveryNoteRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/delivery-notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create delivery note");
  }
  clearApiCache();
  return res.json();
}

// 5. Vouchers (Receipt Vouchers & Payment Vouchers)
export interface ReceiptVoucherRecord {
  id: string;
  voucherNumber: string;
  date: string;
  customerId: string;
  branchId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  customer?: { id: string; name: string; code: string };
  branch?: { id: string; name: string };
  createdAt: string;
}

export async function listReceiptVouchersRequest(branchId?: string): Promise<ReceiptVoucherRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/vouchers/receipts${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listReceiptVouchers", e);
  }
  return [];
}

export async function createReceiptVoucherRequest(payload: {
  voucherNumber: string;
  customerId: string;
  branchId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}): Promise<ReceiptVoucherRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/vouchers/receipts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create receipt voucher");
  }
  clearApiCache();
  return res.json();
}

export interface PaymentVoucherRecord {
  id: string;
  voucherNumber: string;
  date: string;
  supplierId: string;
  branchId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  supplier?: { id: string; name: string; code: string };
  branch?: { id: string; name: string };
  createdAt: string;
}

export async function listPaymentVouchersRequest(branchId?: string): Promise<PaymentVoucherRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/vouchers/payments${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listPaymentVouchers", e);
  }
  return [];
}

export async function createPaymentVoucherRequest(payload: {
  voucherNumber: string;
  supplierId: string;
  branchId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}): Promise<PaymentVoucherRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/vouchers/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create payment voucher");
  }
  clearApiCache();
  return res.json();
}

// 6. Cash Management
export interface CashAccountRecord {
  id: string;
  code: string;
  name: string;
  branchId?: string;
  balance: number;
  isMain: boolean;
  isActive: boolean;
  branch?: { id: string; name: string };
}

export async function listCashAccountsRequest(branchId?: string): Promise<CashAccountRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/cash/accounts${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listCashAccounts", e);
  }
  return [];
}

export async function createCashAccountRequest(payload: {
  code: string;
  name: string;
  branchId?: string;
  balance?: number;
  isMain?: boolean;
}): Promise<CashAccountRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/cash/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create cash account");
  }
  clearApiCache();
  return res.json();
}

export interface CashTransferRecord {
  id: string;
  transferNumber: string;
  fromCashAccountId: string;
  toCashAccountId: string;
  amount: number;
  status: string;
  notes?: string;
  fromCashAccount?: CashAccountRecord;
  toCashAccount?: CashAccountRecord;
  createdAt: string;
}

export async function listCashTransfersRequest(): Promise<CashTransferRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/cash/transfers`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listCashTransfers", e);
  }
  return [];
}

export async function createCashTransferRequest(payload: {
  transferNumber: string;
  fromCashAccountId: string;
  toCashAccountId: string;
  amount: number;
  notes?: string;
}): Promise<CashTransferRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/cash/transfers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create cash transfer");
  }
  clearApiCache();
  return res.json();
}

// 7. Bank Management
export interface BankAccountRecord {
  id: string;
  code: string;
  name: string;
  bankName: string;
  accountNumber: string;
  iban?: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

export async function listBankAccountsRequest(): Promise<BankAccountRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/banks/accounts`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listBankAccounts", e);
  }
  return [];
}

export async function createBankAccountRequest(payload: {
  code: string;
  name: string;
  bankName: string;
  accountNumber: string;
  iban?: string;
  balance?: number;
  currency?: string;
}): Promise<BankAccountRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/banks/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create bank account");
  }
  clearApiCache();
  return res.json();
}

export interface BankReconciliationRecord {
  id: string;
  bankAccountId: string;
  statementDate: string;
  statementEndingBalance: number;
  bookBalance: number;
  difference: number;
  status: string;
  notes?: string;
  bankAccount?: BankAccountRecord;
  createdAt: string;
}

export async function listBankReconciliationsRequest(bankAccountId?: string): Promise<BankReconciliationRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = bankAccountId ? `?bankAccountId=${encodeURIComponent(bankAccountId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/banks/reconciliations${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listBankReconciliations", e);
  }
  return [];
}

export async function createBankReconciliationRequest(payload: {
  bankAccountId: string;
  statementEndingBalance: number;
  statementDate?: string;
  notes?: string;
}): Promise<BankReconciliationRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/banks/reconciliations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create bank reconciliation");
  }
  clearApiCache();
  return res.json();
}

// 8. Cost Centers & Expenses
export interface CostCenterRecord {
  id: string;
  code: string;
  name: string;
  type: string;
  parentCostCenterId?: string;
  isActive: boolean;
}

export async function listCostCentersRequest(): Promise<CostCenterRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/cost-centers`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listCostCenters", e);
  }
  return [];
}

export async function createCostCenterRequest(payload: {
  code: string;
  name: string;
  type?: string;
  parentCostCenterId?: string;
}): Promise<CostCenterRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/cost-centers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create cost center");
  }
  clearApiCache();
  return res.json();
}

export interface ExpenseCategoryRecord {
  id: string;
  code: string;
  name: string;
  accountId?: string;
  isActive: boolean;
}

export async function listExpenseCategoriesRequest(): Promise<ExpenseCategoryRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/expenses/categories`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listExpenseCategories", e);
  }
  return [];
}

export async function createExpenseCategoryRequest(payload: {
  code: string;
  name: string;
  accountId?: string;
}): Promise<ExpenseCategoryRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/expenses/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create expense category");
  }
  clearApiCache();
  return res.json();
}

export interface ExpenseRecord {
  id: string;
  expenseNumber: string;
  date: string;
  branchId: string;
  categoryId: string;
  costCenterId?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  notes?: string;
  category?: ExpenseCategoryRecord;
  costCenter?: CostCenterRecord;
  branch?: { id: string; name: string };
  createdAt: string;
}

export async function listExpensesRequest(branchId?: string): Promise<ExpenseRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/expenses${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listExpenses", e);
  }
  return [];
}

export async function createExpenseRequest(payload: {
  expenseNumber: string;
  branchId: string;
  categoryId: string;
  costCenterId?: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}): Promise<ExpenseRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to record expense");
  }
  clearApiCache();
  return res.json();
}

// 9. Financial Statements & Reporting
export interface IncomeStatementResponse {
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  currency: string;
}

export async function getIncomeStatementRequest(
  startDate?: string,
  endDate?: string,
  branchId?: string
): Promise<IncomeStatementResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = new URLSearchParams();
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);
  if (branchId) query.set("branchId", branchId);
  try {
    const res = await fetch(`${API_BASE}/financial-reports/income-statement?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for income statement", e);
  }
  return { revenue: 0, cogs: 0, grossProfit: 0, operatingExpenses: 0, netProfit: 0, currency: "KWD" };
}

export interface BalanceSheetResponse {
  assets: { currentAssets: number; totalAssets: number };
  liabilities: { currentLiabilities: number; totalLiabilities: number };
  equity: { capital: number; retainedEarnings: number; totalEquity: number };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  currency: string;
}

export async function getBalanceSheetRequest(
  asOfDate?: string,
  branchId?: string
): Promise<BalanceSheetResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = new URLSearchParams();
  if (asOfDate) query.set("asOfDate", asOfDate);
  if (branchId) query.set("branchId", branchId);
  try {
    const res = await fetch(`${API_BASE}/financial-reports/balance-sheet?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for balance sheet", e);
  }
  return {
    assets: { currentAssets: 0, totalAssets: 0 },
    liabilities: { currentLiabilities: 0, totalLiabilities: 0 },
    equity: { capital: 0, retainedEarnings: 0, totalEquity: 0 },
    totalLiabilitiesAndEquity: 0,
    isBalanced: true,
    currency: "KWD",
  };
}

export interface CashFlowResponse {
  operatingInflows: { salesCashInflow: number; receiptVouchersInflow: number; totalInflow: number };
  operatingOutflows: { expenseCashOutflow: number; paymentVouchersOutflow: number; totalOutflow: number };
  netCashFlow: number;
  currency: string;
}

export async function getCashFlowRequest(
  startDate?: string,
  endDate?: string,
  branchId?: string
): Promise<CashFlowResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = new URLSearchParams();
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);
  if (branchId) query.set("branchId", branchId);
  try {
    const res = await fetch(`${API_BASE}/financial-reports/cash-flow?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for cash flow", e);
  }
  return {
    operatingInflows: { salesCashInflow: 0, receiptVouchersInflow: 0, totalInflow: 0 },
    operatingOutflows: { expenseCashOutflow: 0, paymentVouchersOutflow: 0, totalOutflow: 0 },
    netCashFlow: 0,
    currency: "KWD",
  };
}

export interface InventoryValuationResponse {
  totalValuation: number;
  totalItemsCount: number;
  currency: string;
  itemsValuation: Array<{
    itemId: string;
    sku: string;
    name: string;
    quantity: number;
    unitCost: number;
    valuation: number;
  }>;
}

export async function getInventoryValuationRequest(branchId?: string): Promise<InventoryValuationResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/financial-reports/inventory-valuation${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for inventory valuation", e);
  }
  return { totalValuation: 0, totalItemsCount: 0, currency: "KWD", itemsValuation: [] };
}

// 10. Customer Loyalty & Rewards
export interface LoyaltyAccountRecord {
  id: string;
  customerId: string;
  pointsBalance: number;
  totalPointsEarned?: number;
  tier: string;
  transactions?: Array<{
    id: string;
    points: number;
    type: string;
    reference?: string;
    notes?: string;
    createdAt: string;
  }>;
}

export async function getLoyaltyCustomerAccountRequest(customerId: string): Promise<LoyaltyAccountRecord | null> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  try {
    const res = await fetch(`${API_BASE}/loyalty/customers/${customerId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for getLoyaltyCustomerAccount", e);
  }
  return null;
}

export async function createLoyaltyTransactionRequest(payload: {
  customerId: string;
  points: number;
  type: string;
  reference?: string;
  notes?: string;
  salesInvoiceId?: string;
}): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/loyalty/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create loyalty transaction");
  }
  clearApiCache();
  return res.json();
}

// 11. Sales Targets & Commissions
export interface SalesTargetRecord {
  id: string;
  userId: string;
  branchId?: string;
  targetPeriod?: string;
  targetType?: string;
  commissionRate?: number;
  commissionEarned?: number;
  startDate?: string;
  endDate?: string;
  periodStart?: string;
  periodEnd?: string;
  targetAmount: number;
  achievedAmount: number;
  user?: { id: string; name: string };
  branch?: { id: string; name: string };
  createdAt: string;
}

export async function listSalesTargetsRequest(branchId?: string): Promise<SalesTargetRecord[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
  try {
    const res = await fetch(`${API_BASE}/commissions/targets${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Backend unavailable for listSalesTargets", e);
  }
  return [];
}

export async function createSalesTargetRequest(payload: {
  userId: string;
  branchId?: string;
  targetPeriod?: string;
  targetType?: string;
  commissionRate?: number;
  startDate?: string;
  endDate?: string;
  periodStart?: string;
  periodEnd?: string;
  targetAmount: number;
}): Promise<SalesTargetRecord> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/commissions/targets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create sales target");
  }
  clearApiCache();
  return res.json();
}

export async function calculateCommissionRequest(
  userId: string,
  payload: { period: string; startDate: string; endDate: string }
): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bin-essa-access-token") : null;
  const res = await fetch(`${API_BASE}/commissions/calculate/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to calculate commission");
  }
  clearApiCache();
  return res.json();
}


