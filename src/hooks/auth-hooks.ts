/**
 * Authentication Hooks
 * Custom hooks for authentication-related operations
 * Follows SOLID principles with proper separation of concerns
 */

import { authApiService } from "@/lib/api/services";
import { ApiError, LoginRequest, RegisterRequest, User } from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useCallback, useState } from "react";

const logger = createLogger("AUTH HOOKS");

// Simple in-flight request cache to prevent duplicate network calls
const inFlightRequests = new Map<string, Promise<any>>();

// Custom hook for login functionality
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { setIsAuthenticated } = useAuthStore();

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
          // Just set authentication state - profile will be fetched by dashboard layout
          logger.info("Login successful");
          setIsAuthenticated(true);
          return true;
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
    [setIsAuthenticated]
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

// Custom hook for registration functionality
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { setIsAuthenticated } = useAuthStore();

  const register = useCallback(
    async (userData: RegisterRequest): Promise<boolean> => {
      try {
        logger.info("Starting registration process", {
          email: userData.user.email,
          name: userData.user.name,
        });

        setIsLoading(true);
        setError(null);

        const success = await authApiService.register(userData);

        if (success) {
          // Just set authentication state - profile will be fetched by dashboard layout
          logger.info("Registration successful");
          setIsAuthenticated(true);
          return true;
        }

        logger.warn("Registration failed");
        setIsAuthenticated(false);
        return false;
      } catch (err) {
        logger.error("Registration error occurred", err);
        const apiError = err as ApiError;
        setError(apiError);
        setIsAuthenticated(false);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsAuthenticated]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    register,
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
    const cacheKey = "user-profile";

    // Return existing promise if request is already in flight
    if (inFlightRequests.has(cacheKey)) {
      logger.info("Reusing in-flight profile fetch");
      return inFlightRequests.get(cacheKey);
    }

    // Create new request promise
    const requestPromise = (async () => {
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
        // Clean up cache entry when request completes
        inFlightRequests.delete(cacheKey);
      }
    })();

    // Cache the promise
    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
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
