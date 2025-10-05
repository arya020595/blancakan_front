/**
 * DataTable Types
 *
 * Type definitions for the reusable table system
 * Supports search, sort, filter, pagination with full type safety
 */

import type { PaginationMeta } from "@/lib/api/types";

/**
 * Column definition for table
 */
export interface ColumnDef<T> {
  /** Unique key for the column (should match data property) */
  key: string;
  /** Display header text */
  header: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (item: T) => React.ReactNode;
  /** CSS classes for the column */
  className?: string;
  /** Width of the column */
  width?: string;
}

/**
 * Filter types supported
 */
export type FilterType =
  | "select" // Single select dropdown
  | "multi-select" // Multiple select dropdown
  | "date-range" // Date range picker
  | "number-range" // Number range (min/max)
  | "search" // Text search input
  | "boolean"; // Toggle/checkbox

/**
 * Filter option for select/multi-select
 */
export interface FilterOption {
  label: string;
  value: string;
}

/**
 * Base filter definition
 */
interface BaseFilterDef {
  /** Unique key for the filter (will be used in URL as filter[key]) */
  key: string;
  /** Display label */
  label: string;
  /** Type of filter */
  type: FilterType;
}

/**
 * Select filter definition
 */
export interface SelectFilterDef extends BaseFilterDef {
  type: "select";
  /** Static options */
  options: FilterOption[];
}

/**
 * Multi-select filter definition
 */
export interface MultiSelectFilterDef extends BaseFilterDef {
  type: "multi-select";
  /** Static options */
  options: FilterOption[];
}

/**
 * Date range filter definition
 */
export interface DateRangeFilterDef extends BaseFilterDef {
  type: "date-range";
  /** Date format for backend (default: 'yyyy-MM-dd') */
  format?: string;
}

/**
 * Number range filter definition
 */
export interface NumberRangeFilterDef extends BaseFilterDef {
  type: "number-range";
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Search filter definition
 */
export interface SearchFilterDef extends BaseFilterDef {
  type: "search";
  placeholder?: string;
  debounce?: number; // Debounce delay in ms (default: 300)
}

/**
 * Boolean filter definition
 */
export interface BooleanFilterDef extends BaseFilterDef {
  type: "boolean";
}

/**
 * Union type for all filter definitions
 */
export type FilterDef =
  | SelectFilterDef
  | MultiSelectFilterDef
  | DateRangeFilterDef
  | NumberRangeFilterDef
  | SearchFilterDef
  | BooleanFilterDef;

/**
 * Table configuration
 */
export interface TableConfig {
  /** Default sort (e.g., 'created_at:desc') */
  defaultSort?: string;
  /** Default items per page */
  defaultPerPage?: number;
  /** Enable search */
  searchable?: boolean;
  /** Search query parameter name (default: 'query') */
  searchKey?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search debounce delay (default: 300ms) */
  searchDebounce?: number;
}

/**
 * Table params that will be sent to backend
 */
export interface TableParams {
  /** Search query */
  query?: string;
  /** Sort field and direction (e.g., 'name:asc') */
  sort?: string;
  /** Current page number */
  page: number;
  /** Items per page */
  per_page: number;
  /** Filter values */
  filter?: Record<string, string | string[]>;
}

/**
 * Data table props
 */
export interface DataTableProps<T> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Data items */
  data: T[];
  /** Pagination metadata */
  meta: PaginationMeta | null;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Actions renderer */
  actions?: (item: T) => React.ReactNode;
  /** Enable search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Filter definitions */
  filters?: FilterDef[];
  /** Table configuration */
  config?: TableConfig;
  /** Resource name (singular) for empty state */
  resourceName?: string;
}

/**
 * Sort state
 */
export interface SortState {
  field: string | null;
  direction: "asc" | "desc" | null;
}

/**
 * Filter state
 */
export type FilterState = Record<string, string | string[]>;
