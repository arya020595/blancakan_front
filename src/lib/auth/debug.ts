/**
 * Debug helper for authentication
 * Useful functions to check auth status in browser console
 */

import {
  getAuthToken,
  getTokenPayload,
  isTokenExpired,
} from "@/lib/auth/token-manager";
import { useAuthStore } from "@/store";

// Add these functions to global window object for easy debugging
declare global {
  interface Window {
    debugAuth: {
      checkStatus: () => void;
      showToken: () => void;
      clearAuth: () => void;
      forceLogin: () => void;
    };
  }
}

export const setupAuthDebug = () => {
  if (typeof window !== "undefined") {
    window.debugAuth = {
      checkStatus: () => {
        const token = getAuthToken();
        const store = useAuthStore.getState();

        console.log("🔍 AUTH DEBUG STATUS:");
        console.log("📊 Store State:", {
          isAuthenticated: store.isAuthenticated,
          hasUser: !!store.user,
          isLoading: store.isLoading,
          user: store.user,
        });
        console.log("🎫 Token Info:", {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 30)}...` : "null",
          isExpired: token ? isTokenExpired(token) : "N/A",
          payload: token ? getTokenPayload(token) : "N/A",
        });
      },

      showToken: () => {
        const token = getAuthToken();
        console.log("🎫 Full Token:", token);
        if (token) {
          console.log("📄 Token Payload:", getTokenPayload(token));
        }
      },

      clearAuth: () => {
        console.log("🧹 Manually clearing auth...");
        useAuthStore.getState().clearAuth();
      },

      forceLogin: () => {
        console.log("🔐 Manually setting login state...");
        useAuthStore.getState().setIsAuthenticated(true);
      },
    };

    console.log("🛠️ Auth debug tools loaded! Use window.debugAuth in console:");
    console.log(
      "  - window.debugAuth.checkStatus() - Check current auth status"
    );
    console.log("  - window.debugAuth.showToken() - Show full token details");
    console.log("  - window.debugAuth.clearAuth() - Manually clear auth");
    console.log("  - window.debugAuth.forceLogin() - Manually set login state");
  }
};
