/**
 * Server-Side API Functions
 * Functions for fetching data during SSR/SSG
 */

import { API_CONFIG } from "./config";
import { serverHttpClient } from "./server-client";
import {
  Customer,
  DashboardStats,
  ListQueryParams,
  Order,
  PaginatedResponse,
  Product,
  RecentOrder,
  User,
} from "./types";

// Helper function to build query string
const buildQueryString = (params?: ListQueryParams): string => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
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
};

// Authentication functions
export const getServerProfile = async (): Promise<User | null> => {
  try {
    const response = await serverHttpClient.get<User>(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE
    );
    return response.status === "success" ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch profile on server:", error);
    return null;
  }
};

// Dashboard functions
export const getServerDashboardStats =
  async (): Promise<DashboardStats | null> => {
    try {
      const response = await serverHttpClient.get<DashboardStats>(
        API_CONFIG.ENDPOINTS.DASHBOARD.STATS
      );
      return response.status === "success" ? response.data : null;
    } catch (error) {
      console.error("Failed to fetch dashboard stats on server:", error);
      return null;
    }
  };

export const getServerRecentOrders = async (
  limit: number = 5
): Promise<RecentOrder[]> => {
  try {
    const queryString = buildQueryString({ per_page: limit });
    const response = await serverHttpClient.get<RecentOrder[]>(
      `${API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ORDERS}${queryString}`
    );
    return response.status === "success" ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch recent orders on server:", error);
    return [];
  }
};

// Products functions
export const getServerProducts = async (
  params?: ListQueryParams
): Promise<PaginatedResponse<Product> | null> => {
  try {
    const queryString = buildQueryString(params);
    const response = await serverHttpClient.get(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}${queryString}`
    );
    return response.status === "success"
      ? (response.data as PaginatedResponse<Product>)
      : null;
  } catch (error) {
    console.error("Failed to fetch products on server:", error);
    return null;
  }
};

export const getServerProduct = async (
  id: string | number
): Promise<Product | null> => {
  try {
    const url = API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL.replace(":id", String(id));
    const response = await serverHttpClient.get<Product>(url);
    return response.status === "success" ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch product on server:", error);
    return null;
  }
};

// Orders functions
export const getServerOrders = async (
  params?: ListQueryParams
): Promise<PaginatedResponse<Order> | null> => {
  try {
    const queryString = buildQueryString(params);
    const response = await serverHttpClient.get(
      `${API_CONFIG.ENDPOINTS.ORDERS.LIST}${queryString}`
    );
    return response.status === "success"
      ? (response.data as PaginatedResponse<Order>)
      : null;
  } catch (error) {
    console.error("Failed to fetch orders on server:", error);
    return null;
  }
};

export const getServerOrder = async (
  id: string | number
): Promise<Order | null> => {
  try {
    const url = API_CONFIG.ENDPOINTS.ORDERS.DETAIL.replace(":id", String(id));
    const response = await serverHttpClient.get<Order>(url);
    return response.status === "success" ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch order on server:", error);
    return null;
  }
};

// Customers functions
export const getServerCustomers = async (
  params?: ListQueryParams
): Promise<PaginatedResponse<Customer> | null> => {
  try {
    const queryString = buildQueryString(params);
    const response = await serverHttpClient.get(
      `${API_CONFIG.ENDPOINTS.CUSTOMERS.LIST}${queryString}`
    );
    return response.status === "success"
      ? (response.data as PaginatedResponse<Customer>)
      : null;
  } catch (error) {
    console.error("Failed to fetch customers on server:", error);
    return null;
  }
};

export const getServerCustomer = async (
  id: string | number
): Promise<Customer | null> => {
  try {
    const url = API_CONFIG.ENDPOINTS.CUSTOMERS.DETAIL.replace(
      ":id",
      String(id)
    );
    const response = await serverHttpClient.get<Customer>(url);
    return response.status === "success" ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch customer on server:", error);
    return null;
  }
};

// Type for server-side page props
export interface ServerPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
  params?: Record<string, string>;
}
