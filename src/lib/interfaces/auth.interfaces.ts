/**
 * Authentication State Management Interface
 * Follows Interface Segregation Principle - specific interfaces for different concerns
 */

import { User } from "@/lib/api/types";

export interface IAuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

export interface IAuthActions {
  setUser(user: User): void;
  setIsAuthenticated(isAuthenticated: boolean): void;
  setIsLoading(isLoading: boolean): void;
  clearAuth(): void;
  checkAuth(): void;
}

export interface ITokenManager {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  isTokenExpired(token: string): boolean;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  extractToken(authorization: string): string;
  formatAuthorizationHeader(token: string): string;
}

export interface IAuthenticationService {
  login(credentials: { email: string; password: string }): Promise<boolean>;
  logout(): Promise<void>;
  refreshToken(): Promise<boolean>;
  getCurrentUser(): Promise<User | null>;
}
