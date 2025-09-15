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
    REGISTER: string;
  };
  DASHBOARD: {
    STATS: string;
  };
  CATEGORIES: {
    LIST: string;
    DETAIL: string;
    CREATE: string;
    UPDATE: string;
    DELETE: string;
  };
  EVENT_TYPES: {
    LIST: string;
    DETAIL: string;
    CREATE: string;
    UPDATE: string;
    DELETE: string;
  };
  ROLES: {
    LIST: string;
    DETAIL: string;
    CREATE: string;
    UPDATE: string;
    DELETE: string;
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
      REGISTER: "/auth/register",
    },
    // Dashboard
    DASHBOARD: {
      STATS: "/dashboard/stats",
    },
    // Categories
    CATEGORIES: {
      LIST: "/api/v1/admin/categories",
      DETAIL: "/api/v1/admin/categories/:id",
      CREATE: "/api/v1/admin/categories",
      UPDATE: "/api/v1/admin/categories/:id",
      DELETE: "/api/v1/admin/categories/:id",
    },
    // Event Types
    EVENT_TYPES: {
      LIST: "/api/v1/admin/event_types",
      DETAIL: "/api/v1/admin/event_types/:id",
      CREATE: "/api/v1/admin/event_types",
      UPDATE: "/api/v1/admin/event_types/:id",
      DELETE: "/api/v1/admin/event_types/:id",
    },
    // Roles
    ROLES: {
      LIST: "/api/v1/admin/roles",
      DETAIL: "/api/v1/admin/roles/:id",
      CREATE: "/api/v1/admin/roles",
      UPDATE: "/api/v1/admin/roles/:id",
      DELETE: "/api/v1/admin/roles/:id",
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
