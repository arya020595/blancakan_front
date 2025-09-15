/**
 * Dashboard API Service
 * Handles dashboard-related API calls
 */

import { BaseApiService } from "../base-service";
import { API_CONFIG } from "../config";
import { ApiResponse, DashboardStats } from "../types";

class DashboardApiService extends BaseApiService {
  constructor() {
    super("");
  }

  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return this.customAction<DashboardStats>(
      "GET",
      API_CONFIG.ENDPOINTS.DASHBOARD.STATS
    );
  }
}

export const dashboardApiService = new DashboardApiService();
