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
  CategoryPagination,
  CategoryPaginationSkeleton,
} from "@/components/categories/category-pagination";
import { CategoryTableRow } from "@/components/categories/category-table-row";
import {
  CategoryForm,
  type CategoryFormValues,
} from "@/components/categories/forms/category-form";
import { DeleteCategoryContent } from "@/components/categories/forms/delete-category-content";
import { ComponentErrorBoundary } from "@/components/error-boundary";
import { FormShell } from "@/components/forms/form-shell";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
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
import { Loader2 as Loader2Icon } from "lucide-react";
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
    async (data: CategoryFormValues) => {
      const categoryData: CreateCategoryRequest = {
        category: {
          name: data.name,
          description: (data.description || "").trim(),
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
    async (data: CategoryFormValues) => {
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
          name: data.name,
          description: (data.description || "").trim(),
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
  }, [categories, handleEdit, handleDeleteConfirm]);

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
          <Button onClick={() => setShowCreateModal(true)}>Add Category</Button>
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
        <CategoriesTable
          tableContent={tableContent}
          error={errorState ? new Error(errorState.message) : null}
          isLoading={isLoading}
        />

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
        {/* Create Category Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Category">
          <FormShell<CategoryFormValues>
            defaultValues={{ name: "", description: "" }}
            onSubmit={handleCreate}
            isSubmitting={isCreating}
            submitLabel="Create Category"
            onCancel={() => setShowCreateModal(false)}>
            <CategoryForm mode="create" isSubmitting={isCreating} />
          </FormShell>
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title="Edit Category">
          <FormShell<CategoryFormValues>
            defaultValues={{
              name: editingCategory?.name || "",
              description: editingCategory?.description || "",
            }}
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
            submitLabel="Update Category"
            onCancel={() => setEditingCategory(null)}>
            <CategoryForm mode="edit" isSubmitting={isUpdating} />
          </FormShell>
        </Modal>

        {/* Delete Category Modal */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Category">
          {deleteConfirm && (
            <DeleteCategoryContent 
              categoryName={
                categories.find((cat) => cat._id === deleteConfirm)?.name || ""
              } 
            />
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={isDeleting}>
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2Icon className="-ml-1 h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Category"
              )}
            </Button>
          </div>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
}
