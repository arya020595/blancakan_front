/**
 * Categories Page - Simplified with Optimistic Updates
 */

"use client";

import { CategoriesTable } from "@/components/categories/categories-table";
import {
  CategoryPagination,
  CategoryPaginationSkeleton,
} from "@/components/categories/category-pagination";
import { CategoryTableRow } from "@/components/categories/category-table-row";
import { CategoryForm } from "@/components/categories/forms/category-form";
import { DeleteCategoryContent } from "@/components/categories/forms/delete-category-content";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormShell } from "@/components/forms/form-shell";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ui/error-modal";
import Modal from "@/components/ui/modal";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { normalizeError } from "@/lib/utils/error-utils";
import { Suspense, useEffect, useState } from "react";

export default function CategoriesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Hooks
  const toasts = useOptimisticToasts();
  const {
    error: modalError,
    isErrorModalOpen,
    showError,
    closeError,
  } = useErrorModal();
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
    clearError: clearCreateError,
  } = useCreateCategory();
  const {
    updateCategory,
    isLoading: isUpdating,
    clearError: clearUpdateError,
  } = useUpdateCategory();
  const {
    deleteCategory,
    isLoading: isDeleting,
    clearError: clearDeleteError,
  } = useDeleteCategory();

  // Fetch data when params change
  useEffect(() => {
    fetchCategories({
      page: currentPage,
      per_page: 10,
      query: searchQuery || "*",
    });
  }, [fetchCategories, currentPage, searchQuery]);

  // Create handler with optimistic updates
  const handleCreate = async (data: CategoryFormValues) => {
    const categoryData: CreateCategoryRequest = {
      category: {
        name: data.name,
        description: (data.description || "").trim(),
        is_active: data.is_active,
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
    } catch (error) {
      removeCategoryOptimistic(tempId);
      setShowCreateModal(false);
      showError(normalizeError(error, "Failed to create category"));
      clearCreateError();
    }
  };

  // Update handler with optimistic updates
  const handleUpdate = async (data: CategoryFormValues) => {
    if (!editingCategory) return;

    // Skip temp categories
    if (editingCategory._id.startsWith("temp-")) {
      setEditingCategory(null);
      return;
    }

    const categoryData: UpdateCategoryRequest = {
      category: {
        name: data.name,
        description: (data.description || "").trim(),
        is_active: data.is_active,
        parent_id: null,
      },
    };

    const optimisticCategory: Category = {
      ...editingCategory,
      name: categoryData.category.name,
      description: categoryData.category.description,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    };

    const originalCategory = editingCategory;

    try {
      updateCategoryOptimistic(optimisticCategory);
      setEditingCategory(null);

      const response = await updateCategory(editingCategory._id, categoryData);
      updateCategoryOptimistic(response);
      toasts.updateSuccess("Category");
    } catch (error) {
      updateCategoryOptimistic(originalCategory);
      setEditingCategory(null);
      showError(normalizeError(error, "Failed to update category"));
      clearUpdateError();
    }
  };

  // Delete handler with optimistic updates
  const handleDelete = async () => {
    if (!deletingCategory) return;

    // Skip temp categories
    if (deletingCategory._id.startsWith("temp-")) return;

    const categoryToDelete = deletingCategory;

    try {
      removeCategoryOptimistic(deletingCategory._id);
      setDeletingCategory(null);

      await deleteCategory(deletingCategory._id);
      toasts.deleteSuccess("Category");
    } catch (error) {
      addCategoryOptimistic(categoryToDelete);
      setDeletingCategory(null);
      showError(normalizeError(error, "Failed to delete category"));
      clearDeleteError();
    }
  };

  // Simple handlers
  const handleEdit = (category: Category) => setEditingCategory(category);

  const handleDeleteConfirm = (id: string) => {
    const category = categories.find((cat) => cat._id === id);
    if (category) setDeletingCategory(category);
  };

  // Table content
  const tableContent =
    categories.length === 0 ? (
      <tr>
        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
          No categories found
        </td>
      </tr>
    ) : (
      categories.map((category) => (
        <CategoryTableRow
          key={category._id}
          category={category}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      ))
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-600">Manage your event categories</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Add Category</Button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Table */}
      <CategoriesTable
        tableContent={tableContent}
        error={error ? new Error(error.message) : null}
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
          defaultValues={{ name: "", description: "", is_active: true }}
          resolver={zodResolver(categorySchema)}
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
            is_active: editingCategory?.is_active ?? true,
          }}
          resolver={zodResolver(categorySchema)}
          onSubmit={handleUpdate}
          isSubmitting={isUpdating}
          submitLabel="Update Category"
          onCancel={() => setEditingCategory(null)}>
          <CategoryForm mode="edit" isSubmitting={isUpdating} />
        </FormShell>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category">
        {deletingCategory && (
          <DeleteCategoryContent categoryName={deletingCategory.name} />
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletingCategory(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}>
            Delete Category
          </Button>
        </div>
      </Modal>

      {/* Error Modal for Backend Validation Errors */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={modalError}
        title="Validation Error"
      />
    </div>
  );
}
