/**
 * API Services Index
 * Central export point for all API services
 */

export { authApiService } from './auth-service';
export { customersApiService } from './customers-service';
export { dashboardApiService } from './dashboard-service';
export { ordersApiService } from './orders-service';
export { productsApiService } from './products-service';

// Re-export types for convenience
export type {
    Address, ApiError, ApiResponse, Category,
    CreateProductRequest,
    // Customer types
    Customer,
    // Dashboard types
    DashboardStats, ListQueryParams,
    // Auth types
    LoginRequest,
    LoginResponse,
    // Order types
    Order, OrderItem, OrderStatus, PaginatedResponse,
    // Product types
    Product, RecentOrder, User
} from '../types';

