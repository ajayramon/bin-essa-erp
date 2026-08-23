import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Internal routes requiring authentication
  const protectedPrefixes = [
    "/dashboard",
    "/group-dashboard",
    "/pos",
    "/sales",
    "/sales-invoices",
    "/purchasing",
    "/inventory",
    "/customers",
    "/promotions",
    "/b2b",
    "/accounting",
    "/hr",
    "/settings",
  ];

  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("bin_essa_session")?.value;
    const tokenCookie = request.cookies.get("bin_essa_token")?.value;

    if (!sessionCookie && !tokenCookie) {
      // Choose appropriate login page based on target route
      const isB2BRoute = pathname.startsWith("/b2b");
      const loginPath = isB2BRoute ? "/b2b-login" : "/login";
      const loginUrl = new URL(loginPath, request.url);
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
    "/sales/:path*",
    "/sales-invoices/:path*",
    "/purchasing/:path*",
    "/inventory/:path*",
    "/customers/:path*",
    "/promotions/:path*",
    "/b2b/:path*",
    "/accounting/:path*",
    "/hr/:path*",
    "/settings/:path*",
  ],
};
