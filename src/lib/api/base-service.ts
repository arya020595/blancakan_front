/**
 * Base API Service
 * Abstract base class for all API services with common functionality
 */

import { httpClient } from "./http-client";
import { ApiResponse, ListQueryParams, PaginatedResponse } from "./types";

export abstract class BaseApiService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  // Helper method to build URL with path parameters
  protected buildUrl(
    endpoint: string,
    params?: Record<string, string | number>
  ): string {
    let url = `${this.basePath}${endpoint}`;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });
    }

    return url;
  }

  // Helper method to build query string
  protected buildQueryString(params?: ListQueryParams): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          // Handle filters object
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (filterValue !== undefined && filterValue !== null) {
              searchParams.append(`filters[${filterKey}]`, String(filterValue));
            }
          });
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  // Generic CRUD operations
  protected async getList<T>(
    endpoint: string,
    params?: ListQueryParams
  ): Promise<PaginatedResponse<T>> {
    const url = `${this.buildUrl(endpoint)}${this.buildQueryString(params)}`;
    const response = await httpClient.get(url);
    return response as PaginatedResponse<T>;
  }

  protected async getById<T>(
    endpoint: string,
    id: string | number,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, { id: String(id), ...pathParams });
    return httpClient.get<T>(url);
  }

  protected async create<T, K = any>(
    endpoint: string,
    data: K,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    return httpClient.post<T>(url, data);
  }

  protected async createWithFormData<T>(
    endpoint: string,
    formData: FormData,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    // Don't set Content-Type manually - let the browser set it with boundary
    return httpClient.post<T>(url, formData);
  }

  protected async update<T, K = any>(
    endpoint: string,
    id: string | number,
    data: K,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, { id: String(id), ...pathParams });
    return httpClient.put<T>(url, data);
  }

  protected async updateWithFormData<T>(
    endpoint: string,
    id: string | number,
    formData: FormData,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, { id: String(id), ...pathParams });
    // Don't set Content-Type manually - let the browser set it with boundary
    return httpClient.put<T>(url, formData);
  }

  protected async partialUpdate<T, K = any>(
    endpoint: string,
    id: string | number,
    data: K,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, { id: String(id), ...pathParams });
    return httpClient.patch<T>(url, data);
  }

  protected async delete<T = any>(
    endpoint: string,
    id: string | number,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, { id: String(id), ...pathParams });
    return httpClient.delete<T>(url);
  }

  // File upload helper
  protected async uploadFile<T>(
    endpoint: string,
    file: File,
    pathParams?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    return httpClient.upload<T>(url, file);
  }

  // Custom action helper
  protected async customAction<T, K = any>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    data?: K,
    pathParams?: Record<string, string | number>,
    queryParams?: ListQueryParams
  ): Promise<ApiResponse<T>> {
    const url = `${this.buildUrl(endpoint, pathParams)}${this.buildQueryString(
      queryParams
    )}`;

    switch (method) {
      case "GET":
        return httpClient.get<T>(url);
      case "POST":
        return httpClient.post<T>(url, data);
      case "PUT":
        return httpClient.put<T>(url, data);
      case "PATCH":
        return httpClient.patch<T>(url, data);
      case "DELETE":
        return httpClient.delete<T>(url);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
