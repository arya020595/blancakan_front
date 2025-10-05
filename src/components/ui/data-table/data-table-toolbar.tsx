/**
 * DataTableToolbar - Search and filter controls
 *
 * Provides:
 * - Debounced search input
 * - Filter dropdowns (configurable)
 * - Clear filters button
 * - Active filter count badge
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTableParams } from "@/hooks/use-table-params";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { DataTableFilter } from "./data-table-filter";
import type { FilterDef } from "./types";

interface DataTableToolbarProps {
  searchable?: boolean;
  searchPlaceholder?: string;
  searchDebounce?: number;
  filters?: FilterDef[];
}

export function DataTableToolbar({
  searchable = false,
  searchPlaceholder = "Search...",
  searchDebounce = 300,
  filters = [],
}: DataTableToolbarProps) {
  const {
    params,
    setSearch,
    filters: activeFilters,
    resetFilters,
  } = useTableParams();

  // Local state for search input (for immediate UI feedback)
  const [searchValue, setSearchValue] = useState(params.query || "");

  // Debounced search value (triggers actual search)
  const [debouncedSearch] = useDebounce(searchValue, searchDebounce);

  // Update URL when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== params.query) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, params.query, setSearch]);

  // Sync local state with URL on mount/external changes
  useEffect(() => {
    if (params.query !== searchValue) {
      setSearchValue(params.query || "");
    }
  }, [params.query]);

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).length;
  const hasActiveFilters =
    activeFilterCount > 0 || (params.query && params.query.length > 0);

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
      {/* Left side: Search */}
      <div className="flex-1 max-w-sm">
        {searchable && (
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        )}
      </div>

      {/* Right side: Filters */}
      <div className="flex items-center gap-2">
        {/* Filter dropdowns */}
        {filters.map((filter) => (
          <DataTableFilter key={filter.key} filter={filter} />
        ))}

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetFilters();
              setSearchValue("");
            }}
            className="h-9 px-3">
            Clear
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
