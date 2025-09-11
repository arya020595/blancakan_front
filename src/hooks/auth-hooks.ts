/**
 * Authentication Hooks
 * Custom hooks for authentication-related operations
 * Follows SOLID principles with proper separation of concerns
 */

import { authApiService } from "@/lib/api/services";
import { ApiError, LoginRequest, User } from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useCallback, useState } from "react";

const logger = createLogger("AUTH HOOKS");

// Custom hook for login functionality
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { setUser, setIsAuthenticated } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        logger.info("Starting login process", {
          email: credentials.email,
          hasPassword: !!credentials.password,
        });

        setIsLoading(true);
        setError(null);

        const success = await authApiService.login(credentials);

        if (success) {
          // Fetch user profile after successful login
          const user = await authApiService.getCurrentUser();
          if (user) {
            logger.info("Login successful, setting user", user);
            setUser(user);
            setIsAuthenticated(true);
            return true;
          }
        }

        logger.warn("Login failed");
        setIsAuthenticated(false);
        return false;
      } catch (err) {
        logger.error("Login error occurred", err);
        const apiError = err as ApiError;
        setError(apiError);
        setIsAuthenticated(false);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setIsAuthenticated]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};

// Logout hook
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { clearAuth } = useAuthStore();

  const logout = useCallback(async (): Promise<void> => {
    try {
      logger.info("Starting logout process");
      setIsLoading(true);
      await authApiService.logout();
      logger.info("Logout successful");
    } catch (error) {
      logger.error("Logout error (clearing local state anyway)", error);
    } finally {
      clearAuth();
      setIsLoading(false);
      window.location.href = "/login";
    }
  }, [clearAuth]);

  return {
    logout,
    isLoading,
  };
};

// Get user profile hook
export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      logger.info("Fetching user profile");
      setIsLoading(true);
      setError(null);

      const user = await authApiService.getCurrentUser();
      if (user) {
        setProfile(user);
        logger.info("User profile fetched successfully");
      } else {
        logger.warn("Failed to fetch user profile");
      }
    } catch (err) {
      logger.error("Error fetching user profile", err);
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    profile,
    fetchProfile,
    isLoading,
    error,
    clearError,
  };
};
