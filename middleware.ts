/**
 * Authentication Middleware
 * Protects dashboard routes and handles token validation
 * Follows SOLID principles with clear separation of concerns
 */

import { getTokenFromCookies, isTokenExpired } from "@/lib/auth/token-manager";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Route configuration - Single Responsibility
interface RouteConfig {
  protectedRoutes: string[];
  authRoutes: string[];
  publicRoutes: string[];
  defaultRedirectAfterLogin: string;
  defaultRedirectAfterLogout: string;
}

const ROUTE_CONFIG: RouteConfig = {
  protectedRoutes: ["/dashboard"],
  authRoutes: ["/login", "/register"],
  publicRoutes: ["/", "/about", "/contact"],
  defaultRedirectAfterLogin: "/dashboard",
  defaultRedirectAfterLogout: "/login",
};

// Authentication service - Single Responsibility
class MiddlewareAuthService {
  static isValidToken(token: string | null): boolean {
    return token ? !isTokenExpired(token) : false;
  }

  static getTokenFromRequest(request: NextRequest): string | null {
    const cookieHeader = request.headers.get("cookie") || "";
    return getTokenFromCookies(cookieHeader);
  }

  static isAuthenticated(request: NextRequest): boolean {
    const token = this.getTokenFromRequest(request);
    return this.isValidToken(token);
  }
}

// Route matcher service - Single Responsibility
class RouteMatcherService {
  static isProtectedRoute(pathname: string): boolean {
    return ROUTE_CONFIG.protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
  }

  static isAuthRoute(pathname: string): boolean {
    return ROUTE_CONFIG.authRoutes.some((route) => pathname.startsWith(route));
  }

  static isPublicRoute(pathname: string): boolean {
    return ROUTE_CONFIG.publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
  }
}

// Redirect service - Single Responsibility
class RedirectService {
  static createLoginRedirect(
    request: NextRequest,
    pathname: string
  ): NextResponse {
    const loginUrl = new URL(
      ROUTE_CONFIG.defaultRedirectAfterLogout,
      request.url
    );
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "authentication_required");

    console.log(
      `🔒 [MIDDLEWARE] Redirecting unauthenticated user from ${pathname} to login`
    );
    return NextResponse.redirect(loginUrl);
  }

  static createDashboardRedirect(request: NextRequest): NextResponse {
    const redirectPath =
      request.nextUrl.searchParams.get("redirect") ||
      ROUTE_CONFIG.defaultRedirectAfterLogin;
    const dashboardUrl = new URL(redirectPath, request.url);

    console.log(
      `✅ [MIDDLEWARE] Redirecting authenticated user from auth page to ${redirectPath}`
    );
    return NextResponse.redirect(dashboardUrl);
  }

  static createUnauthorizedResponse(): NextResponse {
    console.log(`❌ [MIDDLEWARE] Access denied - insufficient permissions`);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

// Main middleware function - Orchestrates the flow
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`🔍 [MIDDLEWARE] Processing request for: ${pathname}`);

  // Check authentication status
  const isAuthenticated = MiddlewareAuthService.isAuthenticated(request);
  console.log(
    `🔐 [MIDDLEWARE] Authentication status: ${
      isAuthenticated ? "authenticated" : "not authenticated"
    }`
  );

  // Determine route type
  const isProtectedRoute = RouteMatcherService.isProtectedRoute(pathname);
  const isAuthRoute = RouteMatcherService.isAuthRoute(pathname);
  const isPublicRoute = RouteMatcherService.isPublicRoute(pathname);

  console.log(`📍 [MIDDLEWARE] Route classification:`, {
    isProtectedRoute,
    isAuthRoute,
    isPublicRoute,
  });

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return RedirectService.createLoginRedirect(request, pathname);
  }

  // Note: Auth routes (login/register) are handled by client-side redirect logic
  // This allows for better UX with loading states and smooth transitions
  // The client-side withRedirectIfAuthenticated HOC will handle authenticated users

  // Allow access to public routes and authenticated access to protected routes
  console.log(`✅ [MIDDLEWARE] Access granted for: ${pathname}`);
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
