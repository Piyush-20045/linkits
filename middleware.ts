import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/login") && token) {
    // Redirect them to the home page
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow the request to continue if no rules were triggered
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
