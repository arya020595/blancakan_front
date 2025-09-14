/**
 * Categories Page with Enterprise Component Architecture
 *
 * Follows React best practices and enterprise standards:
 * - Single Responsibility Principle
 * - Proper component separation
 * - Suspense boundaries for streaming UI
 * - Optimistic updates for better UX
 * - Error boundary integration
 * - Accessibility compliance
 *
 * @see https://react.dev/reference/react/Suspense
 * @see https://react.dev/learn/thinking-in-react
 */

"use client";

import { CategoriesTable } from "@/components/categories/categories-table";
import {
  CreateCategoryModal,
  DeleteConfirmModal,
  EditCategoryModal,
} from "@/components/categories/category-modals";
import {
  CategoryPagination,
  CategoryPaginationSkeleton,
} from "@/components/categories/category-pagination";
import { CategoryTableRow } from "@/components/categories/category-table-row";
import { ComponentErrorBoundary } from "@/components/error-boundary";
import { CategoryTableSkeleton } from "@/components/loading/skeleton";
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
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

const logger = createLogger("CATEGORIES PAGE");

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

        {/* Categories Table with Suspense */}
        <Suspense fallback={<CategoryTableSkeleton rows={10} />}>
          <CategoriesTable
            tableContent={tableContent}
            isLoading={isLoading}
            error={errorState ? new Error(errorState.message) : null}
          />
        </Suspense>

        {/* Pagination with Suspense */}
        <Suspense fallback={<CategoryPaginationSkeleton />}>
          <CategoryPagination
            meta={meta}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </Suspense>

        {/* Modals */}
        <CreateCategoryModal
          isOpen={showCreateModal}
          isCreating={isCreating}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />

        <EditCategoryModal
          isOpen={!!editingCategory}
          category={editingCategory}
          isUpdating={isUpdating}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleUpdate}
        />

        <DeleteConfirmModal
          isOpen={!!deleteConfirm}
          categoryName={
            deleteConfirm
              ? categories.find((cat) => cat._id === deleteConfirm)?.name
              : undefined
          }
          isDeleting={isDeleting}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        />
      </div>
    </ComponentErrorBoundary>
  );
}
