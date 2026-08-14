import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface PresetB2BUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
  branchId: string | null;
  customerId: string;
}

const PRESET_B2B: Record<string, PresetB2BUser> = {
  trolley: {
    id: "cust-001",
    username: "trolley",
    fullName: "Trolley Convenience Stores",
    role: "B2B_CUSTOMER",
    branchId: null,
    customerId: "cust-001",
  },
  bodega: {
    id: "cust-002",
    username: "bodega",
    fullName: "Bodega Kuwait Chain",
    role: "B2B_CUSTOMER",
    branchId: null,
    customerId: "cust-002",
  },
  lulu: {
    id: "cust-003",
    username: "lulu",
    fullName: "Lulu Hypermarket Kuwait",
    role: "B2B_CUSTOMER",
    branchId: null,
    customerId: "cust-003",
  },
};

function generateDemoJwt(payload: object): string {
  const secret = process.env.JWT_SECRET || "bin-essa-enterprise-jwt-secret-key-2026";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 30 })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = (body.username || "").trim().toLowerCase();

    if (!username) {
      return NextResponse.json(
        { message: "B2B Account identifier is required" },
        { status: 400 }
      );
    }

    const b2bUser = PRESET_B2B[username] || {
      id: `cust-${Date.now()}`,
      username: username,
      fullName: `${username.toUpperCase()} Wholesale Account`,
      role: "B2B_CUSTOMER",
      branchId: null,
      customerId: `cust-${Date.now()}`,
    };

    const token = generateDemoJwt({
      sub: b2bUser.id,
      username: b2bUser.username,
      role: b2bUser.role,
      branchId: b2bUser.branchId,
      customerId: b2bUser.customerId,
    });

    const responseData = {
      access_token: token,
      user: {
        id: b2bUser.id,
        username: b2bUser.username,
        fullName: b2bUser.fullName,
        role: b2bUser.role,
        branchId: b2bUser.branchId,
      },
    };

    const response = NextResponse.json(responseData, {
      headers: { "x-auth-source": "NEXT_DEMO_FALLBACK" },
    });
    response.cookies.set("bin_essa_session", "1", {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
    });
    response.cookies.set("bin_essa_token", token, {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "B2B Authentication service encountered an error" },
      { status: 500 }
    );
  }
}
