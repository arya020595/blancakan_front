/**
 * Categories Manager Hook
 * Advanced state management for categories with optimistic updates,
 * cache invalidation, and error recovery
 */

import { categoriesApiService } from "@/lib/api/services/categories-service";
import type {
  ApiError,
  CategoriesQueryParams,
  Category,
  CreateCategoryRequest,
  PaginationMeta,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useCallback, useEffect, useRef, useState } from "react";

const logger = createLogger("CATEGORIES MANAGER");

interface CategoriesState {
  data: Category[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: ApiError | null;
  lastFetch: number | null;
}

interface CategoriesManagerOptions {
  refetchInterval?: number; // Auto-refetch interval in ms
  staleTime?: number; // How long data is considered fresh in ms
}

export const useCategoriesManager = (
  options: CategoriesManagerOptions = {}
) => {
  const { refetchInterval = 0, staleTime = 5 * 60 * 1000 } = options; // 5 minutes default stale time

  const [state, setState] = useState<CategoriesState>({
    data: [],
    meta: null,
    isLoading: false,
    error: null,
    lastFetch: null,
  });

  const [queryParams, setQueryParams] = useState<CategoriesQueryParams>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if data is stale
  const isStale = useCallback(() => {
    if (!state.lastFetch) return true;
    return Date.now() - state.lastFetch > staleTime;
  }, [state.lastFetch, staleTime]);

  // Fetch categories with caching logic
  const fetchCategories = useCallback(
    async (params: CategoriesQueryParams = {}, force = false) => {
      // Don't fetch if data is fresh and not forced
      if (!force && !isStale() && state.data.length > 0) {
        logger.info("Using cached categories data");
        return { data: state.data, meta: state.meta };
      }

      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        logger.info("Fetching categories", params);

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await categoriesApiService.getCategories(params);

        setState((prev) => ({
          ...prev,
          data: response.data,
          meta: response.meta,
          isLoading: false,
          lastFetch: Date.now(),
        }));

        setQueryParams(params);

        logger.info("Categories fetch successful", {
          count: response.data.length,
          total: response.meta.total_count,
        });

        return response;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          logger.info("Categories fetch aborted");
          return;
        }

        const apiError = err as ApiError;
        logger.error("Categories fetch failed", apiError);

        setState((prev) => ({
          ...prev,
          error: apiError,
          isLoading: false,
        }));

        throw apiError;
      }
    },
    [isStale, state.data, state.meta]
  );

  // Invalidate cache and refetch
  const invalidateAndRefetch = useCallback(
    async (newParams?: CategoriesQueryParams) => {
      const params = newParams || queryParams;
      setState((prev) => ({ ...prev, lastFetch: null }));
      return fetchCategories(params, true);
    },
    [fetchCategories, queryParams]
  );

  // Optimistic updates
  const addOptimistic = useCallback((category: Category) => {
    setState((prev) => ({
      ...prev,
      data: [category, ...prev.data],
      meta: prev.meta
        ? { ...prev.meta, total_count: prev.meta.total_count + 1 }
        : null,
    }));
  }, []);

  const updateOptimistic = useCallback((updatedCategory: Category) => {
    setState((prev) => ({
      ...prev,
      data: prev.data.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      ),
    }));
  }, []);

  const removeOptimistic = useCallback((categoryId: string) => {
    setState((prev) => ({
      ...prev,
      data: prev.data.filter((cat) => cat._id !== categoryId),
      meta: prev.meta
        ? { ...prev.meta, total_count: prev.meta.total_count - 1 }
        : null,
    }));
  }, []);

  // CRUD operations with optimistic updates and error recovery
  const createCategory = useCallback(
    async (categoryData: CreateCategoryRequest): Promise<Category> => {
      // Create optimistic category
      const optimisticCategory: Category = {
        _id: `temp-${Date.now()}`,
        name: categoryData.category.name,
        description: categoryData.category.description,
        is_active: categoryData.category.is_active,
        parent_id: categoryData.category.parent_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Apply optimistic update
      addOptimistic(optimisticCategory);

      try {
        logger.info("Creating category", { name: categoryData.category.name });

        const response = await categoriesApiService.createCategory(
          categoryData
        );

        // Replace optimistic with real category
        updateOptimistic(response);

        logger.info("Category created successfully", {
          id: response._id,
          name: response.name,
        });

        return response;
      } catch (error) {
        // Rollback optimistic update
        removeOptimistic(optimisticCategory._id);
        logger.error("Category creation failed", error);
        throw error;
      }
    },
    [addOptimistic, updateOptimistic, removeOptimistic]
  );

  const updateCategory = useCallback(
    async (
      id: string,
      categoryData: UpdateCategoryRequest
    ): Promise<Category> => {
      // Find original category for rollback
      const originalCategory = state.data.find((cat) => cat._id === id);
      if (!originalCategory) {
        throw new Error("Category not found");
      }

      // Create optimistic update
      const optimisticCategory: Category = {
        ...originalCategory,
        name: categoryData.category.name,
        description: categoryData.category.description,
        updated_at: new Date().toISOString(),
      };

      // Apply optimistic update
      updateOptimistic(optimisticCategory);

      try {
        logger.info("Updating category", {
          id,
          name: categoryData.category.name,
        });

        const response = await categoriesApiService.updateCategory(
          id,
          categoryData
        );

        // Update with real response
        updateOptimistic(response);

        logger.info("Category updated successfully", {
          id: response._id,
          name: response.name,
        });

        return response;
      } catch (error) {
        // Rollback optimistic update
        updateOptimistic(originalCategory);
        logger.error("Category update failed", error);
        throw error;
      }
    },
    [state.data, updateOptimistic]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<Category> => {
      // Find category for rollback
      const categoryToDelete = state.data.find((cat) => cat._id === id);
      if (!categoryToDelete) {
        throw new Error("Category not found");
      }

      // Apply optimistic update
      removeOptimistic(id);

      try {
        logger.info("Deleting category", { id });

        const response = await categoriesApiService.deleteCategory(id);

        logger.info("Category deleted successfully", {
          id: response._id,
          name: response.name,
        });

        return response;
      } catch (error) {
        // Rollback optimistic update
        addOptimistic(categoryToDelete);
        logger.error("Category deletion failed", error);
        throw error;
      }
    },
    [state.data, removeOptimistic, addOptimistic]
  );

  // Setup auto-refetch interval
  useEffect(() => {
    if (refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        if (isStale()) {
          fetchCategories(queryParams, true);
        }
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, isStale, fetchCategories, queryParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Clear errors
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    categories: state.data,
    meta: state.meta,
    isLoading: state.isLoading,
    error: state.error,
    isStale: isStale(),

    // Actions
    fetchCategories,
    invalidateAndRefetch,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,

    // Optimistic updates (for manual use)
    addOptimistic,
    updateOptimistic,
    removeOptimistic,
  };
};
