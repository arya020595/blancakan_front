/**
 * Authentication Guard Component
 * Handles automatic redirects based on authentication status for the root page
 */

"use client";

import { setupAuthDebug } from "@/lib/auth/debug";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const logger = createLogger("AUTH GUARD");

export default function AuthGuard() {
  const { isAuthenticated, isLoading, hasHydrated, checkAuth } = useAuthStore();
  const router = useRouter();

  logger.debug("Component rendered with state", {
    isAuthenticated,
    isLoading,
    hasHydrated,
  });

  // Setup debug tools in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setupAuthDebug();
    }
  }, []);

  useEffect(() => {
    // Only proceed after store has hydrated
    if (hasHydrated) {
      logger.info("Store hydrated, checking authentication for root redirect");
      checkAuth();
    }
  }, [hasHydrated, checkAuth]);

  useEffect(() => {
    // Only redirect after hydration and auth check is complete
    if (hasHydrated && !isLoading) {
      if (isAuthenticated) {
        logger.info("User authenticated, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        logger.info("User not authenticated, redirecting to login");
        router.push("/login");
      }
    }
  }, [isAuthenticated, hasHydrated, isLoading, router]);

  // Show loading while checking authentication or waiting for hydration
  if (!hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!hasHydrated ? "Loading..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600">
          {isAuthenticated
            ? "Redirecting to dashboard..."
            : "Redirecting to login..."}
        </p>
      </div>
    </div>
  );
}
