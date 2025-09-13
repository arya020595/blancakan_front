/**
 * API Types and Interfaces
 * Centralized type definitions for API requests and responses
 */

// Base API Response structure
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
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
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
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
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_products: number;
  recent_orders_count: number;
  growth_metrics: {
    orders_growth: number;
    revenue_growth: number;
    customers_growth: number;
  };
}

export interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock_quantity: number;
  category_id: number;
  category?: Category;
  images: ProductImage[];
  status: "active" | "inactive" | "out_of_stock";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock_quantity: number;
  category_id: number;
  status: "active" | "inactive";
}

// Order Types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Customer Types
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  addresses: Address[];
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  type: "shipping" | "billing";
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
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
  status: number;
  errors?: Record<string, string[]>;
}
