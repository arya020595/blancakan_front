/**
 * Authentication Interceptor
 * Follows Single Responsibility Principle - only handles auth token injection
 */

import { getAuthToken, isTokenExpired } from "@/lib/auth/token-manager";
import { IHttpInterceptor } from "@/lib/interfaces/http.interfaces";
import { createLogger } from "@/lib/utils/logger";

export class AuthInterceptor implements IHttpInterceptor {
  private logger = createLogger("AUTH INTERCEPTOR");

  onRequest = (config: any) => {
    const token = getAuthToken();

    if (token && !isTokenExpired(token)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      this.logger.debug("Added auth token to request");
    } else if (token) {
      this.logger.warn("Token expired, not adding to request");
    }

    return config;
  };

  onError = (error: any) => {
    this.logger.error("Request/Response error in auth interceptor", error);
    return Promise.reject(error);
  };
}
