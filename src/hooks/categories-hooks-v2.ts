/**
 * Categories Hooks V2 - React 19 Ready
 * Enhanced version with React 19 useOptimistic pattern and improved type safety
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
import { useCallback, useMemo, useState, useTransition } from "react";

const logger = createLogger("CATEGORIES HOOKS V2");

// Enhanced types for better type safety
export interface OptimisticCategory extends Category {
  _isOptimistic?: boolean;
  _operationType?: "create" | "update" | "delete";
}

export interface CategoriesState {
  categories: OptimisticCategory[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: ApiError | null;
}

// Hook for fetching categories with enhanced optimistic updates
export const useCategoriesV2 = () => {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
    meta: null,
    isLoading: false,
    error: null,
  });

  const [isPending, startTransition] = useTransition();

  // Memoized stable functions to prevent unnecessary re-renders
  const fetchCategories = useCallback(
    async (params: CategoriesQueryParams = {}) => {
      try {
        logger.info("Starting categories fetch", params);
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await categoriesApiService.getCategories(params);

        logger.info("Categories fetch successful", {
          count: response.data.length,
          total: response.meta.total_count,
        });

        setState((prev) => ({
          ...prev,
          categories: response.data,
          meta: response.meta,
          isLoading: false,
        }));

        return response;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Categories fetch failed", apiError);
        setState((prev) => ({
          ...prev,
          error: apiError,
          categories: [],
          meta: null,
          isLoading: false,
        }));
        throw apiError;
      }
    },
    []
  );

  // Enhanced optimistic update functions with better type safety
  const addCategoryOptimistic = useCallback((category: OptimisticCategory) => {
    setState((prev) => ({
      ...prev,
      categories: [
        { ...category, _isOptimistic: true, _operationType: "create" },
        ...prev.categories,
      ],
      meta: prev.meta
        ? { ...prev.meta, total_count: prev.meta.total_count + 1 }
        : null,
    }));
  }, []);

  const updateCategoryOptimistic = useCallback(
    (updatedCategory: OptimisticCategory) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat._id === updatedCategory._id
            ? {
                ...updatedCategory,
                _isOptimistic: true,
                _operationType: "update",
              }
            : cat
        ),
      }));
    },
    []
  );

  const removeCategoryOptimistic = useCallback((categoryId: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat._id !== categoryId),
      meta: prev.meta
        ? { ...prev.meta, total_count: prev.meta.total_count - 1 }
        : null,
    }));
  }, []);

  const replaceTempCategoryOptimistic = useCallback(
    (tempId: string, realCategory: Category) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat._id === tempId ? { ...realCategory, _isOptimistic: false } : cat
        ),
      }));
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Memoized derived state
  const memoizedState = useMemo(
    () => ({
      categories: state.categories,
      meta: state.meta,
      isLoading: state.isLoading || isPending,
      error: state.error,
    }),
    [state.categories, state.meta, state.isLoading, state.error, isPending]
  );

  return {
    ...memoizedState,
    fetchCategories,
    addCategoryOptimistic,
    updateCategoryOptimistic,
    removeCategoryOptimistic,
    replaceTempCategoryOptimistic,
    clearError,
    startTransition, // Expose for manual use
  };
};

// Enhanced CRUD operation hooks with better error handling
export const useCreateCategoryV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createCategory = useCallback(
    async (categoryData: CreateCategoryRequest): Promise<Category> => {
      try {
        logger.info("Starting category creation", {
          name: categoryData.category.name,
        });
        setIsLoading(true);
        setError(null);

        const response = await categoriesApiService.createCategory(
          categoryData
        );

        logger.info("Category creation successful", {
          id: response._id,
          name: response.name,
        });

        return response;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Category creation failed", {
          categoryData,
          error: apiError,
        });
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      createCategory,
      isLoading,
      error,
      clearError,
    }),
    [createCategory, isLoading, error, clearError]
  );
};

// Enhanced update hook
export const useUpdateCategoryV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const updateCategory = useCallback(
    async (
      id: string,
      categoryData: UpdateCategoryRequest
    ): Promise<Category> => {
      try {
        logger.info("Starting category update", {
          id,
          name: categoryData.category.name,
        });
        setIsLoading(true);
        setError(null);

        const response = await categoriesApiService.updateCategory(
          id,
          categoryData
        );

        logger.info("Category update successful", {
          id: response._id,
          name: response.name,
        });

        return response;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Category update failed", {
          id,
          categoryData,
          error: apiError,
        });
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      updateCategory,
      isLoading,
      error,
      clearError,
    }),
    [updateCategory, isLoading, error, clearError]
  );
};

// Enhanced delete hook
export const useDeleteCategoryV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const deleteCategory = useCallback(async (id: string): Promise<Category> => {
    try {
      logger.info("Starting category deletion", { id });
      setIsLoading(true);
      setError(null);

      const response = await categoriesApiService.deleteCategory(id);

      logger.info("Category deletion successful", {
        id: response._id,
        name: response.name,
      });

      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Category deletion failed", { id, error: apiError });
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      deleteCategory,
      isLoading,
      error,
      clearError,
    }),
    [deleteCategory, isLoading, error, clearError]
  );
};

// Utility function to check if category is optimistic
export const isOptimisticCategory = (category: OptimisticCategory): boolean => {
  return category._isOptimistic === true || category._id.startsWith("temp-");
};

// Utility function to check operation type
export const getOperationType = (
  category: OptimisticCategory
): string | undefined => {
  return category._operationType;
};
