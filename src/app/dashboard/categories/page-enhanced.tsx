/**
 * Categories Page with Enhanced Components
 * Uses the new toast system and loading components for better UX
 */

"use client";

import { ComponentErrorBoundary } from "@/components/error-boundary";
import { CategoryTableSkeleton } from "@/components/loading";
import { useOptimisticToasts } from "@/components/toast";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories-hooks";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const logger = createLogger("CATEGORIES PAGE ENHANCED");

// Memoized components for better performance
const CategoryTableRow = React.memo(
  ({
    category,
    onEdit,
    onDelete,
  }: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
  }) => {
    const isTempCategory = category._id.startsWith("temp-");

    const handleEdit = useCallback(() => {
      onEdit(category);
    }, [category, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(category._id);
    }, [category._id, onDelete]);

    return (
      <tr className={`hover:bg-gray-50 ${isTempCategory ? "opacity-70" : ""}`}>
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
            onClick={handleEdit}
            disabled={isTempCategory}
            className="text-indigo-600 hover:text-indigo-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              isTempCategory ? "Cannot edit while saving..." : "Edit category"
            }>
            Edit
          </button>
          <button
            onClick={handleDelete}
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
  }
);

CategoryTableRow.displayName = "CategoryTableRow";

// Main component
export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Enhanced toast system
  const toasts = useOptimisticToasts();

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

  // Memoized callbacks to prevent unnecessary re-renders
  const isTempId = useCallback((id: string) => id.startsWith("temp-"), []);

  // Memoized fetch parameters
  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      per_page: 10,
      query: searchQuery || "*",
    }),
    [currentPage, searchQuery]
  );

  // Load categories when params change
  useEffect(() => {
    logger.info("Loading categories page", fetchParams);
    fetchCategories(fetchParams);
  }, [fetchCategories, fetchParams]);

  // Memoized handlers
  const handleCreate = useCallback(
    async (formData: FormData) => {
      const categoryData: CreateCategoryRequest = {
        category: {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          is_active: true,
          parent_id: null,
        },
      };

      const tempId = `temp-${Date.now()}`;
      const optimisticCategory: Category = {
        _id: tempId,
        name: categoryData.category.name,
        description: categoryData.category.description,
        is_active: categoryData.category.is_active,
        parent_id: categoryData.category.parent_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        addCategoryOptimistic(optimisticCategory);
        setShowCreateModal(false);

        const response = await createCategory(categoryData);
        replaceTempCategoryOptimistic(tempId, response);
        toasts.createSuccess("Category");

        logger.info("Category created successfully");
      } catch (error) {
        removeCategoryOptimistic(tempId);
        setShowCreateModal(true);
        toasts.createError("Category");
        logger.error("Failed to create category", error);
      }
    },
    [
      createCategory,
      addCategoryOptimistic,
      replaceTempCategoryOptimistic,
      removeCategoryOptimistic,
      toasts,
    ]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editingCategory) return;

      if (isTempId(editingCategory._id)) {
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

      const optimisticCategory: Category = {
        ...editingCategory,
        name: categoryData.category.name,
        description: categoryData.category.description,
        updated_at: new Date().toISOString(),
      };

      const originalCategory = editingCategory;

      try {
        updateCategoryOptimistic(optimisticCategory);
        setEditingCategory(null);

        const response = await updateCategory(
          editingCategory._id,
          categoryData
        );
        updateCategoryOptimistic(response);
        toasts.updateSuccess("Category");

        logger.info("Category updated successfully");
      } catch (error) {
        updateCategoryOptimistic(originalCategory);
        setEditingCategory(originalCategory);
        toasts.updateError("Category");
        logger.error("Failed to update category", error);
      }
    },
    [
      editingCategory,
      updateCategory,
      updateCategoryOptimistic,
      toasts,
      isTempId,
    ]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (isTempId(id)) {
        logger.warn("Attempted to delete temporary category", { id });
        return;
      }

      const categoryToDelete = categories.find((cat) => cat._id === id);
      if (!categoryToDelete) return;

      try {
        removeCategoryOptimistic(id);
        setDeleteConfirm(null);

        await deleteCategory(id);
        toasts.deleteSuccess("Category");

        logger.info("Category deleted successfully");
      } catch (error) {
        addCategoryOptimistic(categoryToDelete);
        setDeleteConfirm(id);
        toasts.deleteError("Category");
        logger.error("Failed to delete category", error);
      }
    },
    [
      categories,
      deleteCategory,
      removeCategoryOptimistic,
      addCategoryOptimistic,
      toasts,
      isTempId,
    ]
  );

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
  }, []);

  const handleDeleteConfirm = useCallback((id: string) => {
    setDeleteConfirm(id);
  }, []);

  // Memoized error state
  const errorState = useMemo(
    () => error || createError || updateError || deleteError,
    [error, createError, updateError, deleteError]
  );

  // Memoized table content
  const tableContent = useMemo(() => {
    if (isLoading) {
      return <CategoryTableSkeleton rows={5} />;
    }

    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            No categories found
          </td>
        </tr>
      );
    }

    return categories.map((category) => (
      <CategoryTableRow
        key={category._id}
        category={category}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />
    ));
  }, [isLoading, categories, handleEdit, handleDeleteConfirm]);

  return (
    <ComponentErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-600">
              Manage your event categories
            </p>
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
        {errorState && (
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
                  <p>{errorState.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Table */}
        {isLoading ? (
          <CategoryTableSkeleton rows={5} />
        ) : (
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
                {tableContent}
              </tbody>
            </table>
          </div>
        )}

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
                Are you sure you want to delete this category? This action
                cannot be undone.
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
    </ComponentErrorBoundary>
  );
}
