/**
 * Dashboard Page Loading Component
 * Generic loading component for all dashboard pages
 * Provides consistent loading experience across all modules
 */

import { TableSkeleton } from "@/components/loading";

interface DashboardPageLoadingProps {
  /** Title of the module (e.g., "Categories", "Roles", "Event Types") */
  title?: string;
  /** Number of table rows to show in skeleton */
  tableRows?: number;
  /** Number of table columns to show in skeleton */
  tableColumns?: number;
  /** Whether to show search bar */
  showSearch?: boolean;
  /** Whether to show action button */
  showActionButton?: boolean;
}

export default function DashboardPageLoading({
  title = "Dashboard",
  tableRows = 10,
  tableColumns = 5,
  showSearch = true,
  showActionButton = true,
}: DashboardPageLoadingProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-700 animate-pulse">
            {title}
          </h1>
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mt-2"></div>
        </div>
        {showActionButton && (
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <TableSkeleton rows={tableRows} columns={tableColumns} />
    </div>
  );
}
