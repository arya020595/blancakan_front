/**
 * Categories Page - TanStack Query Implementation
 *
 * Following official TanStack Query pattern
 * @see docs/guides/TANSTACK_QUERY_CRUD_GUIDE.md
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
import { FormShell } from "@/components/forms/form-shell";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ui/error-modal";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import type { Category } from "@/lib/api/types";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category-schema";
import { normalizeError } from "@/lib/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";

export default function CategoriesPage() {
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // TanStack Query hooks
  const { data, isLoading, error } = useCategories({
    page: currentPage,
    per_page: 10,
    query: searchQuery || "*",
    sort: "created_at:desc",
  });

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Extract data
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
          <p className="text-sm text-gray-600">Manage event categories</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Add Category</Button>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <CategoriesTable
        tableContent={tableContent}
        error={error ? new Error(error.message) : null}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <Suspense fallback={<CategoryPaginationSkeleton />}>
        <CategoryPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      </Suspense>

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
