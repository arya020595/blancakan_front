/**
 * DataTableHeader - Table header with sortable columns
 *
 * Renders table headers with optional sort functionality
 * Shows sort indicators (↑↓) and handles click events
 */

import { useTableParams } from "@/hooks/use-table-params";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "./types";

interface DataTableHeaderProps<T> {
  columns: ColumnDef<T>[];
}

export function DataTableHeader<T>({ columns }: DataTableHeaderProps<T>) {
  const { sortState, toggleSort } = useTableParams();

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => {
          const isSorted = sortState.field === column.key;
          const sortDirection = isSorted ? sortState.direction : null;

          return (
            <th
              key={column.key}
              scope="col"
              className={cn(
                "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                column.className,
                column.sortable &&
                  "cursor-pointer select-none hover:bg-gray-100 transition-colors"
              )}
              style={column.width ? { width: column.width } : undefined}
              onClick={() => column.sortable && toggleSort(column.key)}
              role={column.sortable ? "button" : undefined}
              tabIndex={column.sortable ? 0 : undefined}
              onKeyDown={(e) => {
                if (column.sortable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  toggleSort(column.key);
                }
              }}>
              <div className="flex items-center gap-2">
                {column.header}
                {column.sortable && (
                  <span className="flex flex-col text-gray-400">
                    {sortDirection === "asc" ? (
                      <span className="text-gray-900">↑</span>
                    ) : sortDirection === "desc" ? (
                      <span className="text-gray-900">↓</span>
                    ) : (
                      <span className="text-gray-300">↕</span>
                    )}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
