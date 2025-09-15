/**
 * Dashboard Event Types Loading UI
 * Shown instantly when navigating to event types page
 */

import { CategoryTableSkeleton } from "@/components/loading";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Event Types Table */}
      <CategoryTableSkeleton rows={10} />
    </div>
  );
}
