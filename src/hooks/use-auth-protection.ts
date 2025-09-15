/**
 * Authentication Protection Hook
 * Handles authentication checks and redirects for protected routes
 * Provides loading states and auth status for components
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createLogger } from "../lib/utils/logger";
import { useAuthStore } from "../store";

const logger = createLogger("AUTH PROTECTION");

interface UseAuthProtectionOptions {
  /** Where to redirect if not authenticated */
  redirectTo?: string;
  /** Whether to show detailed logging */
  enableLogging?: boolean;
  /** Custom loading messages */
  loadingMessages?: {
    hydrating?: string;
    checking?: string;
    redirecting?: string;
  };
}

interface UseAuthProtectionReturn {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth check is in progress */
  isLoading: boolean;
  /** Whether the store has been hydrated */
  hasHydrated: boolean;
  /** Whether initialization is complete */
  hasInitialized: boolean;
  /** Whether currently redirecting */
  isRedirecting: boolean;
  /** User profile data */
  user: any;
  /** Current loading message */
  loadingMessage: string;
  /** Whether the component should show loading UI */
  shouldShowLoading: boolean;
  /** Whether the component should show protected content */
  shouldShowContent: boolean;
}

export function useAuthProtection(
  options: UseAuthProtectionOptions = {}
): UseAuthProtectionReturn {
  const {
    redirectTo = "/login",
    enableLogging = true,
    loadingMessages = {
      hydrating: "Loading...",
      checking: "Checking authentication...",
      redirecting: "Redirecting to login...",
    },
  } = options;

  const { isAuthenticated, checkAuth, isLoading, hasHydrated, user } =
    useAuthStore();
  const router = useRouter();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize auth check after hydration
  useEffect(() => {
    if (hasHydrated) {
      if (enableLogging) {
        logger.info("Store hydrated, initializing auth protection");
      }
      checkAuth();
      setHasInitialized(true);
    }
  }, [hasHydrated, checkAuth, enableLogging]);

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (enableLogging) {
      logger.debug("Auth protection status check", {
        hasInitialized,
        isLoading,
        isAuthenticated,
        hasHydrated,
        redirectTo,
      });
    }

    if (hasInitialized && !isLoading && !isAuthenticated) {
      if (enableLogging) {
        logger.info(`User not authenticated, redirecting to ${redirectTo}`);
      }
      setIsRedirecting(true);
      router.push(redirectTo);
    }
  }, [
    isAuthenticated,
    isLoading,
    hasInitialized,
    router,
    redirectTo,
    enableLogging,
  ]);

  // Reset redirecting state when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(false);
    }
  }, [isAuthenticated]);

  // Determine current state
  const shouldShowLoading =
    !hasHydrated || !hasInitialized || isLoading || isRedirecting;
  const shouldShowContent = hasHydrated && hasInitialized && isAuthenticated;

  // Determine loading message
  let loadingMessage = "";
  if (!hasHydrated) {
    loadingMessage = loadingMessages.hydrating!;
  } else if (!hasInitialized || isLoading) {
    loadingMessage = loadingMessages.checking!;
  } else if (isRedirecting || !isAuthenticated) {
    loadingMessage = loadingMessages.redirecting!;
  }

  return {
    isAuthenticated,
    isLoading,
    hasHydrated,
    hasInitialized,
    isRedirecting,
    user,
    loadingMessage,
    shouldShowLoading,
    shouldShowContent,
  };
}
