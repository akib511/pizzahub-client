import { NextRequest, NextResponse } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proxy runs in its own serverless runtime. Calling auth.api.getSession()
  // here would create a second MongoClient that Vercel closes between
  // invocations, causing MongoTopologyClosedError -> 500 on every dashboard.
  // Better Auth's signed session cookie is verifiable without any database.
  const cachedSession = await getCookieCache(request.headers, {
    strategy: "compact",
  }).catch(() => null);

  const role =
    typeof cachedSession?.user?.role === "string"
      ? cachedSession.user.role.toLowerCase()
      : undefined;

  const hasSessionCookie = Boolean(getSessionCookie(request.headers));

  // Not logged in
  if (!cachedSession && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // The cookie cache is short-lived. If it expired but a session token is
  // still present, let the request through and let the client resolve it.
  if (!cachedSession || !role) {
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Vendor routes
  if (pathname.startsWith("/vendor") && role !== "vendor") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Customer routes
  if (pathname.startsWith("/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Stripe payment result pages: vendors only
  if (pathname === "/success" || pathname === "/cancel") {
    if (role !== "vendor") {
      const destination =
        role === "admin"
          ? "/admin"
          : role === "customer"
            ? "/customer/dashboard"
            : "/sign-in";

      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/customer/:path*",
    "/menu/:id",
    "/success",
    "/cancel",
  ],
};
