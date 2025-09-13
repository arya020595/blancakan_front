/**
 * HTTP Client
 * Axios-based HTTP client with request/response interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import {
  getAuthToken,
  isTokenExpired,
  removeAuthToken,
} from "@/lib/auth/token-manager";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG, HTTP_STATUS } from "./config";
import { ApiError, ApiResponse } from "./types";

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Add CORS configuration
      withCredentials: false, // Don't send cookies with requests
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token to requests
        const token = getAuthToken();
        if (token && !isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date().getTime() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (process.env.NODE_ENV === "development") {
          const endTime = new Date().getTime();
          const duration =
            endTime - (response.config.metadata?.startTime || endTime);
          console.log(
            `API Request: ${response.config.method?.toUpperCase()} ${
              response.config.url
            } - ${duration}ms`
          );
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle token expiration
        if (
          error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshed = await this.refreshToken();
            if (refreshed && originalRequest) {
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            removeAuthToken();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Transform error to our ApiError format
        const responseData = error.response?.data as any;
        const apiError: ApiError = {
          message:
            responseData?.message ||
            error.message ||
            "An unexpected error occurred",
          status: responseData?.status || error.response?.status || 500,
          statusCode: error.response?.status || 500,
          errors: responseData?.errors,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private async refreshToken(): Promise<boolean> {
    try {
      // This should be implemented based on your refresh token logic
      // For now, return false to indicate refresh failed
      return false;
    } catch (error) {
      return false;
    }
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // HTTP Methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  // File upload method
  async upload<T = any>(
    url: string,
    file: File,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<T>({
      ...config,
      method: "POST",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  }

  // Get axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Extend AxiosRequestConfig to include metadata
declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}
