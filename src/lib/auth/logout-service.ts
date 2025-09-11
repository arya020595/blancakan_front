/**
 * Logout Utility Service
 * Provides programmatic logout functionality throughout the application
 * Follows SOLID principles with clear separation of concerns
 */

import { authApiService } from "@/lib/api/services";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";

const logger = createLogger("LOGOUT SERVICE");

// Logout service class - Single Responsibility
export class LogoutService {
  /**
   * Performs complete logout process
   * Can be called from anywhere in the application
   */
  static async performLogout(
    options: {
      redirectTo?: string;
      clearLocalStorage?: boolean;
      showLoading?: boolean;
    } = {}
  ): Promise<void> {
    const {
      redirectTo = "/login",
      clearLocalStorage = true,
      showLoading = true,
    } = options;

    try {
      logger.info("Starting programmatic logout", options);

      // Show loading state if requested
      if (showLoading) {
        const { setIsLoading } = useAuthStore.getState();
        setIsLoading(true);
      }

      // Call API logout
      await authApiService.logout();

      // Clear auth state
      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      // Clear additional local storage if requested
      if (clearLocalStorage) {
        LogoutService.clearApplicationData();
      }

      logger.info("Programmatic logout completed successfully");

      // Redirect to specified location
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    } catch (error) {
      logger.error("Programmatic logout error", error);

      // Always clear auth state even if API call fails
      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      if (clearLocalStorage) {
        LogoutService.clearApplicationData();
      }

      // Still redirect even if there was an error
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    }
  }

  /**
   * Clears additional application data from localStorage
   */
  private static clearApplicationData(): void {
    try {
      logger.debug("Clearing additional application data");

      // Clear specific keys that might contain sensitive data
      const keysToRemove = [
        "user-preferences",
        "dashboard-cache",
        "cart-items",
        "recent-searches",
        // Add more keys as needed
      ];

      keysToRemove.forEach((key) => {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      });

      logger.debug("Application data cleared");
    } catch (error) {
      logger.error("Error clearing application data", error);
    }
  }

  /**
   * Quick logout for emergency situations
   * Clears everything immediately without API calls
   */
  static emergencyLogout(): void {
    logger.warn("Emergency logout initiated");

    try {
      // Clear auth state immediately
      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      // Clear all localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }

      // Clear sessionStorage
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.clear();
      }

      // Redirect immediately
      if (typeof window !== "undefined") {
        window.location.href = "/login?reason=emergency_logout";
      }
    } catch (error) {
      logger.error("Emergency logout error", error);
      // Force reload as last resort
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }

  /**
   * Logout with confirmation dialog
   */
  static async logoutWithConfirmation(
    message: string = "Are you sure you want to logout?"
  ): Promise<void> {
    if (typeof window === "undefined") {
      return LogoutService.performLogout();
    }

    const confirmed = window.confirm(message);
    if (confirmed) {
      await LogoutService.performLogout();
    } else {
      logger.info("Logout cancelled by user");
    }
  }

  /**
   * Check if user needs to be logged out due to inactivity
   */
  static checkInactivityLogout(
    lastActivity: Date,
    timeoutMinutes: number = 30
  ): boolean {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

    if (diffMinutes > timeoutMinutes) {
      logger.warn("User inactive for too long, performing automatic logout", {
        lastActivity: lastActivity.toISOString(),
        inactiveMinutes: diffMinutes,
        timeoutMinutes,
      });

      LogoutService.performLogout({
        redirectTo: "/login?reason=inactivity_timeout",
      });

      return true;
    }

    return false;
  }
}

// Convenience functions for easier usage
export const logout = LogoutService.performLogout;
export const emergencyLogout = LogoutService.emergencyLogout;
export const logoutWithConfirmation = LogoutService.logoutWithConfirmation;

// React hook for logout functionality
export function useLogoutService() {
  return {
    performLogout: LogoutService.performLogout,
    emergencyLogout: LogoutService.emergencyLogout,
    logoutWithConfirmation: LogoutService.logoutWithConfirmation,
    checkInactivityLogout: LogoutService.checkInactivityLogout,
  };
}
