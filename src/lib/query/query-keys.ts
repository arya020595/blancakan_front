/**
 * Query Keys Factory
 * Centralized query key management for type-safe React Query keys
 * Following TanStack Query best practices
 *
 * Official docs: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
 *
 * Benefits:
 * - Type-safe query keys
 * - Consistent key structure
 * - Easy invalidation
 * - Better maintainability
 */

import type {
  CategoriesQueryParams,
  EventTypesQueryParams,
  RolesQueryParams,
} from "@/lib/api/types";

/**
 * Query Keys Factory for Roles
 *
 * Key hierarchy:
 * - ['roles'] - all roles queries
 * - ['roles', 'list'] - all list queries
 * - ['roles', 'list', params] - specific list query
 * - ['roles', 'detail', id] - specific role detail
 *
 * This structure allows for granular or broad invalidation
 */
export const rolesKeys = {
  // Base key for all roles queries
  all: ["roles"] as const,

  // All list queries
  lists: () => [...rolesKeys.all, "list"] as const,

  // Specific list query with filters
  list: (params?: RolesQueryParams) => [...rolesKeys.lists(), params] as const,

  // All detail queries
  details: () => [...rolesKeys.all, "detail"] as const,

  // Specific detail query
  detail: (id: string) => [...rolesKeys.details(), id] as const,
};

/**
 * Query Keys Factory for Categories
 */
export const categoriesKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesKeys.all, "list"] as const,
  list: (params?: CategoriesQueryParams) =>
    [...categoriesKeys.lists(), params] as const,
  details: () => [...categoriesKeys.all, "detail"] as const,
  detail: (id: string) => [...categoriesKeys.details(), id] as const,
};

/**
 * Query Keys Factory for Event Types
 */
export const eventTypesKeys = {
  all: ["event-types"] as const,
  lists: () => [...eventTypesKeys.all, "list"] as const,
  list: (params?: EventTypesQueryParams) =>
    [...eventTypesKeys.lists(), params] as const,
  details: () => [...eventTypesKeys.all, "detail"] as const,
  detail: (id: string) => [...eventTypesKeys.details(), id] as const,
};

/**
 * Query Keys Factory for Events
 */
export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...eventsKeys.lists(), params] as const,
  details: () => [...eventsKeys.all, "detail"] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
};

/**
 * Usage Examples:
 *
 * 1. Invalidate all roles queries:
 *    queryClient.invalidateQueries({ queryKey: rolesKeys.all })
 *
 * 2. Invalidate all list queries:
 *    queryClient.invalidateQueries({ queryKey: rolesKeys.lists() })
 *
 * 3. Invalidate specific list:
 *    queryClient.invalidateQueries({ queryKey: rolesKeys.list(params) })
 *
 * 4. Invalidate specific detail:
 *    queryClient.invalidateQueries({ queryKey: rolesKeys.detail(id) })
 */
