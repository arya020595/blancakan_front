/**
 * Organizers API Service
 * Handles all organizer-related API operations
 */

import { createLogger } from "../../utils/logger";
import { BaseApiService } from "../base-service";
import type {
  Organizer,
  OrganizersQueryParams,
  PaginatedResponse,
} from "../types";

const logger = createLogger("ORGANIZERS API");

export class OrganizersApiService extends BaseApiService {
  constructor() {
    super("/api/v1/admin/organizers");
  }

  /**
   * Get all organizers with pagination and filters
   */
  async getOrganizers(
    params: OrganizersQueryParams = {}
  ): Promise<PaginatedResponse<Organizer>> {
    try {
      logger.info("Fetching organizers", params);

      const response = await this.getList<Organizer>("", params);

      logger.info("Organizers fetched successfully", {
        count: response.data?.length || 0,
        total: response.meta?.total_count || 0,
      });

      return response;
    } catch (error) {
      logger.error("Failed to fetch organizers", error);
      throw error;
    }
  }

  /**
   * Get a single organizer by ID
   */
  async getOrganizer(id: string): Promise<Organizer> {
    try {
      logger.info("Fetching organizer", { id });

      const response = await this.getById<Organizer>("/:id", id);

      logger.info("Organizer fetched successfully", {
        id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch organizer", { id, error });
      throw error;
    }
  }
}

// Export singleton instance
export const organizersApiService = new OrganizersApiService();
