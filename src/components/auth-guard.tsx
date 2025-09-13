/**
 * Authentication Guard Component
 * Handles automatic redirects based on authentication status
 */

"use client";

import { setupAuthDebug } from "@/lib/auth/debug";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const logger = createLogger("AUTH GUARD");

export default function AuthGuard() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  logger.debug("Component rendered with state", {
    isAuthenticated,
    isLoading,
    hasChecked,
  });

  // Setup debug tools in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setupAuthDebug();
    }
  }, []);

  useEffect(() => {
    logger.debug("First useEffect triggered - performing auth check");

    // Check authentication status on component mount
    const performAuthCheck = async () => {
      logger.info("Starting authentication check...");
      checkAuth();
      setHasChecked(true);
      logger.info("Authentication check completed, hasChecked set to true");
    };

    performAuthCheck();
  }, [checkAuth]);

  useEffect(() => {
    logger.debug("Second useEffect triggered with values", {
      hasChecked,
      isLoading,
      isAuthenticated,
    });

    // Only redirect after we've checked the auth status and not loading
    if (hasChecked && !isLoading) {
      if (isAuthenticated) {
        // User is logged in, redirect to dashboard
        logger.info("User authenticated, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        // User is not logged in, redirect to login
        logger.info("User not authenticated, redirecting to login");
        router.push("/login");
      }
    } else {
      logger.debug("Not ready to redirect yet", {
        reason: !hasChecked
          ? "Authentication not checked yet"
          : "Still loading",
      });
    }
  }, [isAuthenticated, hasChecked, isLoading, router]);

  // Show loading spinner while checking authentication or loading
  if (!hasChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
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
