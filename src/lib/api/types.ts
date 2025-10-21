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
    is_active: boolean;
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

// Role Types
export interface Role {
  _id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  role: {
    name: string;
    description?: string;
  };
}

export interface UpdateRoleRequest {
  role: {
    name: string;
    description?: string;
  };
}

export interface RolesQueryParams extends ListQueryParams {
  query?: string;
  sort?: string;
}

// Permission Types
export interface Permission {
  _id: string;
  action: string;
  subject_class: string;
  conditions: Record<string, any>;
  role_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePermissionRequest {
  permission: {
    action: string;
    subject_class: string;
    conditions?: Record<string, any> | string;
    role_id: string;
  };
}

export interface UpdatePermissionRequest {
  permission: {
    action: string;
    subject_class: string;
    conditions?: Record<string, any> | string;
    role_id: string;
  };
}

export interface PermissionsQueryParams extends ListQueryParams {
  query?: string;
  sort?: string;
  filter?: {
    role_id?: string;
    action?: string;
    subject_class?: string;
  };
}

export interface PermissionOptions {
  subject_class: string[];
}

// Organizer Types
export interface Organizer {
  _id: string;
  name: string;
  email?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizersQueryParams extends ListQueryParams {
  query?: string;
  sort?: string;
  filters?: {
    is_active?: boolean;
  };
}

// Event Types
export interface Event {
  _id: string;
  _slugs: string[];
  title: string;
  slug: string;
  description: string;
  starts_at_local: string; // Combined datetime in local timezone (ISO 8601)
  ends_at_local: string; // Combined datetime in local timezone (ISO 8601)
  starts_at_utc: string; // Combined datetime in UTC (ISO 8601)
  ends_at_utc: string; // Combined datetime in UTC (ISO 8601)
  location_type: "online" | "offline" | "hybrid";
  location?: {
    // For online events
    platform?: string;
    link?: string;
    // For offline events
    address?: string;
    city?: string;
    state?: string;
  };
  timezone: string;
  organizer_id: string;
  event_type_id: string;
  category_ids: string[];
  is_paid: boolean;
  status: "draft" | "published" | "canceled";
  cover_image?: {
    url: string | null;
    thumbnail: {
      url: string | null;
    };
  };
  cover_image_filename?: string | null;
  published_at: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventRequest {
  event: {
    title: string;
    description: string;
    starts_at_local: string; // Combined datetime ISO 8601 format
    ends_at_local: string; // Combined datetime ISO 8601 format
    location_type: "online" | "offline" | "hybrid";
    location?: {
      // For online events
      platform?: string;
      link?: string;
      // For offline events
      address?: string;
      city?: string;
      state?: string;
    };
    timezone: string;
    organizer_id: string;
    event_type_id: string;
    category_ids: string[];
    is_paid: boolean;
    status?: "draft" | "published" | "cancelled" | "rejected";
  };
  cover_image?: File;
}

export interface UpdateEventRequest {
  event: {
    title: string;
    description: string;
    starts_at_local: string; // Combined datetime ISO 8601 format
    ends_at_local: string; // Combined datetime ISO 8601 format
    location_type: "online" | "offline" | "hybrid";
    location?: {
      // For online events
      platform?: string;
      link?: string;
      // For offline events
      address?: string;
      city?: string;
      state?: string;
    };
    timezone: string;
    organizer_id: string;
    event_type_id: string;
    category_ids: string[];
    is_paid: boolean;
    status?: "draft" | "published" | "cancelled" | "rejected";
  };
  cover_image?: File;
}

export interface EventsQueryParams extends ListQueryParams {
  query?: string;
  filter?: {
    status?: "draft" | "published" | "canceled";
    location_type?: "online" | "offline" | "hybrid";
    is_paid?: boolean;
    event_type_id?: string;
    category_ids?: string[];
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
  filter?: Record<string, any>;
}

// Error Types
export interface ApiError {
  message: string;
  status: number | string;
  errors?: Record<string, string[]> | null;
  statusCode?: number; // HTTP status code
}
