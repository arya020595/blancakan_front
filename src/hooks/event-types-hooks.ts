/**
 * Event Types Hooks - TanStack Query Implementation
 *
 * Following official TanStack Query v5 best practices
 * @see docs/guides/TANSTACK_QUERY_CRUD_GUIDE.md
 */

import { eventTypesApiService } from "@/lib/api/services/event-types-service";
import type {
  ApiError,
  CreateEventTypeRequest,
  EventType,
  EventTypesQueryParams,
  PaginatedResponse,
  UpdateEventTypeRequest,
} from "@/lib/api/types";
import { eventTypesKeys } from "@/lib/query/query-keys";
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

const logger = createLogger("EVENT_TYPES_HOOKS");

// TYPE DEFINITIONS
type UseEventTypesOptions = Omit<
  UseQueryOptions<PaginatedResponse<EventType>, ApiError>,
  "queryKey" | "queryFn"
>;

type UseEventTypeOptions = Omit<
  UseQueryOptions<EventType, ApiError>,
  "queryKey" | "queryFn"
>;

type UseCreateEventTypeOptions = Omit<
  UseMutationOptions<EventType, ApiError, CreateEventTypeRequest>,
  "mutationFn"
>;

type UseUpdateEventTypeOptions = Omit<
  UseMutationOptions<
    EventType,
    ApiError,
    { id: string; data: UpdateEventTypeRequest }
  >,
  "mutationFn"
>;

type UseDeleteEventTypeOptions = Omit<
  UseMutationOptions<EventType, ApiError, string>,
  "mutationFn"
>;

// QUERY HOOKS
export function useEventTypes(
  params: EventTypesQueryParams = {},
  options?: UseEventTypesOptions
): UseQueryResult<PaginatedResponse<EventType>, ApiError> {
  return useQuery({
    queryKey: eventTypesKeys.list(params),
    queryFn: async () => {
      logger.info("Fetching event types", { params });
      const response = await eventTypesApiService.getEventTypes(params);
      return response;
    },
    ...options,
  });
}

export function useEventType(
  id: string | undefined,
  options?: UseEventTypeOptions
): UseQueryResult<EventType, ApiError> {
  return useQuery({
    queryKey: eventTypesKeys.detail(id!),
    queryFn: async () => {
      const response = await eventTypesApiService.getEventType(id!);
      return response;
    },
    enabled: !!id,
    ...options,
  });
}

// MUTATION HOOKS
export function useCreateEventType(
  options?: UseCreateEventTypeOptions
): UseMutationResult<EventType, ApiError, CreateEventTypeRequest, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventTypeRequest) => {
      logger.info("Creating event type", { name: data.event_type.name });
      const response = await eventTypesApiService.createEventType(data);
      return response;
    },

    onSuccess: async (data) => {
      queryClient.setQueryData(eventTypesKeys.detail(data._id), data);
      await queryClient.invalidateQueries({
        queryKey: eventTypesKeys.lists(),
      });
      logger.info("Cache invalidated");
    },

    onError: (error) => {
      logger.error("Failed to create event type", { error });
    },
  });
}

export function useUpdateEventType(
  options?: UseUpdateEventTypeOptions
): UseMutationResult<
  EventType,
  ApiError,
  { id: string; data: UpdateEventTypeRequest },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      logger.info("Updating event type", { id });
      const response = await eventTypesApiService.updateEventType(id, data);
      return response;
    },

    onSuccess: async (data, variables) => {
      queryClient.setQueryData(eventTypesKeys.detail(variables.id), data);
      await queryClient.invalidateQueries({
        queryKey: eventTypesKeys.lists(),
      });
      logger.info("Cache invalidated");
    },

    onError: (error, variables) => {
      logger.error("Failed to update event type", { id: variables.id, error });
    },
  });
}

export function useDeleteEventType(
  options?: UseDeleteEventTypeOptions
): UseMutationResult<EventType, ApiError, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      logger.info("Deleting event type", { id });
      const response = await eventTypesApiService.deleteEventType(id);
      return response;
    },

    onSuccess: async (_data, variables) => {
      queryClient.removeQueries({ queryKey: eventTypesKeys.detail(variables) });
      await queryClient.invalidateQueries({
        queryKey: eventTypesKeys.lists(),
      });
      logger.info("Cache invalidated");
    },

    onError: (error, variables) => {
      logger.error("Failed to delete event type", { id: variables, error });
    },
  });
}

export function usePrefetchEventTypes() {
  const queryClient = useQueryClient();

  return (params: EventTypesQueryParams = {}) => {
    return queryClient.prefetchQuery({
      queryKey: eventTypesKeys.list(params),
      queryFn: () => eventTypesApiService.getEventTypes(params),
    });
  };
}
