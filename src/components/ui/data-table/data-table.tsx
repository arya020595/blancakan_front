/**
 * DataTable - Main table component
 *
 * Reusable table with search, sort, filter, pagination support
 * Uses URL-based state management for shareable/bookmarkable views
 */

import { DataTableBody } from "./data-table-body";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import type { DataTableProps } from "./types";

export function DataTable<T>({
  columns,
  data,
  meta,
  isLoading = false,
  error = null,
  actions,
  searchable = false,
  searchPlaceholder = "Search...",
  filters = [],
  config,
  resourceName = "item",
}: DataTableProps<T>) {
  const showToolbar = searchable || (filters && filters.length > 0);

  return (
    <div className="w-full space-y-4">
      {/* Toolbar: Search + Filters */}
      {showToolbar && (
        <DataTableToolbar
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          searchDebounce={config?.searchDebounce}
          filters={filters}
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-300">
          <DataTableHeader columns={columns} />
          <DataTableBody
            columns={columns}
            data={data}
            isLoading={isLoading}
            error={error}
            actions={actions}
            resourceName={resourceName}
          />
        </table>
      </div>

      {/* Pagination */}
      {meta && <DataTablePagination meta={meta} />}
    </div>
  );
}
