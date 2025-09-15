/**
 * Roles API Service
 * Handles all role-related API operations
 * Follows SOLID principles with dependency injection
 */

import { createLogger } from "../../utils/logger";
import { BaseApiService } from "../base-service";
import type {
  CreateRoleRequest,
  PaginatedResponse,
  Role,
  RolesQueryParams,
  UpdateRoleRequest,
} from "../types";

const logger = createLogger("ROLES API");

export class RolesApiService extends BaseApiService {
  constructor() {
    super("/api/v1/admin/roles");
    logger.info("RolesApiService initialized");
  }

  /**
   * Get all roles with pagination and filters
   */
  async getRoles(
    params: RolesQueryParams = {}
  ): Promise<PaginatedResponse<Role>> {
    try {
      logger.info("Fetching roles", { params });

      const response = await this.getList<Role>("", params);

      logger.info("Roles fetched successfully", {
        count: response.data?.length || 0,
        total: response.meta?.total_count || 0,
      });

      return response;
    } catch (error) {
      logger.error("Failed to fetch roles", { params, error });
      throw error;
    }
  }

  /**
   * Get a single role by ID
   */
  async getRole(id: string): Promise<Role> {
    try {
      logger.info("Fetching role by ID", { id });

      const response = await this.getById<Role>("/:id", id);

      logger.info("Role fetched successfully", {
        id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch role", { id, error });
      throw error;
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData: CreateRoleRequest): Promise<Role> {
    try {
      logger.info("Creating new role", { name: roleData.role.name });

      const response = await this.create<Role>("", roleData);

      logger.info("Role created successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to create role", { roleData, error });
      throw error;
    }
  }

  /**
   * Update an existing role
   */
  async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    try {
      logger.info("Updating role", { id, name: roleData.role.name });

      const response = await this.update<Role>("/:id", id, roleData);

      logger.info("Role updated successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to update role", { id, roleData, error });
      throw error;
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<Role> {
    try {
      logger.info("Deleting role", { id });

      const response = await this.delete<Role>("/:id", id);

      logger.info("Role deleted successfully", { id });

      return response.data;
    } catch (error) {
      logger.error("Failed to delete role", { id, error });
      throw error;
    }
  }

  /**
   * Bulk operations for roles
   */
  async bulkUpdateRoles(
    updates: Array<{
      id: string;
      data: Partial<UpdateRoleRequest["role"]>;
    }>
  ): Promise<Role[]> {
    try {
      logger.info("Bulk updating roles", { updates });

      const promises = updates.map(({ id, data }) =>
        this.updateRole(id, { role: data as UpdateRoleRequest["role"] })
      );

      const results = await Promise.all(promises);

      logger.info("Bulk role update completed", {
        count: results.length,
      });

      return results;
    } catch (error) {
      logger.error("Bulk role update failed", { updates, error });
      throw error;
    }
  }
}

// Create singleton instance
export const rolesApiService = new RolesApiService();
