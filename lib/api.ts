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
