/**
 * DataTableBody - Table body with rows and cells
 *
 * Renders table rows with support for:
 * - Custom cell rendering
 * - Action buttons
 * - Loading state (skeleton)
 * - Empty state
 * - Error state
 */

import type { ColumnDef } from "./types";

interface DataTableBodyProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  error: Error | null;
  actions?: (item: T) => React.ReactNode;
  resourceName: string;
}

export function DataTableBody<T>({
  columns,
  data,
  isLoading,
  error,
  actions,
  resourceName,
}: DataTableBodyProps<T>) {
  // Loading state
  if (isLoading) {
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            {columns.map((column) => (
              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </td>
            ))}
            {actions && (
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  }

  // Error state
  if (error) {
    return (
      <tbody className="bg-white">
        <tr>
          <td
            colSpan={columns.length + (actions ? 1 : 0)}
            className="px-6 py-12 text-center">
            <div className="text-red-600">
              <p className="font-medium">Error loading {resourceName}s</p>
              <p className="text-sm text-gray-500 mt-1">{error.message}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <tbody className="bg-white">
        <tr>
          <td
            colSpan={columns.length + (actions ? 1 : 0)}
            className="px-6 py-12 text-center">
            <div className="text-gray-500">
              <p className="font-medium">No {resourceName}s found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Data rows
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
          {columns.map((column) => (
            <td
              key={column.key}
              className={cn(
                "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                column.className
              )}>
              {column.render
                ? column.render(item)
                : String((item as Record<string, unknown>)[column.key] ?? "")}
            </td>
          ))}
          {actions && (
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              {actions(item)}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}

// Utility function (already exists in lib/utils, but include for safety)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
