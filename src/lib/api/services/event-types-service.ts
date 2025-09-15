/**
 * Event Types API Service
 * Handles all event type-related API operations
 * Follows SOLID principles with dependency injection
 */

import { createLogger } from "../../utils/logger";
import { BaseApiService } from "../base-service";
import type {
  CreateEventTypeRequest,
  EventType,
  EventTypesQueryParams,
  PaginatedResponse,
  UpdateEventTypeRequest,
} from "../types";

const logger = createLogger("EVENT_TYPES API");

export class EventTypesApiService extends BaseApiService {
  constructor() {
    super("/api/v1/admin/event_types");
  }

  /**
   * Get all event types with pagination and filters
   */
  async getEventTypes(
    params: EventTypesQueryParams = {}
  ): Promise<PaginatedResponse<EventType>> {
    try {
      logger.info("Fetching event types", params);

      const response = await this.getList<EventType>("", params);

      logger.info("Event types fetched successfully", {
        count: response.data?.length || 0,
        total: response.meta?.total_count || 0,
      });

      return response;
    } catch (error) {
      logger.error("Failed to fetch event types", error);
      throw error;
    }
  }

  /**
   * Get a single event type by ID
   */
  async getEventType(id: string): Promise<EventType> {
    try {
      logger.info("Fetching event type", { id });

      const response = await this.getById<EventType>("/:id", id);

      logger.info("Event type fetched successfully", {
        id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch event type", { id, error });
      throw error;
    }
  }

  /**
   * Create a new event type
   */
  async createEventType(data: CreateEventTypeRequest): Promise<EventType> {
    try {
      logger.info("Creating event type", data);

      const response = await this.create<EventType>("", data);

      logger.info("Event type created successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to create event type", { data, error });
      throw error;
    }
  }

  /**
   * Update an existing event type
   */
  async updateEventType(
    id: string,
    data: UpdateEventTypeRequest
  ): Promise<EventType> {
    try {
      logger.info("Updating event type", { id, data });

      const response = await this.update<EventType>("/:id", id, data);

      logger.info("Event type updated successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to update event type", { id, data, error });
      throw error;
    }
  }

  /**
   * Delete an event type
   */
  async deleteEventType(id: string): Promise<EventType> {
    try {
      logger.info("Deleting event type", { id });

      const response = await this.delete<EventType>("/:id", id);

      logger.info("Event type deleted successfully", { id });

      return response.data;
    } catch (error) {
      logger.error("Failed to delete event type", { id, error });
      throw error;
    }
  }

  /**
   * Bulk operations for event types
   */
  async bulkUpdateEventTypes(
    updates: Array<{
      id: string;
      data: Partial<UpdateEventTypeRequest["event_type"]>;
    }>
  ): Promise<EventType[]> {
    try {
      logger.info("Bulk updating event types", { count: updates.length });

      const results = await Promise.all(
        updates.map(({ id, data }) =>
          this.updateEventType(id, {
            event_type: data as UpdateEventTypeRequest["event_type"],
          })
        )
      );

      logger.info("Bulk update completed successfully", {
        count: results.length,
      });

      return results;
    } catch (error) {
      logger.error("Failed to bulk update event types", { updates, error });
      throw error;
    }
  }

  /**
   * Toggle event type active status
   */
  async toggleEventTypeStatus(
    id: string,
    isActive: boolean
  ): Promise<EventType> {
    try {
      logger.info("Toggling event type status", { id, isActive });

      // First get the current event type to preserve other fields
      const currentEventType = await this.getEventType(id);

      const updateData: UpdateEventTypeRequest = {
        event_type: {
          name: currentEventType.name,
          description: currentEventType.description,
          icon_url: currentEventType.icon_url || undefined,
          is_active: isActive,
          sort_order: currentEventType.sort_order,
        },
      };

      const response = await this.updateEventType(id, updateData);

      logger.info("Event type status toggled successfully", {
        id,
        isActive: response.is_active,
      });

      return response;
    } catch (error) {
      logger.error("Failed to toggle event type status", {
        id,
        isActive,
        error,
      });
      throw error;
    }
  }
}

// Create singleton instance
export const eventTypesApiService = new EventTypesApiService();
