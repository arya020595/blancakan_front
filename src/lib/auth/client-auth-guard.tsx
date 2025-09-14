/**
 * Client Authentication Guard
 * Handles client-side authentication protection with loading states
 * Follows SOLID principles and provides excellent UX
 */

"use client";

import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const logger = createLogger("CLIENT AUTH GUARD");

// Loading component interface
interface LoadingComponentProps {
  message?: string;
}

// Default loading component
const DefaultLoadingComponent: React.FC<LoadingComponentProps> = ({
  message = "Verifying authentication...",
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

// Unauthorized component
const DefaultUnauthorizedComponent: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="rounded-full bg-red-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600 mb-4">
        You need to be logged in to access this page.
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Go to Login
      </button>
    </div>
  </div>
);

// Auth guard options
interface AuthGuardOptions {
  redirectUrl?: string;
  loadingComponent?: React.ComponentType<LoadingComponentProps>;
  unauthorizedComponent?: React.ComponentType;
  requireAuth?: boolean;
  checkInterval?: number;
}

// Client authentication service
class ClientAuthService {
  static async waitForAuthCheck(
    checkAuth: () => void,
    isLoading: boolean,
    maxWaitTime: number = 5000
  ): Promise<void> {
    checkAuth();

    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (!isLoading || Date.now() - startTime > maxWaitTime) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
}

// Higher-Order Component for client auth protection
export function withClientAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: AuthGuardOptions = {}
): React.ComponentType<P> {
  const {
    redirectUrl = "/login",
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
    unauthorizedComponent: UnauthorizedComponent = DefaultUnauthorizedComponent,
    requireAuth = true,
    checkInterval = 30000, // 30 seconds
  } = options;

  const AuthGuardedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    logger.debug("Auth guard component rendered", {
      isAuthenticated,
      isLoading,
      authChecked,
      isInitializing,
    });

    // Initial authentication check
    useEffect(() => {
      const performInitialAuthCheck = async () => {
        logger.info("Performing initial authentication check");
        setIsInitializing(true);

        await ClientAuthService.waitForAuthCheck(checkAuth, isLoading);

        setAuthChecked(true);
        setIsInitializing(false);
        logger.info("Initial authentication check completed");
      };

      performInitialAuthCheck();
    }, [checkAuth, isLoading]);

    // Periodic authentication check
    useEffect(() => {
      if (!requireAuth || !authChecked) return;

      // Periodic authentication check
      const interval = setInterval(() => {
        logger.debug("Performing periodic authentication check");
        checkAuth();
      }, checkInterval);

      return () => clearInterval(interval);
    }, [authChecked, checkAuth]);

    // Handle authentication state changes
    useEffect(() => {
      if (!authChecked || isInitializing) return;

      if (requireAuth && !isAuthenticated) {
        logger.warn(
          "Authentication required but user not authenticated, redirecting"
        );
        const currentPath = window.location.pathname;
        const loginUrl = `${redirectUrl}?redirect=${encodeURIComponent(
          currentPath
        )}`;
        router.push(loginUrl);
      }
    }, [isAuthenticated, authChecked, isInitializing, router]);

    // Show loading during initialization or auth check
    if (isInitializing || isLoading) {
      return <LoadingComponent message="Verifying authentication..." />;
    }

    // Show unauthorized if auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      return <UnauthorizedComponent />;
    }

    // Render the protected component
    logger.debug("Rendering protected component");
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AuthGuardedComponent.displayName = `withClientAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthGuardedComponent;
}

// Hook for conditional rendering based on auth status
export function useAuthGuard(requireAuth: boolean = true) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
    setAuthChecked(true);
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    authChecked,
    canAccess: !requireAuth || isAuthenticated,
    shouldRedirect:
      requireAuth && authChecked && !isLoading && !isAuthenticated,
  };
}

// Utility component for conditional auth-based rendering
interface AuthConditionalProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ComponentType<LoadingComponentProps>;
  requireAuth?: boolean;
}

export const AuthConditional: React.FC<AuthConditionalProps> = ({
  children,
  fallback = <DefaultUnauthorizedComponent />,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  requireAuth = true,
}) => {
  const { canAccess, isLoading, authChecked } = useAuthGuard(requireAuth);

  if (!authChecked || isLoading) {
    return <LoadingComponent />;
  }

  return canAccess ? <>{children}</> : <>{fallback}</>;
};
