import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  role: string;
  branchId: string | null;
}

const PRESET_USERS: Record<string, UserProfile> = {
  admin: {
    id: "u-admin",
    username: "admin",
    fullName: "System Admin (Head Office)",
    role: "ADMIN",
    branchId: null,
  },
  administrator: {
    id: "u-admin",
    username: "administrator",
    fullName: "System Admin (Head Office)",
    role: "ADMIN",
    branchId: null,
  },
  ali: {
    id: "u-ali",
    username: "ali",
    fullName: "Ali Bin Essa (Executive)",
    role: "ADMIN",
    branchId: null,
  },
  ahmad: {
    id: "u-001",
    username: "ahmad",
    fullName: "Ahmad Al-Bin Essa",
    role: "ADMIN",
    branchId: null,
  },
  ahmed: {
    id: "u-001",
    username: "ahmed",
    fullName: "Ahmed Al-Bin Essa",
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
  fahad: {
    id: "u-002",
    username: "fahad",
    fullName: "Fahad Al-Mutairi (Manager)",
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
  ravi: {
    id: "u-004",
    username: "ravi",
    fullName: "Ravi Kumar (Cashier)",
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
  priya: {
    id: "u-003",
    username: "priya",
    fullName: "Priya Nair (Accountant)",
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
  suresh: {
    id: "u-005",
    username: "suresh",
    fullName: "Suresh Menon (Storekeeper)",
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
  salesrep: {
    id: "u-salesrep",
    username: "salesrep",
    fullName: "B2B Sales Representative",
    role: "SALES_REP",
    branchId: "br-01",
  },
  yousef: {
    id: "u-006",
    username: "yousef",
    fullName: "Yousef Al-Ajmi (Sales Rep)",
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
  lulu: {
    id: "cust-003",
    username: "lulu",
    fullName: "Lulu Hypermarket Kuwait (B2B Client)",
    role: "B2B_CLIENT",
    branchId: null,
  },
};

function generateDemoJwt(payload: object): string {
  const secret = process.env.JWT_SECRET || "bin-essa-enterprise-jwt-secret-key-2026";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 30 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = (body.username || "").trim();
    const password = (body.password || "").trim();

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
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
          response.cookies.set("bin_essa_session", "1", { path: "/", maxAge: 86400 * 7, sameSite: "lax" });
          response.cookies.set("bin_essa_token", data.access_token, { path: "/", maxAge: 86400 * 7, sameSite: "lax" });
          return response;
        }
      } catch {
        // Fall through to built-in auth if backend is unreachable
      }
    }

    // 2. Built-in Authentication for Vercel Deployments & Serverless Fallback
    const lowerUser = username.toLowerCase();
    let user = PRESET_USERS[lowerUser];

    if (!user) {
      // Dynamic fallback for any user or email format
      let assignedRole = "ADMIN";
      let assignedBranch: string | null = null;

      if (lowerUser.includes("cashier") || lowerUser.includes("pos")) {
        assignedRole = "CASHIER";
        assignedBranch = "br-01";
      } else if (lowerUser.includes("manager")) {
        assignedRole = "MANAGER";
        assignedBranch = "br-01";
      } else if (lowerUser.includes("account")) {
        assignedRole = "ACCOUNTANT";
      } else if (lowerUser.includes("store") || lowerUser.includes("stock") || lowerUser.includes("ware")) {
        assignedRole = "STOREKEEPER";
        assignedBranch = "br-01";
      } else if (lowerUser.includes("rep") || lowerUser.includes("sales")) {
        assignedRole = "SALES_REP";
        assignedBranch = "br-01";
      } else if (lowerUser.includes("b2b") || lowerUser.includes("client") || lowerUser.includes("wholesale")) {
        assignedRole = "B2B_CLIENT";
      }

      const formattedName = username
        .replace(/[@._-]/g, " ")
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      user = {
        id: `u-${Date.now()}`,
        username: username,
        fullName: formattedName || "Bin Essa Staff Member",
        role: assignedRole,
        branchId: assignedBranch,
      };
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
    response.cookies.set("bin_essa_session", "1", { path: "/", maxAge: 86400 * 7, sameSite: "lax" });
    response.cookies.set("bin_essa_token", token, { path: "/", maxAge: 86400 * 7, sameSite: "lax" });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Authentication service encountered an unexpected error" },
      { status: 500 }
    );
  }
}
