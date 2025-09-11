/**
 * HTTP Client Interfaces and Abstractions
 * Follows Open/Closed Principle - extensible without modification
 */

export interface IHttpInterceptor {
  onRequest?(config: any): any;
  onResponse?(response: any): any;
  onError?(error: any): any;
}

export interface IHttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
  addInterceptor(interceptor: IHttpInterceptor): void;
}

export interface IApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface IApiService<T = any> {
  getAll(): Promise<IApiResponse<T[]>>;
  getById(id: string | number): Promise<IApiResponse<T>>;
  create(data: Partial<T>): Promise<IApiResponse<T>>;
  update(id: string | number, data: Partial<T>): Promise<IApiResponse<T>>;
  delete(id: string | number): Promise<IApiResponse<void>>;
}
