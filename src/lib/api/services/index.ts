/**
 * API Services Index
 * Central export point for all API services
 */

export { authApiService } from "./auth-service";
export { categoriesApiService } from "./categories-service";
export { dashboardApiService } from "./dashboard-service";
export { eventTypesApiService } from "./event-types-service";
export { eventsApiService } from "./events-service";
export { organizersApiService } from "./organizers-service";

// Re-export types for convenience
export type {
  ApiError,
  ApiResponse,
  CategoriesQueryParams,
  Category,
  CreateCategoryRequest,
  CreateEventRequest,
  CreateEventTypeRequest,
  // Dashboard types
  DashboardStats,
  Event,
  EventsQueryParams,
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
  UpdateEventRequest,
  UpdateEventTypeRequest,
  User,
} from "../types";
