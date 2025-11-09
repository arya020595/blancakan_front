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
import { create, StateCreator } from "zustand";
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

// Typed initializer for the auth store
const authCreator: StateCreator<AuthStore> = (set, get) => ({
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
      if (token) {
        logger.warn("Token invalid/expired, clearing auth");
      }
      // Directly clear state instead of calling get().clearAuth() to avoid circular dependency
      removeAuthToken();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      logger.debug("Authentication state cleared");
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
});

// Persist options
const authPersistOptions = {
  name: "auth-storage",
  partialize: (state: AuthStore) => ({
    user: state.user,
    // Don't persist isAuthenticated or hasHydrated - always determine from token
  }),
  onRehydrateStorage: () => (_persistedState?: Partial<AuthStore>) => {
    // Run after rehydrate completes on the client to avoid sync hydration races
    setTimeout(() => {
      // Mark hydrated and trigger a fresh auth check via the real store API
      useAuthStore.setState({ hasHydrated: true });
      const s = useAuthStore.getState();
      s.checkAuth?.();
    }, 0);
  },
} as const;

export const useAuthStore = create<AuthStore>(
  persist(authCreator, authPersistOptions) as unknown as StateCreator<AuthStore>
);
