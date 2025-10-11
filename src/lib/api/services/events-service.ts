/**
 * Events API Service
 * Handles all event-related API operations
 * Follows SOLID principles with dependency injection
 */

import { createLogger } from "../../utils/logger";
import { BaseApiService } from "../base-service";
import type {
  CreateEventRequest,
  Event,
  EventsQueryParams,
  PaginatedResponse,
  UpdateEventRequest,
} from "../types";

const logger = createLogger("EVENTS API");

export class EventsApiService extends BaseApiService {
  constructor() {
    super("/api/v1/admin/events");
  }

  /**
   * Get all events with pagination and filters
   */
  async getEvents(
    params: EventsQueryParams = {}
  ): Promise<PaginatedResponse<Event>> {
    try {
      logger.info("Fetching events", params);

      const response = await this.getList<Event>("", params);

      logger.info("Events fetched successfully", {
        count: response.data?.length || 0,
        total: response.meta?.total_count || 0,
      });

      return response;
    } catch (error) {
      logger.error("Failed to fetch events", error);
      throw error;
    }
  }

  /**
   * Get a single event by ID
   */
  async getEvent(id: string): Promise<Event> {
    try {
      logger.info("Fetching event", { id });

      const response = await this.getById<Event>("/:id", id);

      logger.info("Event fetched successfully", {
        id,
        title: response.data.title,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch event", { id, error });
      throw error;
    }
  }

  /**
   * Create a new event with FormData (for file uploads)
   */
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      logger.info("Creating event", { title: eventData.event.title });

      // Convert to FormData for file upload support
      const formData = this.createEventFormData(eventData);

      const response = await this.createWithFormData<Event>("", formData);

      logger.info("Event created successfully", {
        id: response.data._id,
        title: response.data.title,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to create event", { eventData, error });
      throw error;
    }
  }

  /**
   * Convert CreateEventRequest to FormData
   */
  private createEventFormData(eventData: CreateEventRequest): FormData {
    const formData = new FormData();
    const { event, cover_image } = eventData;

    // Add basic event fields
    formData.append("event[title]", event.title);
    formData.append("event[description]", event.description);
    formData.append("event[starts_at_local]", event.starts_at_local);
    formData.append("event[ends_at_local]", event.ends_at_local);
    formData.append("event[location_type]", event.location_type);
    formData.append("event[timezone]", event.timezone);
    formData.append("event[organizer_id]", event.organizer_id);
    formData.append("event[event_type_id]", event.event_type_id);
    formData.append("event[is_paid]", String(event.is_paid));

    // Add status if provided
    if (event.status) {
      formData.append("event[status]", event.status);
    }

    // Add category IDs as array
    event.category_ids.forEach((categoryId) => {
      formData.append("event[category_ids][]", categoryId);
    });

    // Add location fields based on event type
    if (event.location) {
      // For online/hybrid events
      if (
        event.location_type === "online" ||
        event.location_type === "hybrid"
      ) {
        if (event.location.platform) {
          formData.append("event[location][platform]", event.location.platform);
        }
        if (event.location.link) {
          formData.append("event[location][link]", event.location.link);
        }
      }

      // For offline/hybrid events
      if (
        event.location_type === "offline" ||
        event.location_type === "hybrid"
      ) {
        if (event.location.address) {
          formData.append("event[location][address]", event.location.address);
        }
        if (event.location.city) {
          formData.append("event[location][city]", event.location.city);
        }
        if (event.location.state) {
          formData.append("event[location][state]", event.location.state);
        }
      }
    }

    // Add cover image if present
    if (cover_image && cover_image instanceof File) {
      formData.append("event[cover_image]", cover_image);
    }

    return formData;
  }

  /**
   * Update an existing event with FormData (for file uploads)
   */
  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<Event> {
    try {
      logger.info("Updating event", {
        id,
        title: eventData.event.title,
      });

      // Convert to FormData for file upload support
      const formData = this.updateEventFormData(eventData);

      const response = await this.updateWithFormData<Event>(
        "/:id",
        id,
        formData
      );

      logger.info("Event updated successfully", {
        id: response.data._id,
        title: response.data.title,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to update event", { id, eventData, error });
      throw error;
    }
  }

  /**
   * Convert UpdateEventRequest to FormData
   */
  private updateEventFormData(eventData: UpdateEventRequest): FormData {
    // Reuse the same logic as create
    return this.createEventFormData(eventData as CreateEventRequest);
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      logger.info("Deleting event", { id });

      await this.delete("/:id", id);

      logger.info("Event deleted successfully", { id });
    } catch (error) {
      logger.error("Failed to delete event", { id, error });
      throw error;
    }
  }

  /**
   * Publish an event
   */
  async publishEvent(id: string): Promise<Event> {
    try {
      logger.info("Publishing event", { id });

      const response = await this.customAction<Event>(
        "POST",
        `/:id/publish`,
        undefined,
        { id }
      );

      logger.info("Event published successfully", { id });

      return response.data;
    } catch (error) {
      logger.error("Failed to publish event", { id, error });
      throw error;
    }
  }

  /**
   * Cancel an event
   */
  async cancelEvent(id: string): Promise<Event> {
    try {
      logger.info("Canceling event", { id });

      const response = await this.customAction<Event>(
        "POST",
        `/:id/cancel`,
        undefined,
        { id }
      );

      logger.info("Event canceled successfully", { id });

      return response.data;
    } catch (error) {
      logger.error("Failed to cancel event", { id, error });
      throw error;
    }
  }
}

// Export singleton instance
export const eventsApiService = new EventsApiService();
