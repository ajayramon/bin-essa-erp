import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Internal routes that require authentication
  const protectedPrefixes = [
    "/dashboard",
    "/group-dashboard",
    "/pos",
    "/sales-invoices",
    "/purchasing",
    "/inventory",
    "/customers",
    "/b2b",
    "/accounting",
    "/hr",
    "/settings",
    "/coming-soon",
  ];

  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("bin_essa_session")?.value;
    const tokenCookie = request.cookies.get("bin_essa_token")?.value;

    if (!sessionCookie && !tokenCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/group-dashboard/:path*",
    "/pos/:path*",
    "/sales-invoices/:path*",
    "/purchasing/:path*",
    "/inventory/:path*",
    "/customers/:path*",
    "/b2b/:path*",
    "/accounting/:path*",
    "/hr/:path*",
    "/settings/:path*",
    "/coming-soon/:path*",
  ],
};
