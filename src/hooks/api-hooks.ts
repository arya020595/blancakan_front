/**
 * Generic API Hooks
 * Reusable hooks for common API operations
 */

import {
  ApiError,
  ApiResponse,
  ListQueryParams,
  PaginatedResponse,
} from "@/lib/api/types";
import { useCallback, useEffect, useMemo, useState } from "react";

// Generic fetch hook
export const useFetch = <T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  deps: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchFn();

      if (response.status === "success") {
        setData(response.data);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  const depsKey = useMemo(() => JSON.stringify(deps), [deps]);
  useEffect(() => {
    fetch();
  }, [fetch, depsKey]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  };
};

// Generic paginated fetch hook
export const usePaginatedFetch = <T>(
  fetchFn: (params?: ListQueryParams) => Promise<PaginatedResponse<T>>,
  initialParams?: ListQueryParams
) => {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<T>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [params, setParams] = useState<ListQueryParams>(initialParams || {});

  const fetch = useCallback(
    async (newParams?: ListQueryParams) => {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = newParams || params;
        const response = await fetchFn(queryParams);

        if (response.status === "success") {
          setData(response.data);
          setMeta(response.meta);
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, params]
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateParams = useCallback(
    (newParams: Partial<ListQueryParams>) => {
      const updatedParams = { ...params, ...newParams };
      setParams(updatedParams);
      fetch(updatedParams);
    },
    [params, fetch]
  );

  const goToPage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  const changePageSize = useCallback(
    (perPage: number) => {
      updateParams({ per_page: perPage, page: 1 });
    },
    [updateParams]
  );

  const search = useCallback(
    (searchTerm: string) => {
      updateParams({ search: searchTerm, page: 1 });
    },
    [updateParams]
  );

  const sort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "asc") => {
      updateParams({ sort_by: sortBy, sort_order: sortOrder, page: 1 });
    },
    [updateParams]
  );

  const filter = useCallback(
    (filters: Record<string, any>) => {
      updateParams({ filters, page: 1 });
    },
    [updateParams]
  );

  return {
    data,
    meta,
    isLoading,
    error,
    params,
    refetch: fetch,
    updateParams,
    goToPage,
    changePageSize,
    search,
    sort,
    filter,
  };
};

// Generic mutation hook
export const useMutation = <T, K = any>(
  mutationFn: (data: K) => Promise<ApiResponse<T>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(
    async (mutationData: K): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await mutationFn(mutationData);

        if (response.status === "success") {
          setData(response.data);
          return response.data;
        }

        return null;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    data,
    isLoading,
    error,
    reset,
  };
};
