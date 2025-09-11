/**
 * API Configuration
 * Centralized configuration following best practices
 * Environment-based configuration with type safety
 */

interface ApiEndpoints {
  AUTH: {
    LOGIN: string;
    LOGOUT: string;
    REFRESH: string;
    PROFILE: string;
  };
  DASHBOARD: {
    STATS: string;
    RECENT_ORDERS: string;
  };
  PRODUCTS: {
    LIST: string;
    DETAIL: string;
    CREATE: string;
    UPDATE: string;
    DELETE: string;
    CATEGORIES: string;
  };
  ORDERS: {
    LIST: string;
    DETAIL: string;
    CREATE: string;
    UPDATE: string;
    DELETE: string;
    STATUSES?: string;
    CANCEL?: string;
  };
  CUSTOMERS: {
    LIST: string;
    DETAIL: string;
    CREATE: string;
    UPDATE: string;
    DELETE?: string;
  };
}

interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  ENDPOINTS: ApiEndpoints;
  ENVIRONMENT: "development" | "production" | "staging";
  USE_PROXY: boolean;
}

// Environment detection
const environment =
  (process.env.NODE_ENV as "development" | "production" | "staging") ||
  "development";
const isDevelopment = environment === "development";

// Base URL configuration
const getBaseUrl = (): string => {
  if (isDevelopment) {
    return "/api/proxy"; // Use proxy in development to avoid CORS
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000";
};

export const API_CONFIG: ApiConfig = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),
  ENVIRONMENT: environment,
  USE_PROXY: isDevelopment,
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: "/auth/sign_in",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      PROFILE: "/auth/profile",
    },
    // Dashboard
    DASHBOARD: {
      STATS: "/dashboard/stats",
      RECENT_ORDERS: "/dashboard/recent-orders",
    },
    // Products
    PRODUCTS: {
      LIST: "/products",
      DETAIL: "/products/:id",
      CREATE: "/products",
      UPDATE: "/products/:id",
      DELETE: "/products/:id",
      CATEGORIES: "/products/categories",
    },
    // Orders
    ORDERS: {
      LIST: "/orders",
      DETAIL: "/orders/:id",
      CREATE: "/orders",
      UPDATE: "/orders/:id",
      DELETE: "/orders/:id",
      CANCEL: "/orders/:id/cancel",
    },
    // Customers
    CUSTOMERS: {
      LIST: "/customers",
      DETAIL: "/customers/:id",
      CREATE: "/customers",
      UPDATE: "/customers/:id",
      DELETE: "/customers/:id",
    },
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
