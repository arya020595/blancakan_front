/**
 * Server Authentication Guard
 * Handles server-side authentication validation for server components
 * Follows SOLID principles with clear separation of concerns
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { getTokenFromCookies, isTokenExpired } from "./token-manager";

// Authentication result interface
interface AuthenticationResult {
  isAuthenticated: boolean;
  token: string | null;
  redirectUrl?: string;
}

// Server authentication service - Single Responsibility
export class ServerAuthService {
  /**
   * Validates authentication on server-side
   * @returns Authentication result with token and status
   */
  static async validateAuthentication(): Promise<AuthenticationResult> {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const token = getTokenFromCookies(cookieHeader);

      if (!token) {
        return {
          isAuthenticated: false,
          token: null,
          redirectUrl: "/login?reason=no_token",
        };
      }

      if (isTokenExpired(token)) {
        return {
          isAuthenticated: false,
          token: null,
          redirectUrl: "/login?reason=token_expired",
        };
      }

      return {
        isAuthenticated: true,
        token,
      };
    } catch (error) {
      console.error("🔒 [SERVER AUTH] Authentication validation error:", error);
      return {
        isAuthenticated: false,
        token: null,
        redirectUrl: "/login?reason=auth_error",
      };
    }
  }

  /**
   * Requires authentication for server components
   * Automatically redirects if not authenticated
   * @returns Valid token if authenticated
   */
  static async requireAuthentication(): Promise<string> {
    const authResult = await this.validateAuthentication();

    if (!authResult.isAuthenticated) {
      console.log(
        "🔒 [SERVER AUTH] Authentication required, redirecting to login"
      );
      redirect(authResult.redirectUrl || "/login");
    }

    console.log("✅ [SERVER AUTH] Authentication validated successfully");
    return authResult.token!;
  }

  /**
   * Optional authentication check - doesn't redirect
   * @returns Authentication result for conditional rendering
   */
  static async checkAuthentication(): Promise<AuthenticationResult> {
    return this.validateAuthentication();
  }
}

// High-Order Component for server-side auth protection
export function withServerAuth<T = {}>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const AuthenticatedServerComponent = async (props: T) => {
    // Require authentication before rendering
    await ServerAuthService.requireAuthentication();

    // @ts-ignore - Next.js server component
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedServerComponent as React.ComponentType<T>;
}

// Utility function for protected server actions
export async function executeWithAuth<T>(
  action: (token: string) => Promise<T>
): Promise<T> {
  const token = await ServerAuthService.requireAuthentication();
  return action(token);
}
