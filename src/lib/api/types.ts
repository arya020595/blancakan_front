/**
 * API Types and Interfaces
 * Centralized type definitions for API requests and responses
 */

// Base API Response structure
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
}

// API Error Response structure
export interface ApiErrorResponse {
  status: "error";
  message: string;
  errors?: Record<string, string[]> | null;
}

// Legacy response check helper
export interface LegacyApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

// Pagination
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  user: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  authorization: string; // Contains "Bearer ..." token
  refresh_token?: string; // Optional refresh token
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  authorization: string; // Contains "Bearer ..." token
  refresh_token?: string; // Optional refresh token
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "manager" | "staff";
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

// Dashboard Types
export interface DashboardStats {
  total_categories: number;
  total_event_types: number;
  active_categories: number;
  active_event_types: number;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  is_active: boolean;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  category: {
    name: string;
    description?: string;
    is_active: boolean;
    parent_id?: string | null;
  };
}

export interface UpdateCategoryRequest {
  category: {
    name: string;
    description?: string;
    status: boolean;
    parent_id?: string | null;
  };
}

export interface CategoriesQueryParams extends ListQueryParams {
  query?: string;
  filter?: {
    is_active?: boolean;
  };
  sort?: string;
}

// Event Type Types
export interface EventType {
  _id: string;
  name: string;
  description?: string;
  icon_url?: string | null;
  is_active: boolean;
  slug: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEventTypeRequest {
  event_type: {
    name: string;
    description?: string;
    icon_url?: string;
    is_active: boolean;
    sort_order: number;
  };
}

export interface UpdateEventTypeRequest {
  event_type: {
    name: string;
    description?: string;
    icon_url?: string;
    is_active: boolean;
    sort_order: number;
  };
}

export interface EventTypesQueryParams extends ListQueryParams {
  query?: string;
  filter?: {
    is_active?: boolean;
  };
  sort?: string;
}

// Query Parameters
export interface ListQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filters?: Record<string, any>;
}

// Error Types
export interface ApiError {
  message: string;
  status: number | string;
}
