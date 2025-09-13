/**
 * Categories API Debug Helper
 * Quick debugging functions to test API calls
 */

import { categoriesApiService } from "@/lib/api/services/categories-service";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "@/lib/api/types";

// Add this to window for debugging in browser console
declare global {
  interface Window {
    debugCategories: {
      testList: () => Promise<void>;
      testCreate: () => Promise<void>;
      testUpdate: (id: string) => Promise<void>;
      testDelete: (id: string) => Promise<void>;
    };
  }
}

const debugCategories = {
  async testList() {
    try {
      console.log("🔍 Testing categories list...");
      const result = await categoriesApiService.getCategories({
        page: 1,
        per_page: 10,
        query: "*",
        filter: { is_active: true },
        sort: "created_at:asc"
      });
      console.log("✅ Categories list success:", result);
    } catch (error) {
      console.error("❌ Categories list failed:", error);
    }
  },

  async testCreate() {
    try {
      console.log("🔍 Testing category creation...");
      const categoryData: CreateCategoryRequest = {
        category: {
          name: "Test Category " + Date.now(),
          description: "Test description",
          is_active: true,
          parent_id: null,
        },
      };
      console.log("📤 Sending create request:", categoryData);
      const result = await categoriesApiService.createCategory(categoryData);
      console.log("✅ Category creation success:", result);
    } catch (error) {
      console.error("❌ Category creation failed:", error);
    }
  },

  async testUpdate(id: string) {
    try {
      console.log("🔍 Testing category update for ID:", id);
      const categoryData: UpdateCategoryRequest = {
        category: {
          name: "Updated Test Category " + Date.now(),
          description: "Updated test description",
          status: true,
          parent_id: null,
        },
      };
      console.log("📤 Sending update request:", categoryData);
      const result = await categoriesApiService.updateCategory(id, categoryData);
      console.log("✅ Category update success:", result);
    } catch (error) {
      console.error("❌ Category update failed:", error);
      console.error("Error details:", {
        message: (error as any)?.message,
        status: (error as any)?.status,
        statusCode: (error as any)?.statusCode,
        errors: (error as any)?.errors,
      });
    }
  },

  async testDelete(id: string) {
    try {
      console.log("🔍 Testing category deletion for ID:", id);
      const result = await categoriesApiService.deleteCategory(id);
      console.log("✅ Category deletion success:", result);
    } catch (error) {
      console.error("❌ Category deletion failed:", error);
    }
  },
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  window.debugCategories = debugCategories;
}

export default debugCategories;
