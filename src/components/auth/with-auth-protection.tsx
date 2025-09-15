/**
 * Authentication Protection Higher-Order Component
 * Wraps components with authentication protection
 */

"use client";

import React from "react";
import { useAuthProtection } from "../../hooks/use-auth-protection";
import { AuthLoadingScreen, AuthRedirectScreen } from "./auth-loading-screens";

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

/**
 * Higher-Order Component for protecting routes
 * Wraps components with authentication protection
 */
export function withAuthProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: UseAuthProtectionOptions = {}
) {
  const ProtectedComponent: React.FC<P> = (props) => {
    const {
      shouldShowLoading,
      shouldShowContent,
      loadingMessage,
      isAuthenticated,
    } = useAuthProtection(options);

    // Show loading UI
    if (shouldShowLoading) {
      return <AuthLoadingScreen message={loadingMessage} />;
    }

    // Show redirecting UI for unauthenticated users
    if (!isAuthenticated) {
      return <AuthRedirectScreen message={loadingMessage} />;
    }

    // Render protected content
    return <Component {...props} />;
  };

  ProtectedComponent.displayName = `withAuthProtection(${
    Component.displayName || Component.name || "Component"
  })`;

  return ProtectedComponent;
}
