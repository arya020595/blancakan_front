/**
 * Event Types Hooks
 * Custom hooks for event type-related operations
 * Follows SOLID principles with proper separation of concerns
 */

import { eventTypesApiService } from "@/lib/api/services/event-types-service";
import type {
  ApiError,
  CreateEventTypeRequest,
  EventType,
  EventTypesQueryParams,
  PaginationMeta,
  UpdateEventTypeRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useCallback, useState } from "react";

const logger = createLogger("EVENT_TYPES HOOKS");

// Hook for fetching event types list with optimistic updates
export const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchEventTypes = useCallback(
    async (params: EventTypesQueryParams = {}) => {
      try {
        logger.info("Starting event types fetch", params);
        setIsLoading(true);
        setError(null);

        const response = await eventTypesApiService.getEventTypes(params);

        logger.info("Event types fetch successful", {
          count: response.data.length,
          total: response.meta.total_count,
        });

        setEventTypes(response.data);
        setMeta(response.meta);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Event types fetch failed", apiError);
        setError(apiError);
        setEventTypes([]);
        setMeta(null);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Optimistic update functions
  const addEventTypeOptimistic = useCallback((eventType: EventType) => {
    logger.info("Adding event type optimistically", { id: eventType._id });
    setEventTypes((prev) => [eventType, ...prev]);
  }, []);

  const updateEventTypeOptimistic = useCallback(
    (updatedEventType: EventType) => {
      logger.info("Updating event type optimistically", {
        id: updatedEventType._id,
      });
      setEventTypes((prev) =>
        prev.map((eventType) =>
          eventType._id === updatedEventType._id ? updatedEventType : eventType
        )
      );
    },
    []
  );

  const removeEventTypeOptimistic = useCallback((id: string) => {
    logger.info("Removing event type optimistically", { id });
    setEventTypes((prev) => prev.filter((eventType) => eventType._id !== id));
  }, []);

  const replaceTempEventTypeOptimistic = useCallback(
    (tempId: string, realEventType: EventType) => {
      logger.info("Replacing temporary event type", {
        tempId,
        realId: realEventType._id,
      });
      setEventTypes((prev) =>
        prev.map((eventType) =>
          eventType._id === tempId ? realEventType : eventType
        )
      );
    },
    []
  );

  return {
    eventTypes,
    meta,
    isLoading,
    error,
    fetchEventTypes,
    addEventTypeOptimistic,
    updateEventTypeOptimistic,
    removeEventTypeOptimistic,
    replaceTempEventTypeOptimistic,
  };
};

// Hook for creating event types
export const useCreateEventType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createEventType = useCallback(async (data: CreateEventTypeRequest) => {
    try {
      logger.info("Creating event type", { name: data.event_type.name });
      setIsLoading(true);
      setError(null);

      const response = await eventTypesApiService.createEventType(data);

      logger.info("Event type created successfully", {
        id: response._id,
        name: response.name,
      });

      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Failed to create event type", apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createEventType,
    isLoading,
    error,
  };
};

// Hook for updating event types
export const useUpdateEventType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const updateEventType = useCallback(
    async (id: string, data: UpdateEventTypeRequest) => {
      try {
        logger.info("Updating event type", { id, name: data.event_type.name });
        setIsLoading(true);
        setError(null);

        const response = await eventTypesApiService.updateEventType(id, data);

        logger.info("Event type updated successfully", {
          id: response._id,
          name: response.name,
        });

        return response;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Failed to update event type", apiError);
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    updateEventType,
    isLoading,
    error,
  };
};

// Hook for deleting event types
export const useDeleteEventType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const deleteEventType = useCallback(async (id: string) => {
    try {
      logger.info("Deleting event type", { id });
      setIsLoading(true);
      setError(null);

      const response = await eventTypesApiService.deleteEventType(id);

      logger.info("Event type deleted successfully", { id });

      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Failed to delete event type", apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteEventType,
    isLoading,
    error,
  };
};

// Hook for getting a single event type
export const useEventType = () => {
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchEventType = useCallback(async (id: string) => {
    try {
      logger.info("Fetching event type", { id });
      setIsLoading(true);
      setError(null);

      const response = await eventTypesApiService.getEventType(id);

      logger.info("Event type fetched successfully", {
        id: response._id,
        name: response.name,
      });

      setEventType(response);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Failed to fetch event type", apiError);
      setError(apiError);
      setEventType(null);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    eventType,
    isLoading,
    error,
    fetchEventType,
  };
};

// Hook for toggling event type status
export const useToggleEventTypeStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const toggleStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      logger.info("Toggling event type status", { id, isActive });
      setIsLoading(true);
      setError(null);

      const response = await eventTypesApiService.toggleEventTypeStatus(
        id,
        isActive
      );

      logger.info("Event type status toggled successfully", {
        id: response._id,
        isActive: response.is_active,
      });

      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Failed to toggle event type status", apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    toggleStatus,
    isLoading,
    error,
  };
};
