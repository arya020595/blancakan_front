/**
 * Auth Route Guard
 * Redirects authenticated users away from login/register pages
 * Provides loading states while checking authentication
 */

"use client";

import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const logger = createLogger("AUTH ROUTE GUARD");

interface AuthRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
}

export function AuthRouteGuard({
  children,
  redirectTo = "/dashboard",
  loadingMessage = "Checking authentication...",
}: AuthRouteGuardProps) {
  const { isAuthenticated, hasHydrated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  logger.debug("Auth route guard rendered", {
    isAuthenticated,
    hasHydrated,
    isLoading,
    hasChecked,
  });

  // Check auth after hydration
  useEffect(() => {
    if (hasHydrated && !hasChecked) {
      logger.info("Store hydrated, checking authentication for auth route");
      checkAuth();
      setHasChecked(true);
    }
  }, [hasHydrated, hasChecked, checkAuth]);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (hasChecked && !isLoading && isAuthenticated) {
      logger.info(
        `User is authenticated, redirecting away from auth page to ${redirectTo}`
      );
      router.push(redirectTo);
    }
  }, [hasChecked, isLoading, isAuthenticated, router, redirectTo]);

  // Show loading while checking auth or redirecting
  if (!hasHydrated || !hasChecked || isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {isAuthenticated ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
            </div>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          )}
          <p className="mt-4 text-gray-600">
            {isAuthenticated ? "Redirecting to dashboard..." : loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  // Show auth form for unauthenticated users
  return <>{children}</>;
}
