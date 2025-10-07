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
  async getEvents(params: EventsQueryParams = {}): Promise<PaginatedResponse<Event>> {
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

      logger.info("Event fetched successfully", { id, title: response.data.title });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch event", { id, error });
      throw error;
    }
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      logger.info("Creating event", { title: eventData.event.title });

      const response = await this.create<Event>("", eventData);

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
   * Update an existing event
   */
  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<Event> {
    try {
      logger.info("Updating event", { 
        id, 
        title: eventData.event.title,
      });

      const response = await this.update<Event>("/:id", id, eventData);

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

      const response = await this.customAction<Event>("POST", `/:id/publish`, undefined, { id });

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

      const response = await this.customAction<Event>("POST", `/:id/cancel`, undefined, { id });

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
