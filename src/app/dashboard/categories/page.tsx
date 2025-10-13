/**
 * Categories Page - DataTable Implementation
 *
 * Refactored using reusable DataTable component with URL-based state management
 * Features: Search, sort, filter, pagination with shareable URLs
 */

"use client";

import { CategoryForm } from "@/components/categories/forms/category-form";
import { DeleteCategoryContent } from "@/components/categories/forms/delete-category-content";
import { FormShell } from "@/components/forms/form-shell";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import ErrorModal from "@/components/ui/error-modal";
import { Icons } from "@/components/ui/icons";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import { useTableParams } from "@/hooks/use-table-params";
import type { Category } from "@/lib/api/types";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category-schema";
import { normalizeError } from "@/lib/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  categoriesColumns,
  categoriesFilters,
} from "./categories-table-config";

export default function CategoriesPage() {
  // URL-based state management (search, sort, filters, pagination)
  const { params } = useTableParams();

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Toasts
  const toasts = useOptimisticToasts();

  // Error modal
  const {
    error: modalError,
    isErrorModalOpen,
    showError,
    closeError,
  } = useErrorModal();

  // React Query Hooks - params come from URL
  const { data, isLoading, error } = useCategories({
    page: params.page,
    per_page: params.per_page,
    query: params.query || "*",
    sort: params.sort || "created_at:desc",
    filter: params.filter,
  });

  // Mutations - TanStack Query handles cache invalidation automatically
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Extract data from React Query response
  const categories = data?.data ?? [];
  const meta = data?.meta ?? null;

  // Handle create mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowCreateModal(false);
      toasts.createSuccess("Category");
      createMutation.reset();
    }
    if (createMutation.isError) {
      showError(
        normalizeError(createMutation.error, "Failed to create category")
      );
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  // Handle update mutation success/error
  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingCategory(null);
      toasts.updateSuccess("Category");
      updateMutation.reset();
    }
    if (updateMutation.isError) {
      showError(
        normalizeError(updateMutation.error, "Failed to update category")
      );
      updateMutation.reset();
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  // Handle delete mutation success/error
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setDeletingCategory(null);
      toasts.deleteSuccess("Category");
      deleteMutation.reset();
    }
    if (deleteMutation.isError) {
      showError(
        normalizeError(deleteMutation.error, "Failed to delete category")
      );
      deleteMutation.reset();
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  // Handlers - Simple, no async/await
  const handleCreate = (formData: CategoryFormValues) => {
    createMutation.mutate({
      category: {
        name: formData.name,
        description: formData.description?.trim() || "",
        is_active: formData.is_active,
        parent_id: null,
      },
    });
  };

  const handleUpdate = (formData: CategoryFormValues) => {
    if (!editingCategory) return;

    updateMutation.mutate({
      id: editingCategory._id,
      data: {
        category: {
          name: formData.name,
          description: formData.description?.trim() || "",
          is_active: formData.is_active,
          parent_id: null,
        },
      },
    });
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteMutation.mutate(deletingCategory._id);
  };

  const handleEdit = (category: Category) => setEditingCategory(category);

  const handleDeleteConfirm = (category: Category) =>
    setDeletingCategory(category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-600">Manage event categories</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Icons.add size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* DataTable - Handles search, sort, filter, pagination */}
      <DataTable
        columns={categoriesColumns}
        data={categories}
        meta={meta}
        isLoading={isLoading}
        error={error ? new Error(error.message) : null}
        searchable
        searchPlaceholder="Search categories..."
        filters={categoriesFilters}
        resourceName="category"
        actions={(category) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
              className="h-8 px-2">
              <Icons.edit size={16} className="text-gray-600 hover:text-indigo-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConfirm(category)}
              className="h-8 px-2">
              <Icons.delete size={16} className="text-gray-600 hover:text-red-600" />
            </Button>
          </div>
        )}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Category">
        <FormShell<CategoryFormValues>
          defaultValues={{ name: "", description: "", is_active: true }}
          resolver={zodResolver(categorySchema)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Category"
          onCancel={() => setShowCreateModal(false)}>
          <CategoryForm mode="create" isSubmitting={createMutation.isPending} />
        </FormShell>
      </Modal>

      {/* Edit Modal */}
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
          isSubmitting={updateMutation.isPending}
          submitLabel="Update Category"
          onCancel={() => setEditingCategory(null)}>
          <CategoryForm mode="edit" isSubmitting={updateMutation.isPending} />
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
            disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner
                  size={16}
                  className="-ml-1 text-white"
                  ariaLabel="Deleting"
                />
                Deleting...
              </span>
            ) : (
              "Delete Category"
            )}
          </Button>
        </div>
      </Modal>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={modalError}
        title="Validation Error"
      />
    </div>
  );
}
