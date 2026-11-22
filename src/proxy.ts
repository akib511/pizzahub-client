import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const pathname = request.nextUrl.pathname;

  // Not logged in
  if (!session) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  const role = session.user.role;

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
  // (Admins, customers and guests are sent to their own dashboard / sign-in)
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