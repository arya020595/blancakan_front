/**
 * Authentication Provider
 * Manages global authentication state initialization
 * Separates auth logic from page components
 */

"use client";

import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { ReactNode, useEffect } from "react";

const logger = createLogger("AUTH PROVIDER");

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state on app startup
    logger.info("Initializing authentication state");
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

// Optional: Loading wrapper for authentication checks
interface AuthLoadingWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthLoadingWrapper({
  children,
  fallback,
}: AuthLoadingWrapperProps) {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
