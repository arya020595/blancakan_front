/**
 * Permissions Hooks - TanStack Query Implementation
 *
 * Following official TanStack Query v5 best practices
 * Pattern based on roles-hooks.ts
 */

import { permissionsApiService } from "@/lib/api/services/permissions-service";
import type {
    ApiError,
    CreatePermissionRequest,
    PaginatedResponse,
    Permission,
    PermissionOptions,
    PermissionsQueryParams,
    UpdatePermissionRequest,
} from "@/lib/api/types";
import { permissionsKeys } from "@/lib/query/query-keys";
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

const logger = createLogger("PERMISSIONS_HOOKS");

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type UsePermissionsOptions = Omit<
  UseQueryOptions<PaginatedResponse<Permission>, ApiError>,
  "queryKey" | "queryFn"
>;

type UsePermissionOptions = Omit<
  UseQueryOptions<Permission, ApiError>,
  "queryKey" | "queryFn"
>;

type UsePermissionOptionsOptions = Omit<
  UseQueryOptions<PermissionOptions, ApiError>,
  "queryKey" | "queryFn"
>;

type UseCreatePermissionOptions = Omit<
  UseMutationOptions<Permission, ApiError, CreatePermissionRequest>,
  "mutationFn"
>;

type UseUpdatePermissionOptions = Omit<
  UseMutationOptions<
    Permission,
    ApiError,
    { id: string; data: UpdatePermissionRequest }
  >,
  "mutationFn"
>;

type UseDeletePermissionOptions = Omit<
  UseMutationOptions<Permission, ApiError, string>,
  "mutationFn"
>;

// ============================================================================
// QUERY HOOKS (Read Operations)
// ============================================================================

/**
 * Fetch paginated permissions list
 */
export function usePermissions(
  params: PermissionsQueryParams = {},
  options?: UsePermissionsOptions
): UseQueryResult<PaginatedResponse<Permission>, ApiError> {
  logger.debug("usePermissions called", { params });

  return useQuery({
    queryKey: permissionsKeys.list(params),
    queryFn: async () => {
      logger.info("Fetching permissions", { params });
      const response = await permissionsApiService.getPermissions(params);
      logger.info("Permissions fetched successfully", {
        count: response.data?.length ?? 0,
        total: response.meta?.total_count ?? 0,
      });
      return response;
    },
    ...options,
  });
}

/**
 * Fetch a single permission by ID
 */
export function usePermission(
  id: string | undefined,
  options?: UsePermissionOptions
): UseQueryResult<Permission, ApiError> {
  logger.debug("usePermission called", { id });

  return useQuery({
    queryKey: permissionsKeys.detail(id!),
    queryFn: async () => {
      logger.info("Fetching permission detail", { id });
      const response = await permissionsApiService.getPermission(id!);
      logger.info("Permission detail fetched", { id, action: response.action });
      return response;
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch permission options (available subject classes, etc.)
 */
export function usePermissionOptions(
  options?: UsePermissionOptionsOptions
): UseQueryResult<PermissionOptions, ApiError> {
  logger.debug("usePermissionOptions called");

  return useQuery({
    queryKey: permissionsKeys.options(),
    queryFn: async () => {
      logger.info("Fetching permission options");
      const response = await permissionsApiService.getPermissionOptions();
      logger.info("Permission options fetched successfully");
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS (Write Operations)
// ============================================================================

/**
 * Create a new permission
 */
export function useCreatePermission(
  options?: UseCreatePermissionOptions
): UseMutationResult<Permission, ApiError, CreatePermissionRequest, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePermissionRequest) => {
      logger.info("Creating permission", {
        action: data.permission.action,
        subject_class: data.permission.subject_class,
      });
      const response = await permissionsApiService.createPermission(data);
      logger.info("Permission created successfully", {
        id: response._id,
        action: response.action,
      });
      return response;
    },

    onSuccess: async (data) => {
      // 1. Update cache with new permission
      queryClient.setQueryData(permissionsKeys.detail(data._id), data);

      // 2. Invalidate list queries to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: permissionsKeys.lists(),
      });

      logger.info("Cache invalidated, list will refetch");
    },

    onError: (error) => {
      logger.error("Failed to create permission", { error });
    },

    ...options,
  });
}

/**
 * Update an existing permission
 */
export function useUpdatePermission(
  options?: UseUpdatePermissionOptions
): UseMutationResult<
  Permission,
  ApiError,
  { id: string; data: UpdatePermissionRequest },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      logger.info("Updating permission", {
        id,
        action: data.permission.action,
      });
      const response = await permissionsApiService.updatePermission(id, data);
      logger.info("Permission updated successfully", {
        id: response._id,
        action: response.action,
      });
      return response;
    },

    onSuccess: async (data, variables) => {
      // 1. Update the specific detail cache immediately
      queryClient.setQueryData(permissionsKeys.detail(variables.id), data);

      // 2. Invalidate list queries to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: permissionsKeys.lists(),
      });

      logger.info("Cache invalidated, list will refetch");
    },

    onError: (error, variables) => {
      logger.error("Failed to update permission", { id: variables.id, error });
    },

    ...options,
  });
}

/**
 * Delete a permission
 */
export function useDeletePermission(
  options?: UseDeletePermissionOptions
): UseMutationResult<Permission, ApiError, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      logger.info("Deleting permission", { id });
      const response = await permissionsApiService.deletePermission(id);
      logger.info("Permission deleted successfully", { id });
      return response;
    },

    onSuccess: async (_data, variables) => {
      // 1. Remove the specific detail query from cache
      queryClient.removeQueries({ queryKey: permissionsKeys.detail(variables) });

      // 2. Invalidate list queries to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: permissionsKeys.lists(),
      });

      logger.info("Cache invalidated, list will refetch");
    },

    onError: (error, variables) => {
      logger.error("Failed to delete permission", { id: variables, error });
    },

    ...options,
  });
}

/**
 * Prefetch permissions list for better UX
 */
export function usePrefetchPermissions() {
  const queryClient = useQueryClient();

  return (params: PermissionsQueryParams = {}) => {
    return queryClient.prefetchQuery({
      queryKey: permissionsKeys.list(params),
      queryFn: () => permissionsApiService.getPermissions(params),
    });
  };
}
