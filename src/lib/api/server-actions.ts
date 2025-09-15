/**
 * Server-Side API Functions
 * Functions for fetching data during SSR/SSG
 */

import { API_CONFIG } from "./config";
import { serverHttpClient } from "./server-client";
import { DashboardStats, User } from "./types";

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

// Type for server-side page props
export interface ServerPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
  params?: Record<string, string>;
}
