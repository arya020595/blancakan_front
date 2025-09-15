/**
 * API Services Index
 * Central export point for all API services
 */

export { authApiService } from "./auth-service";
export { categoriesApiService } from "./categories-service";
export { dashboardApiService } from "./dashboard-service";
export { eventTypesApiService } from "./event-types-service";

// Re-export types for convenience
export type {
  ApiError,
  ApiResponse,
  CategoriesQueryParams,
  Category,
  CreateCategoryRequest,
  CreateEventTypeRequest,
  // Dashboard types
  DashboardStats,
  EventType,
  EventTypesQueryParams,
  ListQueryParams,
  // Auth types
  LoginRequest,
  LoginResponse,
  PaginatedResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateCategoryRequest,
  UpdateEventTypeRequest,
  User,
} from "../types";
