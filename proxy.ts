import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/login") && token) {
    // Logged-in users don't need the login page — straight to the tools
    return NextResponse.redirect(new URL("/directory", req.url));
  }

  if (pathname === "/" && token) {
    // Logged-in users skip the landing page and land on point
    return NextResponse.redirect(new URL("/directory", req.url));
  }

  // Allow the request to continue if no rules were triggered
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
