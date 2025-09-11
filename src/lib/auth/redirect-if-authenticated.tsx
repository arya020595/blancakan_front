/**
 * Redirect If Authenticated Hook
 * Redirects authenticated users away from auth pages (login, register, etc.)
 * Follows SOLID principles with clean separation of concerns
 */

"use client";

import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const logger = createLogger("REDIRECT IF AUTH");

// Configuration interface
interface RedirectIfAuthenticatedOptions {
  redirectTo?: string;
  loadingComponent?: React.ComponentType<{ message?: string }>;
  checkInterval?: number;
}

// Default loading component for authenticated users
const DefaultAuthenticatedLoadingComponent: React.FC<{ message?: string }> = ({
  message = "You are already logged in, redirecting...",
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
      <p className="mt-2 text-sm text-gray-500">Please wait...</p>
    </div>
  </div>
);

// Service class for handling authenticated user redirects
class AuthenticatedRedirectService {
  /**
   * Determines the redirect URL for authenticated users
   */
  static getRedirectUrl(
    searchParams: URLSearchParams,
    defaultRedirect: string
  ): string {
    // Check for return_to parameter (where user was trying to go)
    const returnTo = searchParams.get("return_to");
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      logger.debug("Using return_to parameter for redirect", { returnTo });
      return returnTo;
    }

    // Check for redirect parameter (fallback)
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      logger.debug("Using redirect parameter for redirect", { redirect });
      return redirect;
    }

    logger.debug("Using default redirect URL", { defaultRedirect });
    return defaultRedirect;
  }

  /**
   * Performs the redirect with proper logging
   */
  static performRedirect(
    router: ReturnType<typeof useRouter>,
    redirectUrl: string
  ): void {
    logger.info("Redirecting authenticated user", { redirectUrl });
    router.replace(redirectUrl);
  }
}

// Hook for redirecting authenticated users
export function useRedirectIfAuthenticated(
  options: RedirectIfAuthenticatedOptions = {}
) {
  const { redirectTo = "/dashboard", checkInterval = 30000 } = options;
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authChecked, setAuthChecked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  logger.debug("Redirect hook state", {
    isAuthenticated,
    isLoading,
    authChecked,
    shouldRedirect,
  });

  // Initial authentication check
  useEffect(() => {
    const performInitialCheck = async () => {
      logger.info("Performing initial authentication check for redirect");

      // Check auth if not already checked
      if (!authChecked) {
        checkAuth();
      }

      setAuthChecked(true);
    };

    performInitialCheck();
  }, [checkAuth, authChecked]);

  // Periodic authentication check
  useEffect(() => {
    if (!authChecked) return;

    const interval = setInterval(() => {
      logger.debug("Performing periodic authentication check for redirect");
      checkAuth();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkAuth, authChecked, checkInterval]);

  // Handle redirect when authenticated
  useEffect(() => {
    if (!authChecked || isLoading) return;

    if (isAuthenticated) {
      logger.info("User is authenticated, preparing redirect");
      setShouldRedirect(true);

      // Small delay to show loading state, then redirect
      const timer = setTimeout(() => {
        const redirectUrl = AuthenticatedRedirectService.getRedirectUrl(
          searchParams,
          redirectTo
        );
        AuthenticatedRedirectService.performRedirect(router, redirectUrl);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShouldRedirect(false);
    }
  }, [
    isAuthenticated,
    authChecked,
    isLoading,
    router,
    searchParams,
    redirectTo,
  ]);

  return {
    isAuthenticated,
    isLoading,
    authChecked,
    shouldRedirect,
    shouldShowLoginForm: authChecked && !isLoading && !isAuthenticated,
  };
}

// Higher-Order Component to protect auth pages from authenticated users
export function withRedirectIfAuthenticated<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: RedirectIfAuthenticatedOptions = {}
): React.ComponentType<P> {
  const {
    redirectTo = "/dashboard",
    loadingComponent: LoadingComponent = DefaultAuthenticatedLoadingComponent,
    checkInterval = 30000,
  } = options;

  const RedirectProtectedComponent: React.FC<P> = (props) => {
    const { shouldShowLoginForm, shouldRedirect, isLoading } =
      useRedirectIfAuthenticated({
        redirectTo,
        checkInterval,
      });

    logger.debug("Redirect protection component state", {
      shouldShowLoginForm,
      shouldRedirect,
      isLoading,
    });

    // Show loading while checking auth or redirecting
    if (!shouldShowLoginForm || shouldRedirect) {
      const message = shouldRedirect
        ? "You are already logged in, redirecting..."
        : "Checking authentication status...";
      return <LoadingComponent message={message} />;
    }

    // Show the login form only if user is not authenticated
    logger.debug("Rendering login form for unauthenticated user");
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  RedirectProtectedComponent.displayName = `withRedirectIfAuthenticated(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return RedirectProtectedComponent;
}

// Utility component for conditional rendering based on authentication status
interface AuthenticatedConditionalProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const AuthenticatedConditional: React.FC<
  AuthenticatedConditionalProps
> = ({ children, fallback, redirectTo = "/dashboard" }) => {
  const { shouldShowLoginForm, shouldRedirect } = useRedirectIfAuthenticated({
    redirectTo,
  });

  if (!shouldShowLoginForm || shouldRedirect) {
    return <>{fallback || <DefaultAuthenticatedLoadingComponent />}</>;
  }

  return <>{children}</>;
};
