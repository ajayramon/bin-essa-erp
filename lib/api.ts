const API_BASE = "https://emphases-manger-imaginary.ngrok-free.dev";

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
      "ngrok-skip-browser-warning": "true",
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
      "ngrok-skip-browser-warning": "true",
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
