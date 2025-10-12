/**
 * Authentication Middleware
 * Protects dashboard routes and handles token validation
 *
 * Best Practices (Next.js 15.x):
 * - Uses NextRequest.cookies API instead of manual header parsing
 * - Minimal logging for production performance
 * - Lean implementation optimized for edge runtime
 * - Constants statically analyzable at build time
 */

import { isTokenExpired } from "@/lib/auth/token-manager";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Route configuration (constants for static analysis)
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];
const DEFAULT_REDIRECT_AFTER_LOGIN = "/dashboard";
const DEFAULT_REDIRECT_AFTER_LOGOUT = "/login";

/**
 * Check if user has valid authentication token
 * Uses Next.js built-in cookies API for better performance
 */
function isAuthenticated(request: NextRequest): boolean {
  // Use Next.js cookies API (best practice)
  const token = request.cookies.get("token")?.value || null;

  if (!token) return false;

  return !isTokenExpired(token);
}

/**
 * Check if pathname matches protected routes
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if pathname matches auth routes (login/register)
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Main middleware function
 * Runs on every request matching the config matcher
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication
  const authenticated = isAuthenticated(request);

  // Protected route without authentication → redirect to login
  if (isProtectedRoute(pathname) && !authenticated) {
    const loginUrl = new URL(DEFAULT_REDIRECT_AFTER_LOGOUT, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "authentication_required");
    return NextResponse.redirect(loginUrl);
  }

  // Auth route with authentication → redirect to dashboard
  if (isAuthRoute(pathname) && authenticated) {
    const redirectPath =
      request.nextUrl.searchParams.get("redirect") ||
      DEFAULT_REDIRECT_AFTER_LOGIN;
    const dashboardUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow request to continue
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
