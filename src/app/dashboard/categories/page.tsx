/**
 * Categories Management Page
 * Complete CRUD interface for managing categories
 * Follows established patterns with proper error handling and loading states
 */

"use client";

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories-hooks";
import { useTemporaryItems } from "@/hooks/use-temporary-items";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useEffect, useState } from "react";

const logger = createLogger("CATEGORIES PAGE");

interface ToastMessage {
  id: string;
  type: "success" | "error";
  message: string;
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast message
  const addToast = (type: "success" | "error", message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  // Remove toast message
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Temporary items manager
  const { isTemporary, addTemporary, removeTemporary } = useTemporaryItems(
    30000 // 30 seconds cleanup delay
  );

  // Hooks
  const {
    categories,
    meta,
    isLoading,
    error,
    fetchCategories,
    addCategoryOptimistic,
    updateCategoryOptimistic,
    removeCategoryOptimistic,
    replaceTempCategoryOptimistic,
  } = useCategories();
  const {
    createCategory,
    isLoading: isCreating,
    error: createError,
  } = useCreateCategory();
  const {
    updateCategory,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateCategory();
  const {
    deleteCategory,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteCategory();

  // Load categories on mount and when search/page changes
  useEffect(() => {
    logger.info("Loading categories page", { searchQuery, currentPage });

    const params = {
      page: currentPage,
      per_page: 10,
      query: searchQuery || "*",
      filter: { is_active: true },
      sort: "created_at:asc",
    };

    fetchCategories(params);
  }, [fetchCategories, searchQuery, currentPage]);

  // Create category handler with optimistic update
  const handleCreate = async (formData: FormData) => {
    const categoryData: CreateCategoryRequest = {
      category: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        is_active: true,
        parent_id: null,
      },
    };

    // Create optimistic category object
    const tempId = `temp-${Date.now()}`;
    const optimisticCategory: Category = {
      _id: tempId, // Temporary ID
      name: categoryData.category.name,
      description: categoryData.category.description,
      is_active: categoryData.category.is_active,
      parent_id: categoryData.category.parent_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // Track as temporary item
      addTemporary(tempId, (id) => {
        // Auto-cleanup function - remove from UI if still temporary after timeout
        removeCategoryOptimistic(id);
        logger.warn("Temporary category cleanup", { id });
      });

      // Optimistic update
      addCategoryOptimistic(optimisticCategory);
      setShowCreateModal(false);

      // Make API call
      const response = await createCategory(categoryData);

      // Remove from temporary tracking FIRST
      removeTemporary(tempId);

      // Replace the temporary category with the real one
      replaceTempCategoryOptimistic(tempId, response);

      addToast("success", "Category created successfully!");

      logger.info("Category created successfully");
    } catch (error) {
      // Rollback optimistic update on error
      removeTemporary(tempId);
      removeCategoryOptimistic(tempId);
      setShowCreateModal(true); // Show modal again for retry
      addToast("error", "Failed to create category. Please try again.");
      logger.error("Failed to create category", error);
    }
  };

  // Update category handler with optimistic update
  const handleUpdate = async (formData: FormData) => {
    if (!editingCategory) return;

    // Prevent editing temporary categories
    if (isTemporary(editingCategory._id)) {
      logger.warn("Attempted to edit temporary category", {
        id: editingCategory._id,
      });
      setEditingCategory(null);
      return;
    }

    const categoryData: UpdateCategoryRequest = {
      category: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: true,
        parent_id: null,
      },
    };

    // Create optimistic updated category
    const optimisticCategory: Category = {
      ...editingCategory,
      name: categoryData.category.name,
      description: categoryData.category.description,
      updated_at: new Date().toISOString(),
    };

    // Store original for rollback
    const originalCategory = editingCategory;

    try {
      // Optimistic update
      updateCategoryOptimistic(optimisticCategory);
      setEditingCategory(null);

      // Make API call
      const response = await updateCategory(editingCategory._id, categoryData);

      // Update with real response
      updateCategoryOptimistic(response);
      addToast("success", "Category updated successfully!");

      logger.info("Category updated successfully");
    } catch (error) {
      // Rollback optimistic update on error
      updateCategoryOptimistic(originalCategory);
      setEditingCategory(originalCategory); // Show modal again for retry
      addToast("error", "Failed to update category. Please try again.");
      logger.error("Failed to update category", error);
    }
  };

  // Delete category handler with optimistic update
  const handleDelete = async (id: string) => {
    // Prevent deleting temporary categories
    if (isTemporary(id)) {
      logger.warn("Attempted to delete temporary category", { id });
      return;
    }

    const categoryToDelete = categories.find((cat) => cat._id === id);
    if (!categoryToDelete) return;

    try {
      // Optimistic update
      removeCategoryOptimistic(id);
      setDeleteConfirm(null);

      // Make API call
      await deleteCategory(id);
      addToast("success", "Category deleted successfully!");

      logger.info("Category deleted successfully");
    } catch (error) {
      // Rollback optimistic update on error
      addCategoryOptimistic(categoryToDelete);
      setDeleteConfirm(id); // Show confirmation again for retry
      addToast("error", "Failed to delete category. Please try again.");
      logger.error("Failed to delete category", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 border rounded-md shadow-lg max-w-sm w-full ${
                toast.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-3 opacity-70 hover:opacity-100">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-600">Manage your event categories</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Error Display */}
      {(error || createError || updateError || deleteError) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Operation Failed
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {error?.message ||
                    createError?.message ||
                    updateError?.message ||
                    deleteError?.message}
                </p>
                {/* Show additional error details if available */}
                {(error?.errors ||
                  createError?.errors ||
                  updateError?.errors ||
                  deleteError?.errors) && (
                  <div className="mt-2">
                    <p className="font-medium">Details:</p>
                    <ul className="list-disc list-inside mt-1">
                      {Object.entries(
                        error?.errors ||
                          createError?.errors ||
                          updateError?.errors ||
                          deleteError?.errors ||
                          {}
                      ).map(([field, messages]) => (
                        <li key={field}>
                          {field}:{" "}
                          {Array.isArray(messages)
                            ? messages.join(", ")
                            : messages}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2">Loading categories...</span>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                // Only check if ID starts with temp- for UI display
                const isTempCategory = category._id.startsWith("temp-");
                return (
                  <tr
                    key={category._id}
                    className={`hover:bg-gray-50 ${
                      isTempCategory ? "opacity-70" : ""
                    }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        {isTempCategory && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Saving...
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {category.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingCategory(category)}
                        disabled={isTempCategory}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          isTempCategory
                            ? "Cannot edit while saving..."
                            : "Edit category"
                        }>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category._id)}
                        disabled={isTempCategory}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          isTempCategory
                            ? "Cannot delete while saving..."
                            : "Delete category"
                        }>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {meta.current_page} of {meta.total_pages} ({meta.total_count}{" "}
            total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!meta.prev_page}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50">
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!meta.next_page}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create New Category</h3>
            <form action={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Edit Category</h3>
            <form action={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingCategory.name}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingCategory.description}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Delete Category</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
