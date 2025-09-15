/**
 * Protected Layout Component
 * A clean wrapper that handles authentication protection
 * Can be used to wrap any layout that needs authentication
 */

"use client";

import { useAuthProtection } from "@/hooks/use-auth-protection";
import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  redirectTo?: string;
  enableLogging?: boolean;
  loadingComponent?: React.ComponentType<{ message: string }>;
  redirectingComponent?: React.ComponentType<{ message: string }>;
}

export function ProtectedLayout({
  children,
  redirectTo = "/login",
  enableLogging = true,
  loadingComponent: LoadingComponent,
  redirectingComponent: RedirectingComponent,
}: ProtectedLayoutProps) {
  const { shouldShowLoading, shouldShowContent, loadingMessage } =
    useAuthProtection({
      redirectTo,
      enableLogging,
    });

  // Show loading while checking authentication
  if (shouldShowLoading) {
    if (LoadingComponent) {
      return <LoadingComponent message={loadingMessage} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Show redirecting screen for unauthenticated users
  if (!shouldShowContent) {
    if (RedirectingComponent) {
      return <RedirectingComponent message={loadingMessage} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
