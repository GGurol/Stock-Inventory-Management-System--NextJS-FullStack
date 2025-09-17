import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public pages that do not require authentication
const publicRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("session_id")?.value;

  // Check if the user is trying to access a public page
  const isPublicRoute = publicRoutes.includes(path);

  // If the user is logged in and trying to access a public page (like /login),
  // redirect them to the main dashboard page.
  if (isPublicRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is trying to access a protected page (any page that is not public)
  // and they don't have a token, redirect them to the login page.
  if (!isPublicRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise, allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};