/**
 * Server-Side API Client
 * HTTP client configured for server-side rendering
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { API_CONFIG } from "./config";
import { ApiError, ApiResponse } from "./types";

class ServerHttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  // Get authorization header from cookies
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get("auth_token");

      if (authCookie?.value) {
        return {
          Authorization: `Bearer ${authCookie.value}`,
        };
      }
    } catch {
      // Cookies might not be available in some contexts
      console.warn("Unable to read cookies in server context");
    }

    return {};
  }

  // Generic request method for server-side
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const authHeaders = await this.getAuthHeaders();

      const response = await this.client.request<ApiResponse<T>>({
        ...config,
        headers: {
          ...config.headers,
          ...authHeaders,
        },
      });

      return response.data;
    } catch (error: any) {
      // Transform error to our ApiError format
      const responseData = error.response?.data as any;
      const apiError: ApiError = {
        message:
          responseData?.message ||
          error.message ||
          "An unexpected error occurred",
        status: error.response?.status || 500,
        errors: responseData?.errors,
      };

      throw apiError;
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
}

// Export singleton instance for server-side usage
export const serverHttpClient = new ServerHttpClient();
