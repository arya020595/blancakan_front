/**
 * Event Types Table Component
 *
 * Follows React Suspense patterns and enterprise standards:
 * - Proper Suspense boundary integration
 * - Loading state management
 * - Accessibility with ARIA attributes
 * - Semantic HTML structure
 * - TypeScript strict typing
 *
 * @see https://react.dev/reference/react/Suspense
 * @see https://react.dev/reference/react/memo
 */

"use client";

import { CategoryTableSkeleton } from "@/components/loading/skeleton";
import React from "react";

interface EventTypesTableProps {
  /** Table content (rows) to render */
  tableContent: React.ReactNode;
  /** Loading state indicator */
  isLoading: boolean;
  /** Optional error state */
  error?: Error | null;
}

/**
 * EventTypesTable - Main table component with Suspense support
 *
 * Features:
 * - Handles loading states gracefully
 * - Proper semantic table structure
 * - Accessibility compliance
 * - Memoized for performance
 * - Error boundary compatible
 */
export const EventTypesTable = React.memo<EventTypesTableProps>(
  ({ tableContent, isLoading, error }) => {
    // Handle loading state
    if (isLoading) {
      return <CategoryTableSkeleton rows={5} />;
    }

    // Handle error state
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Failed to load event types
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message || "An unexpected error occurred"}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y divide-gray-200"
            role="table"
            aria-label="Event types table">
            <thead className="bg-gray-50">
              <tr role="row">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sort Order
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y divide-gray-200"
              role="rowgroup">
              {tableContent}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

EventTypesTable.displayName = "EventTypesTable";
