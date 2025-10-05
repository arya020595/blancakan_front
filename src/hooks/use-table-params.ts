/**
 * Table URL Parameters Hook
 *
 * Manages table state (search, sort, filters, pagination) via URL parameters
 * Uses nuqs for type-safe URL state management with Next.js App Router
 *
 * URL Format:
 * ?query=search&sort=name:asc&page=2&per_page=20&filter[status]=active&filter[tags]=web,mobile
 */

import type {
  FilterState,
  SortState,
  TableParams,
} from "@/components/ui/data-table/types";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";

/**
 * Default pagination values
 */
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

/**
 * Hook to manage table state via URL parameters
 *
 * @example
 * const { params, setSearch, setSort, setFilter, setPage, resetFilters } = useTableParams();
 *
 * // params will be: { query, sort, page, per_page, filter }
 * // Pass params to your useQuery hook
 */
export function useTableParams() {
  // Define URL state shape with nuqs
  const [state, setState] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      sort: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(DEFAULT_PAGE),
      per_page: parseAsInteger.withDefault(DEFAULT_PER_PAGE),
    },
    {
      // URL update options
      history: "push", // Add to history (allows back/forward)
      shallow: false, // Trigger data refetch on change
      scroll: false, // Don't scroll to top on change
    }
  );

  /**
   * Parse filter parameters from URL
   * Format: ?filter[status]=active&filter[tags]=web,mobile
   */
  const filters = useMemo(() => {
    if (typeof window === "undefined") return {};

    const urlParams = new URLSearchParams(window.location.search);
    const filterState: FilterState = {};

    // Extract all filter[*] parameters
    urlParams.forEach((value, key) => {
      const match = key.match(/^filter\[(.+)\]$/);
      if (match) {
        const filterKey = match[1];
        // Handle multi-value filters (comma-separated)
        filterState[filterKey] = value.includes(",") ? value.split(",") : value;
      }
    });

    return filterState;
  }, [typeof window !== "undefined" && window.location.search]);

  /**
   * Parse sort state into field and direction
   */
  const sortState = useMemo<SortState>(() => {
    if (!state.sort) {
      return { field: null, direction: null };
    }

    const [field, direction] = state.sort.split(":") as [
      string,
      "asc" | "desc"
    ];
    return { field, direction: direction || "asc" };
  }, [state.sort]);

  /**
   * Build params object for backend API
   */
  const params = useMemo<TableParams>(
    () => ({
      query: state.query || undefined,
      sort: state.sort || undefined,
      page: state.page,
      per_page: state.per_page,
      filter: Object.keys(filters).length > 0 ? filters : undefined,
    }),
    [state.query, state.sort, state.page, state.per_page, filters]
  );

  /**
   * Set search query (debounced in component)
   */
  const setSearch = useCallback(
    (query: string) => {
      setState({
        query,
        page: DEFAULT_PAGE, // Reset to page 1 on new search
      });
    },
    [setState]
  );

  /**
   * Set sort field and direction
   * @param field - Field name to sort by
   * @param direction - Sort direction ('asc' or 'desc')
   */
  const setSort = useCallback(
    (field: string | null, direction: "asc" | "desc" = "asc") => {
      if (!field) {
        setState({ sort: "" });
        return;
      }
      setState({ sort: `${field}:${direction}` });
    },
    [setState]
  );

  /**
   * Toggle sort direction for a field
   * If not currently sorted, sort ascending
   * If sorted ascending, sort descending
   * If sorted descending, clear sort
   */
  const toggleSort = useCallback(
    (field: string) => {
      if (sortState.field !== field) {
        // Not currently sorted, sort ascending
        setSort(field, "asc");
      } else if (sortState.direction === "asc") {
        // Currently ascending, change to descending
        setSort(field, "desc");
      } else {
        // Currently descending, clear sort
        setSort(null);
      }
    },
    [sortState, setSort]
  );

  /**
   * Set single filter value
   * @param key - Filter key
   * @param value - Filter value (string, array, or null to clear)
   */
  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const filterKey = `filter[${key}]`;

      if (
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        // Remove filter
        url.searchParams.delete(filterKey);
      } else {
        // Set filter (join arrays with comma)
        const filterValue = Array.isArray(value) ? value.join(",") : value;
        url.searchParams.set(filterKey, filterValue);
      }

      // Reset to page 1 when filtering
      url.searchParams.set("page", "1");

      // Update URL
      window.history.pushState({}, "", url.toString());

      // Trigger re-render
      setState({ page: DEFAULT_PAGE });
    },
    [setState]
  );

  /**
   * Set multiple filters at once
   */
  const setFilters = useCallback(
    (newFilters: Record<string, string | string[] | null>) => {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);

      // Update each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        const filterKey = `filter[${key}]`;

        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          url.searchParams.delete(filterKey);
        } else {
          const filterValue = Array.isArray(value) ? value.join(",") : value;
          url.searchParams.set(filterKey, filterValue);
        }
      });

      // Reset to page 1
      url.searchParams.set("page", "1");

      // Update URL
      window.history.pushState({}, "", url.toString());

      // Trigger re-render
      setState({ page: DEFAULT_PAGE });
    },
    [setState]
  );

  /**
   * Clear all filters
   */
  const resetFilters = useCallback(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const params = Array.from(url.searchParams.keys());

    // Remove all filter[*] parameters
    params.forEach((key) => {
      if (key.startsWith("filter[")) {
        url.searchParams.delete(key);
      }
    });

    // Reset to page 1
    url.searchParams.set("page", "1");

    // Update URL
    window.history.pushState({}, "", url.toString());

    // Trigger re-render
    setState({ page: DEFAULT_PAGE });
  }, [setState]);

  /**
   * Set page number
   */
  const setPage = useCallback(
    (page: number) => {
      setState({ page });
    },
    [setState]
  );

  /**
   * Set items per page
   */
  const setPerPage = useCallback(
    (per_page: number) => {
      setState({
        per_page,
        page: DEFAULT_PAGE, // Reset to page 1 when changing per page
      });
    },
    [setState]
  );

  /**
   * Reset all table state
   */
  const reset = useCallback(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);

    // Remove all table-related parameters
    url.searchParams.delete("query");
    url.searchParams.delete("sort");
    url.searchParams.delete("page");
    url.searchParams.delete("per_page");

    // Remove all filters
    const params = Array.from(url.searchParams.keys());
    params.forEach((key) => {
      if (key.startsWith("filter[")) {
        url.searchParams.delete(key);
      }
    });

    // Update URL
    window.history.pushState({}, "", url.toString());

    // Reset state
    setState({
      query: "",
      sort: "",
      page: DEFAULT_PAGE,
      per_page: DEFAULT_PER_PAGE,
    });
  }, [setState]);

  return {
    // Current state
    params, // Backend-ready params object
    filters, // Current filter state
    sortState, // Current sort state { field, direction }

    // State setters
    setSearch, // Set search query
    setSort, // Set sort field/direction
    toggleSort, // Toggle sort on a field
    setFilter, // Set single filter
    setFilters, // Set multiple filters
    setPage, // Set current page
    setPerPage, // Set items per page

    // Reset functions
    resetFilters, // Clear all filters
    reset, // Reset everything
  };
}
