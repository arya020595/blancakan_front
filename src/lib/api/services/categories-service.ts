/**
 * Categories API Service
 * Handles all category-related API operations
 * Follows SOLID principles with dependency injection
 */

import { createLogger } from "../../utils/logger";
import { BaseApiService } from "../base-service";
import type {
    CategoriesQueryParams,
    Category,
    CreateCategoryRequest,
    PaginatedResponse,
    UpdateCategoryRequest
} from "../types";

const logger = createLogger("CATEGORIES API");

export class CategoriesApiService extends BaseApiService {
  constructor() {
    super("/api/v1/admin/categories");
  }

  /**
   * Get all categories with pagination and filters
   */
  async getCategories(params: CategoriesQueryParams = {}): Promise<PaginatedResponse<Category>> {
    try {
      logger.info("Fetching categories", params);

      const response = await this.getList<Category>("", params);

      logger.info("Categories fetched successfully", {
        count: response.data?.length || 0,
        total: response.meta?.total_count || 0,
      });

      return response;
    } catch (error) {
      logger.error("Failed to fetch categories", error);
      throw error;
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: string): Promise<Category> {
    try {
      logger.info("Fetching category", { id });

      const response = await this.getById<Category>("/:id", id);

      logger.info("Category fetched successfully", { id, name: response.data.name });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch category", { id, error });
      throw error;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      logger.info("Creating category", { name: categoryData.category.name });

      const response = await this.create<Category>("", categoryData);

      logger.info("Category created successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to create category", { categoryData, error });
      throw error;
    }
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category> {
    try {
      logger.info("Updating category", { id, name: categoryData.category.name });

      const response = await this.update<Category>("/:id", id, categoryData);

      logger.info("Category updated successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to update category", { id, categoryData, error });
      throw error;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<Category> {
    try {
      logger.info("Deleting category", { id });

      const response = await this.delete<Category>("/:id", id);

      logger.info("Category deleted successfully", {
        id: response.data._id,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to delete category", { id, error });
      throw error;
    }
  }
}

// Create singleton instance
export const categoriesApiService = new CategoriesApiService();
