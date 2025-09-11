/**
 * Dashboard API Service
 * Handles dashboard-related API calls
 */

import { BaseApiService } from '../base-service';
import { API_CONFIG } from '../config';
import {
    ApiResponse,
    DashboardStats,
    ListQueryParams,
    RecentOrder
} from '../types';

class DashboardApiService extends BaseApiService {
  constructor() {
    super('');
  }

  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return this.customAction<DashboardStats>(
      'GET',
      API_CONFIG.ENDPOINTS.DASHBOARD.STATS
    );
  }

  async getRecentOrders(params?: ListQueryParams): Promise<ApiResponse<RecentOrder[]>> {
    return this.customAction<RecentOrder[]>(
      'GET',
      API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ORDERS,
      undefined,
      undefined,
      params
    );
  }
}

export const dashboardApiService = new DashboardApiService();
