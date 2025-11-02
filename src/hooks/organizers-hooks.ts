/**
 * Organizers Hooks - TanStack Query hooks for organizers
 * React hooks for managing organizer state with TanStack Query
 */

import { organizersApiService } from "@/lib/api/services";
import type {
  ApiError,
  Organizer,
  OrganizersQueryParams,
  PaginatedResponse,
} from "@/lib/api/types";
import { organizersKeys } from "@/lib/query/query-keys";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

/**
 * Hook to fetch organizers with pagination
 */
export function useOrganizers(
  params: OrganizersQueryParams
): UseQueryResult<PaginatedResponse<Organizer>, ApiError> {
  return useQuery({
    queryKey: organizersKeys.list(params),
    queryFn: () => organizersApiService.getOrganizers(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch a single organizer
 */
export function useOrganizer(id: string): UseQueryResult<Organizer, ApiError> {
  return useQuery({
    queryKey: organizersKeys.detail(id),
    queryFn: () => organizersApiService.getOrganizer(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  });
}
