/**
 * Dashboard Hooks
 * Custom hooks for dashboard-related operations
 */

import { dashboardApiService } from "@/lib/api/services";
import { useFetch } from "./api-hooks";

// Dashboard stats hook
export const useDashboardStats = () => {
  return useFetch(() => dashboardApiService.getStats(), []);
};
