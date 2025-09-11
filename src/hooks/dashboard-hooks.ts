/**
 * Dashboard Hooks
 * Custom hooks for dashboard-related operations
 */

import { dashboardApiService } from '@/lib/api/services';
import { useFetch } from './api-hooks';

// Dashboard stats hook
export const useDashboardStats = () => {
  return useFetch(
    () => dashboardApiService.getStats(),
    []
  );
};

// Recent orders hook
export const useRecentOrders = (limit: number = 5) => {
  return useFetch(
    () => dashboardApiService.getRecentOrders({ per_page: limit }),
    [limit]
  );
};
