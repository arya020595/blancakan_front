/**
 * Events Hooks - TanStack Query hooks for events
 * React hooks for managing event state with TanStack Query
 */

import { eventsApiService } from "@/lib/api/services";
import type {
  ApiError,
  CreateEventRequest,
  Event,
  EventsQueryParams,
  PaginatedResponse,
  UpdateEventRequest,
} from "@/lib/api/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

/**
 * Query key factory for events
 */
export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params: EventsQueryParams) => [...eventsKeys.lists(), params] as const,
  details: () => [...eventsKeys.all, "detail"] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
};

/**
 * Hook to fetch events with pagination
 */
export function useEvents(
  params: EventsQueryParams
): UseQueryResult<PaginatedResponse<Event>, ApiError> {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => eventsApiService.getEvents(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch a single event
 */
export function useEvent(id: string): UseQueryResult<Event, ApiError> {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => eventsApiService.getEvent(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  });
}

/**
 * Hook to create an event
 */
export function useCreateEvent(): UseMutationResult<
  Event,
  ApiError,
  CreateEventRequest,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => {
      console.log("🔄 Events Hook: Mutation called with:", data);
      return eventsApiService.createEvent(data);
    },
    onSuccess: (result) => {
      console.log("✅ Events Hook: Mutation successful:", result);
      // Invalidate all event lists to refetch
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    },
    onError: (error) => {
      console.error("❌ Events Hook: Mutation failed:", error);
    },
  });
}

/**
 * Hook to update an event
 */
export function useUpdateEvent(): UseMutationResult<
  Event,
  ApiError,
  { id: string; data: UpdateEventRequest },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      eventsApiService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific event and all lists
      queryClient.invalidateQueries({
        queryKey: eventsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    },
  });
}

/**
 * Hook to delete an event
 */
export function useDeleteEvent(): UseMutationResult<
  void,
  ApiError,
  string,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApiService.deleteEvent(id),
    onSuccess: () => {
      // Invalidate all lists to refetch
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    },
  });
}

/**
 * Hook to publish an event
 */
export function usePublishEvent(): UseMutationResult<
  Event,
  ApiError,
  string,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApiService.publishEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    },
  });
}

/**
 * Hook to cancel an event
 */
export function useCancelEvent(): UseMutationResult<
  Event,
  ApiError,
  string,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApiService.cancelEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    },
  });
}
