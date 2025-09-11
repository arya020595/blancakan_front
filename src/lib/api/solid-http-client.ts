/**
 * Improved HTTP Client with SOLID principles
 * Follows Open/Closed Principle - extensible without modification
 */

import {
  IHttpClient,
  IHttpInterceptor,
} from "@/lib/interfaces/http.interfaces";
import { createLogger, ILogger } from "@/lib/utils/logger";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_CONFIG } from "./config";

export class SolidHttpClient implements IHttpClient {
  private client: AxiosInstance;
  private interceptors: IHttpInterceptor[] = [];
  private logger: ILogger;

  constructor() {
    this.logger = createLogger("HTTP CLIENT");
    this.client = this.createAxiosInstance();
    this.setupBaseInterceptors();
  }

  addInterceptor(interceptor: IHttpInterceptor): void {
    this.interceptors.push(interceptor);
    this.setupInterceptors();
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: false,
    });
  }

  private setupBaseInterceptors(): void {
    // Request logging
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`
        );
        return config;
      },
      (error) => {
        this.logger.error("Request error", error);
        return Promise.reject(error);
      }
    );

    // Response logging
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `Response ${response.status} from ${response.config.url}`
        );
        return response;
      },
      (error) => {
        this.logger.error(
          `Response error ${error.response?.status}`,
          error.message
        );
        return Promise.reject(error);
      }
    );
  }

  private setupInterceptors(): void {
    // Clear existing interceptors
    this.client.interceptors.request.clear();
    this.client.interceptors.response.clear();

    // Re-setup base interceptors
    this.setupBaseInterceptors();

    // Add custom interceptors
    this.interceptors.forEach((interceptor) => {
      if (interceptor.onRequest) {
        this.client.interceptors.request.use(
          interceptor.onRequest,
          interceptor.onError
        );
      }
      if (interceptor.onResponse) {
        this.client.interceptors.response.use(
          interceptor.onResponse,
          interceptor.onError
        );
      }
    });
  }
}

// Export singleton instance
export const httpClient = new SolidHttpClient();
