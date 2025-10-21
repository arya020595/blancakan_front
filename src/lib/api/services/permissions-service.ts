/**
 * Permissions API Service
 * Handles all permission-related API operations
 * Follows SOLID principles with dependency injection
 */

import { createLogger } from "../../utils/logger";
import { BaseApiService } from "../base-service";
import type {
    CreatePermissionRequest,
    PaginatedResponse,
    Permission,
    PermissionOptions,
    PermissionsQueryParams,
    UpdatePermissionRequest,
} from "../types";

const logger = createLogger("PERMISSIONS API");

export class PermissionsApiService extends BaseApiService {
  constructor() {
    super("/api/v1/admin/permissions");
    logger.info("PermissionsApiService initialized");
  }

  /**
   * Get all permissions with pagination and filters
   */
  async getPermissions(
    params: PermissionsQueryParams = {}
  ): Promise<PaginatedResponse<Permission>> {
    try {
      logger.info("Fetching permissions", { params });

      const response = await this.getList<Permission>("", params);

      logger.info("Permissions fetched successfully", {
        count: response.data?.length || 0,
        total: response.meta?.total_count || 0,
      });

      return response;
    } catch (error) {
      logger.error("Failed to fetch permissions", { params, error });
      throw error;
    }
  }

  /**
   * Get a single permission by ID
   */
  async getPermission(id: string): Promise<Permission> {
    try {
      logger.info("Fetching permission by ID", { id });

      const response = await this.getById<Permission>("/:id", id);

      logger.info("Permission fetched successfully", {
        id,
        action: response.data.action,
        subject_class: response.data.subject_class,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch permission", { id, error });
      throw error;
    }
  }

  /**
   * Create a new permission
   */
  async createPermission(
    permissionData: CreatePermissionRequest
  ): Promise<Permission> {
    try {
      logger.info("Creating new permission", {
        action: permissionData.permission.action,
        subject_class: permissionData.permission.subject_class,
      });

      const response = await this.create<Permission>("", permissionData);

      logger.info("Permission created successfully", {
        id: response.data._id,
        action: response.data.action,
        subject_class: response.data.subject_class,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to create permission", { permissionData, error });
      throw error;
    }
  }

  /**
   * Update an existing permission
   */
  async updatePermission(
    id: string,
    permissionData: UpdatePermissionRequest
  ): Promise<Permission> {
    try {
      logger.info("Updating permission", {
        id,
        action: permissionData.permission.action,
        subject_class: permissionData.permission.subject_class,
      });

      const response = await this.update<Permission>("/:id", id, permissionData);

      logger.info("Permission updated successfully", {
        id: response.data._id,
        action: response.data.action,
        subject_class: response.data.subject_class,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to update permission", { id, permissionData, error });
      throw error;
    }
  }

  /**
   * Delete a permission
   */
  async deletePermission(id: string): Promise<Permission> {
    try {
      logger.info("Deleting permission", { id });

      const response = await this.delete<Permission>("/:id", id);

      logger.info("Permission deleted successfully", { id });

      return response.data;
    } catch (error) {
      logger.error("Failed to delete permission", { id, error });
      throw error;
    }
  }

  /**
   * Get permission options (available subject classes, etc.)
   */
  async getPermissionOptions(): Promise<PermissionOptions> {
    try {
      logger.info("Fetching permission options");

      const response = await this.customAction<PermissionOptions>(
        "GET",
        "/options"
      );

      logger.info("Permission options fetched successfully");

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch permission options", { error });
      throw error;
    }
  }
}

// Create singleton instance
export const permissionsApiService = new PermissionsApiService();
