/**
 * Authentication Store
 * Zustand store for managing authentication state
 * Follows SOLID principles with clear separation of concerns
 */

import { User } from "@/lib/api/types";
import {
  getAuthToken,
  isTokenExpired,
  removeAuthToken,
} from "@/lib/auth/token-manager";
import { createLogger } from "@/lib/utils/logger";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const logger = createLogger("AUTH STORE");

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
  checkAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state - always start with false, check token on demand
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      // Actions
      setUser: (user: User) => {
        logger.debug("Setting user", {
          userId: user.id,
          userEmail: user.email,
        });
        set({ user });
      },

      setIsAuthenticated: (isAuthenticated: boolean) => {
        logger.debug("Setting authentication status", { isAuthenticated });
        set({ isAuthenticated });
      },

      setIsLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      clearAuth: () => {
        logger.info("Clearing authentication state");
        removeAuthToken();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        logger.info("Authentication state cleared");
      },

      checkAuth: () => {
        logger.info("Starting authentication check");

        const token = getAuthToken();
        logger.debug("Token from storage", {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : "null",
        });

        const isValid = token && !isTokenExpired(token);
        logger.info("Token validation result", { isValid });

        if (!isValid) {
          logger.warn("Token invalid/expired, clearing auth");
          get().clearAuth();
          return;
        } else {
          logger.info("Token valid, setting authenticated to true");
          set({ isAuthenticated: true });
        }

        const currentState = get();
        logger.debug("Final auth state", {
          isAuthenticated: currentState.isAuthenticated,
          hasUser: !!currentState.user,
          isLoading: currentState.isLoading,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          logger.debug("Updating user", { updates });
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        // Don't persist isAuthenticated or hasHydrated - always determine from token
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
          // Force auth check after hydration
          state.checkAuth();
        }
      },
    }
  )
);
