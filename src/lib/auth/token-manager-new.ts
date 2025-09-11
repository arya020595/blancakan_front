/**
 * Token Manager
 * Handles JWT token storage, retrieval, and validation
 * Follows SOLID principles with dependency injection and abstractions
 */

import { ITokenManager } from "@/lib/interfaces/auth.interfaces";
import { createLogger, ILogger } from "@/lib/utils/logger";
import Cookies from "js-cookie";

interface ITokenStorage {
  get(key: string): string | null;
  set(key: string, value: string, options?: any): void;
  remove(key: string): void;
}

class CookieTokenStorage implements ITokenStorage {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get(key) || null;
  }

  set(key: string, value: string, options: any = {}): void {
    if (typeof window === "undefined") return;
    Cookies.set(key, value, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      ...options,
    });
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    Cookies.remove(key);
  }
}

class TokenManager implements ITokenManager {
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly storage: ITokenStorage;
  private readonly logger: ILogger;

  constructor(storage: ITokenStorage = new CookieTokenStorage()) {
    this.storage = storage;
    this.logger = createLogger("TOKEN MANAGER");
  }

  getToken(): string | null {
    const token = this.storage.get(this.TOKEN_KEY);
    this.logger.debug(
      "Getting auth token from storage:",
      token ? `${token.substring(0, 20)}...` : "null"
    );
    return token;
  }

  setToken(token: string): void {
    this.logger.debug("Storing auth token:", `${token.substring(0, 20)}...`);
    this.storage.set(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    this.logger.debug("Removing auth tokens");
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      if (!token) {
        this.logger.debug("No token provided, considering expired");
        return true;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      this.logger.debug("Token validation:", {
        tokenExpiry: payload.exp,
        currentTime: currentTime,
        isExpired: payload.exp < currentTime,
        timeUntilExpiry: payload.exp - currentTime,
      });

      return payload.exp < currentTime;
    } catch (error) {
      this.logger.error("Error decoding token, considering expired:", error);
      return true;
    }
  }

  getRefreshToken(): string | null {
    return this.storage.get(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    this.storage.set(this.REFRESH_TOKEN_KEY, token, { expires: 30 });
  }

  getTokenPayload(token: string): any | null {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      this.logger.error("Error parsing token payload:", error);
      return null;
    }
  }

  extractToken(authorization: string): string {
    return authorization.startsWith("Bearer ")
      ? authorization.substring(7)
      : authorization;
  }

  formatAuthorizationHeader(token: string): string {
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
}

// Singleton instance
const tokenManager = new TokenManager();

// Public API - follows facade pattern
export const getAuthToken = (): string | null => tokenManager.getToken();
export const setAuthToken = (token: string): void =>
  tokenManager.setToken(token);
export const removeAuthToken = (): void => tokenManager.removeToken();
export const isTokenExpired = (token: string): boolean =>
  tokenManager.isTokenExpired(token);
export const getRefreshToken = (): string | null =>
  tokenManager.getRefreshToken();
export const setRefreshToken = (token: string): void =>
  tokenManager.setRefreshToken(token);
export const getTokenPayload = (token: string): any | null =>
  tokenManager.getTokenPayload(token);
export const extractToken = (authorization: string): string =>
  tokenManager.extractToken(authorization);
export const formatAuthorizationHeader = (token: string): string =>
  tokenManager.formatAuthorizationHeader(token);

// Server-side helpers
export const getTokenFromCookies = (cookieHeader: string): string | null => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies["auth_token"] || null;
};

export const setTokenCookie = (token: string): string => {
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";

  return `auth_token=${token}; Max-Age=${maxAge}; Path=/${secure}${sameSite}`;
};

// Export the token manager instance for dependency injection
export { CookieTokenStorage, tokenManager, TokenManager };
