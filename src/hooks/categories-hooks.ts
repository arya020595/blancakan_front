/**
 * Categories Hooks - TanStack Query Implementation
 *
 * Following official TanStack Query v5 best practices
 * @see docs/guides/TANSTACK_QUERY_CRUD_GUIDE.md
 */

import { categoriesApiService } from "@/lib/api/services/categories-service";
import type {
  ApiError,
  CategoriesQueryParams,
  Category,
  CreateCategoryRequest,
  PaginatedResponse,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { categoriesKeys } from "@/lib/query/query-keys";
import { createLogger } from "@/lib/utils/logger";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

const logger = createLogger("CATEGORIES_HOOKS");

// TYPE DEFINITIONS
type UseCategoriesOptions = Omit<
  UseQueryOptions<PaginatedResponse<Category>, ApiError>,
  "queryKey" | "queryFn"
>;

type UseCategoryOptions = Omit<
  UseQueryOptions<Category, ApiError>,
  "queryKey" | "queryFn"
>;

type UseCreateCategoryOptions = Omit<
  UseMutationOptions<Category, ApiError, CreateCategoryRequest>,
  "mutationFn"
>;

type UseUpdateCategoryOptions = Omit<
  UseMutationOptions<Category, ApiError, { id: string; data: UpdateCategoryRequest }>,
  "mutationFn"
>;

type UseDeleteCategoryOptions = Omit<
  UseMutationOptions<Category, ApiError, string>,
  "mutationFn"
>;

// QUERY HOOKS
export function useCategories(
  params: CategoriesQueryParams = {},
  options?: UseCategoriesOptions
): UseQueryResult<PaginatedResponse<Category>, ApiError> {
  return useQuery({
    queryKey: categoriesKeys.list(params),
    queryFn: async () => {
      logger.info("Fetching categories", { params });
      const response = await categoriesApiService.getCategories(params);
      return response;
    },
    ...options,
  });
}

export function useCategory(
  id: string | undefined,
  options?: UseCategoryOptions
): UseQueryResult<Category, ApiError> {
  return useQuery({
    queryKey: categoriesKeys.detail(id!),
    queryFn: async () => {
      const response = await categoriesApiService.getCategory(id!);
      return response;
    },
    enabled: !!id,
    ...options,
  });
}

// MUTATION HOOKS
export function useCreateCategory(
  options?: UseCreateCategoryOptions
): UseMutationResult<Category, ApiError, CreateCategoryRequest, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      logger.info("Creating category", { name: data.category.name });
      const response = await categoriesApiService.createCategory(data);
      return response;
    },

    onSuccess: async (data) => {
      queryClient.setQueryData(categoriesKeys.detail(data._id), data);
      await queryClient.invalidateQueries({
        queryKey: categoriesKeys.lists(),
      });
      logger.info("Cache invalidated");
    },

    onError: (error) => {
      logger.error("Failed to create category", { error });
    },
  });
}

export function useUpdateCategory(
  options?: UseUpdateCategoryOptions
): UseMutationResult<Category, ApiError, { id: string; data: UpdateCategoryRequest }, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      logger.info("Updating category", { id });
      const response = await categoriesApiService.updateCategory(id, data);
      return response;
    },

    onSuccess: async (data, variables) => {
      queryClient.setQueryData(categoriesKeys.detail(variables.id), data);
      await queryClient.invalidateQueries({
        queryKey: categoriesKeys.lists(),
      });
      logger.info("Cache invalidated");
    },

    onError: (error, variables) => {
      logger.error("Failed to update category", { id: variables.id, error });
    },
  });
}

export function useDeleteCategory(
  options?: UseDeleteCategoryOptions
): UseMutationResult<Category, ApiError, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      logger.info("Deleting category", { id });
      const response = await categoriesApiService.deleteCategory(id);
      return response;
    },

    onSuccess: async (_data, variables) => {
      queryClient.removeQueries({ queryKey: categoriesKeys.detail(variables) });
      await queryClient.invalidateQueries({
        queryKey: categoriesKeys.lists(),
      });
      logger.info("Cache invalidated");
    },

    onError: (error, variables) => {
      logger.error("Failed to delete category", { id: variables, error });
    },
  });
}

export function usePrefetchCategories() {
  const queryClient = useQueryClient();

  return (params: CategoriesQueryParams = {}) => {
    return queryClient.prefetchQuery({
      queryKey: categoriesKeys.list(params),
      queryFn: () => categoriesApiService.getCategories(params),
    });
  };
}
