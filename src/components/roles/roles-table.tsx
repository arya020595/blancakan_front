/**
 * Roles Table Component
 *
 * Purpose:
 * - Display a paginated list of roles in a semantic table.
 * - This component is a presentational wrapper: it accepts pre-rendered
 *   `tableContent` (usually an array of `RoleTableRow` elements), an optional
 *   `error` to show a friendly error state, and `isLoading` to render a
 *   `TableSkeleton` while data is being fetched.
 *
 * Usage:
 * - Use the `useRoles` hook to fetch roles and pass `roles.map(...)` as
 *   `tableContent` (each item should be a `RoleTableRow`).
 * - Keep data-loading logic in the parent/page component and only pass the
 *   `isLoading` flag to this component to show the skeleton.
 * - This separation keeps the table purely presentational and easy to reuse.
 *
 * Example:
 * <RolesTable
 *   tableContent={roles.map(r => <RoleTableRow key={r._id} role={r} ... />)}
 *   isLoading={isLoading}
 *   error={error}
 * />
 *
 * Notes:
 * - `RoleTableRow` handles per-row actions (edit/delete) and should call
 *   callbacks provided by the parent page.
 */

"use client";

import { TableSkeleton } from "@/components/loading/skeleton";
import React from "react";

interface RolesTableProps {
  /** Table content (rows) to render */
  tableContent: React.ReactNode;
  /** Optional error state */
  error?: Error | null;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * RolesTable - Clean table component with loading states
 *
 * Features:
 * - Pure data display
 * - Proper semantic table structure
 * - Accessibility compliance
 * - Memoized for performance
 * - Error boundary compatible
 * - Loading skeleton support
 */
export const RolesTable = React.memo<RolesTableProps>(
  ({ tableContent, error, isLoading = false }) => {
    // Handle loading state
    if (isLoading) {
      return <TableSkeleton rows={5} columns={5} />;
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
                Failed to load roles
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
            aria-label="Roles table">
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
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
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

RolesTable.displayName = "RolesTable";
