/**
 * Authentication Service
 * Follows SOLID principles - Single Responsibility, Dependency Inversion
 */

import { BaseApiService } from "@/lib/api/base-service";
import { API_CONFIG } from "@/lib/api/config";
import { tokenManager as defaultTokenManager } from "@/lib/auth/token-manager";
import {
  IAuthenticationService,
  ITokenManager,
} from "@/lib/interfaces/auth.interfaces";
import { createLogger, ILogger } from "@/lib/utils/logger";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from "../types";

export class AuthApiService
  extends BaseApiService
  implements IAuthenticationService
{
  private readonly logger: ILogger;
  private readonly tokenManager: ITokenManager;

  constructor(tokenManagerInstance: ITokenManager = defaultTokenManager) {
    super("");
    this.tokenManager = tokenManagerInstance;
    this.logger = createLogger("AUTH SERVICE");
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      this.logger.info("Starting login process", {
        email: credentials.email,
        hasPassword: !!credentials.password,
      });

      const response = await this.performLogin(credentials);

      this.logger.info("Login response received", {
        status: response.status,
        hasData: !!response.data,
        hasAuthorization: !!(response.data && response.data.authorization),
      });

      if (response.status === "success" && response.data?.authorization) {
        await this.handleSuccessfulLogin(response.data);
        return true;
      }

      this.logger.warn("Login failed", { status: response.status });
      return false;
    } catch (error) {
      this.logger.error("Login error occurred", error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<boolean> {
    try {
      this.logger.info("Starting registration process", {
        email: userData.user.email,
        name: userData.user.name,
      });

      const response = await this.performRegister(userData);

      if (response.status === "success" && response.data) {
        this.logger.info("Registration successful", {
          userId: response.data.id,
          email: response.data.email,
        });

        await this.handleSuccessfulRegistration(response.data);
        return true;
      }

      this.logger.warn("Registration failed", { status: response.status });
      return false;
    } catch (error) {
      this.logger.error("Registration error occurred", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.logger.info("Starting logout process");

      // Attempt to notify the server
      await this.performLogout();

      // Always clear tokens locally
      this.tokenManager.removeToken();

      this.logger.info("Logout completed");
    } catch (error) {
      // Always clear tokens even if server request fails
      this.tokenManager.removeToken();
      this.logger.error("Logout error (tokens cleared anyway)", error);
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.tokenManager.getRefreshToken();
      if (!refreshToken) {
        this.logger.warn("No refresh token available");
        return false;
      }

      this.logger.info("Attempting to refresh token");

      const response = await this.customAction<LoginResponse>(
        "POST",
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      );

      if (response.status === "success" && response.data?.authorization) {
        await this.handleSuccessfulLogin(response.data);
        this.logger.info("Token refresh successful");
        return true;
      }

      this.logger.warn("Token refresh failed");
      return false;
    } catch (error) {
      this.logger.error("Token refresh error", error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      this.logger.info("Fetching current user profile");

      const response = await this.customAction<User>(
        "GET",
        API_CONFIG.ENDPOINTS.AUTH.PROFILE
      );

      if (response.status === "success" && response.data) {
        this.logger.info("User profile fetched successfully");
        return response.data;
      }

      this.logger.warn("Failed to fetch user profile");
      return null;
    } catch (error) {
      this.logger.error("Error fetching user profile", error);
      return null;
    }
  }

  // Private helper methods
  private async performLogin(
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    return this.customAction<LoginResponse, LoginRequest>(
      "POST",
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  private async performLogout(): Promise<ApiResponse<void>> {
    return this.customAction<void>("POST", API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  }

  private async performRegister(
    userData: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    return this.customAction<RegisterResponse, RegisterRequest>(
      "POST",
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
  }

  private async handleSuccessfulLogin(loginData: LoginResponse): Promise<void> {
    const token = this.tokenManager.extractToken(loginData.authorization);
    this.logger.debug("Storing authentication token", {
      tokenPreview: `${token.substring(0, 20)}...`,
    });

    this.tokenManager.setToken(token);

    // Store refresh token if provided
    if (loginData.refresh_token) {
      this.tokenManager.setRefreshToken(loginData.refresh_token);
    }
  }

  private async handleSuccessfulRegistration(
    registerData: RegisterResponse
  ): Promise<void> {
    const token = this.tokenManager.extractToken(registerData.authorization);
    this.logger.debug("Storing authentication token after registration", {
      tokenPreview: `${token.substring(0, 20)}...`,
    });

    this.tokenManager.setToken(token);

    // Store refresh token if provided
    if (registerData.refresh_token) {
      this.tokenManager.setRefreshToken(registerData.refresh_token);
    }
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();
