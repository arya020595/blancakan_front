/**
 * Categories Hooks
 * Custom hooks for category-related operations
 * Follows SOLID principles with proper separation of concerns
 */

import { categoriesApiService } from "@/lib/api/services/categories-service";
import type {
  ApiError,
  CategoriesQueryParams,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useCallback, useState } from "react";

const logger = createLogger("CATEGORIES HOOKS");

// Hook for fetching categories list with optimistic updates
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = useCallback(
    async (params: CategoriesQueryParams = {}) => {
      try {
        logger.info("Starting categories fetch", params);
        setIsLoading(true);
        setError(null);

        const response = await categoriesApiService.getCategories(params);

        logger.info("Categories fetch successful", {
          count: response.data.length,
          total: response.meta.total_count,
        });

        setCategories(response.data);
        setMeta(response.meta);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Categories fetch failed", apiError);
        setError(apiError);
        setCategories([]);
        setMeta(null);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Optimistic update functions
  const addCategoryOptimistic = useCallback((category: Category) => {
    setCategories((prev) => [category, ...prev]);
    setMeta((prev: any) =>
      prev ? { ...prev, total_count: prev.total_count + 1 } : null
    );
  }, []);

  const updateCategoryOptimistic = useCallback((updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      )
    );
  }, []);

  const removeCategoryOptimistic = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    setMeta((prev: any) =>
      prev ? { ...prev, total_count: prev.total_count - 1 } : null
    );
  }, []);

  const replaceTempCategoryOptimistic = useCallback(
    (tempId: string, realCategory: Category) => {
      setCategories((prev) =>
        prev.map((cat) => (cat._id === tempId ? realCategory : cat))
      );
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    categories,
    meta,
    isLoading,
    error,
    fetchCategories,
    addCategoryOptimistic,
    updateCategoryOptimistic,
    removeCategoryOptimistic,
    replaceTempCategoryOptimistic,
    clearError,
  };
};

// Hook for fetching a single category
export const useCategory = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategory = useCallback(async (id: string) => {
    try {
      logger.info("Starting category fetch", { id });
      setIsLoading(true);
      setError(null);

      const response = await categoriesApiService.getCategory(id);

      logger.info("Category fetch successful", { id, name: response.name });
      setCategory(response);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Category fetch failed", { id, error: apiError });
      setError(apiError);
      setCategory(null);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    category,
    isLoading,
    error,
    fetchCategory,
    clearError,
  };
};

// Hook for creating categories
export const useCreateCategory = () => {
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

  return {
    createCategory,
    isLoading,
    error,
    clearError,
  };
};

// Hook for updating categories
export const useUpdateCategory = () => {
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
          requestData: categoryData,
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
          errorMessage: apiError.message,
          errorStatus: apiError.status,
          errorDetails: apiError.errors,
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

  return {
    updateCategory,
    isLoading,
    error,
    clearError,
  };
};

// Hook for deleting categories
export const useDeleteCategory = () => {
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

  return {
    deleteCategory,
    isLoading,
    error,
    clearError,
  };
};
