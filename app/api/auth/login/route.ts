import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const SEED_USERS: Record<
  string,
  {
    id: string;
    username: string;
    fullName: string;
    role: string;
    branchId: string | null;
  }
> = {
  admin: {
    id: "u-admin",
    username: "admin",
    fullName: "System Admin (Head Office)",
    role: "ADMIN",
    branchId: null,
  },
  manager: {
    id: "u-manager",
    username: "manager",
    fullName: "Branch Manager (Shuwaikh)",
    role: "MANAGER",
    branchId: "br-01",
  },
  cashier: {
    id: "u-cashier",
    username: "cashier",
    fullName: "Retail Cashier",
    role: "CASHIER",
    branchId: "br-01",
  },
  accountant: {
    id: "u-accountant",
    username: "accountant",
    fullName: "Head Accountant",
    role: "ACCOUNTANT",
    branchId: null,
  },
  storekeeper: {
    id: "u-storekeeper",
    username: "storekeeper",
    fullName: "Warehouse Storekeeper",
    role: "STOREKEEPER",
    branchId: "br-01",
  },
  sales_rep: {
    id: "u-salesrep",
    username: "sales_rep",
    fullName: "B2B Sales Representative",
    role: "SALES_REP",
    branchId: "br-01",
  },
  b2b_client_01: {
    id: "cust-001",
    username: "b2b_client_01",
    fullName: "Trolley Convenience Stores (B2B Client)",
    role: "B2B_CLIENT",
    branchId: null,
  },
  trolley: {
    id: "cust-001",
    username: "trolley",
    fullName: "Trolley Convenience Stores (B2B Client)",
    role: "B2B_CLIENT",
    branchId: null,
  },
  bodega: {
    id: "cust-002",
    username: "bodega",
    fullName: "Bodega Kuwait Chain (B2B Client)",
    role: "B2B_CLIENT",
    branchId: null,
  },
};

function generateDemoJwt(payload: object): string {
  const secret = process.env.JWT_SECRET || "bin-essa-enterprise-jwt-secret-key-2026";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // 1. If an external or internal backend URL is configured, try proxying to it
    const backendUrl = process.env.INTERNAL_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl && backendUrl !== "/api") {
      try {
        const backendRes = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          const response = NextResponse.json(data);
          response.cookies.set("bin_essa_session", "1", { path: "/", maxAge: 86400, sameSite: "lax" });
          response.cookies.set("bin_essa_token", data.access_token, { path: "/", maxAge: 86400, sameSite: "lax" });
          return response;
        }
      } catch {
        // Fall through to built-in auth if backend is unreachable
      }
    }

    // 2. Built-in Authentication for Vercel Deployments & Demo/Production Fallback
    const user = SEED_USERS[username.toLowerCase().trim()];
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials. Available demo accounts: 'admin', 'manager', 'cashier', 'accountant', 'trolley' with password 'demo1234'" },
        { status: 401 }
      );
    }

    if (password !== "demo1234") {
      return NextResponse.json(
        { message: "Invalid credentials. Default password is 'demo1234'" },
        { status: 401 }
      );
    }

    const token = generateDemoJwt({
      sub: user.id,
      username: user.username,
      role: user.role,
      branchId: user.branchId,
    });

    const responseData = {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        branchId: user.branchId,
      },
    };

    const response = NextResponse.json(responseData);
    response.cookies.set("bin_essa_session", "1", { path: "/", maxAge: 86400, sameSite: "lax" });
    response.cookies.set("bin_essa_token", token, { path: "/", maxAge: 86400, sameSite: "lax" });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
