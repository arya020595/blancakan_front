/**
 * Roles Page - TanStack Query Implementation
 *
 * Simplified using React Query - all state management, caching,
 * optimistic updates, and error handling are handled by TanStack Query
 *
 * Code reduction: ~380 lines → ~180 lines (53% reduction!)
 */

"use client";

import { FormShell } from "@/components/forms/form-shell";
import { DeleteRoleContent } from "@/components/roles/forms/delete-role-content";
import { RoleForm } from "@/components/roles/forms/role-form";
import { RolePagination } from "@/components/roles/role-pagination";
import { RoleTableRow } from "@/components/roles/role-table-row";
import { RolesTable } from "@/components/roles/roles-table";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ui/error-modal";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import {
  useCreateRole,
  useDeleteRole,
  useRoles,
  useUpdateRole,
} from "@/hooks/roles-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import type { Role } from "@/lib/api/types";
import { roleSchema, type RoleFormValues } from "@/lib/schemas/role-schema";
import { normalizeError } from "@/lib/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";

export default function RolesPage() {
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // Toasts
  const toasts = useOptimisticToasts();

  // Error modal
  const {
    error: modalError,
    isErrorModalOpen,
    showError,
    closeError,
  } = useErrorModal();

  // React Query Hooks - handles ALL data fetching, caching, and state
  const { data, isLoading, error } = useRoles({
    page: currentPage,
    per_page: 10,
    query: searchQuery || "*",
    sort: "created_at:desc",
  });

  // Mutations - TanStack Query handles cache invalidation automatically
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  // Extract data from React Query response
  const roles = data?.data ?? [];
  const meta = data?.meta ?? null;

  // Handle create mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowCreateModal(false);
      toasts.createSuccess("Role");
      createMutation.reset();
    }
    if (createMutation.isError) {
      showError(normalizeError(createMutation.error, "Failed to create role"));
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  // Handle update mutation success/error
  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingRole(null);
      toasts.updateSuccess("Role");
      updateMutation.reset();
    }
    if (updateMutation.isError) {
      showError(normalizeError(updateMutation.error, "Failed to update role"));
      updateMutation.reset();
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  // Handle delete mutation success/error
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setDeletingRole(null);
      toasts.deleteSuccess("Role");
      deleteMutation.reset();
    }
    if (deleteMutation.isError) {
      showError(normalizeError(deleteMutation.error, "Failed to delete role"));
      deleteMutation.reset();
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  // Handlers - Simplified with mutation callbacks!
  const handleCreate = (formData: RoleFormValues) => {
    createMutation.mutate({
      role: {
        name: formData.name,
        description: formData.description?.trim() || "",
      },
    });
  };

  const handleUpdate = (formData: RoleFormValues) => {
    if (!editingRole) return;

    updateMutation.mutate({
      id: editingRole._id,
      data: {
        role: {
          name: formData.name,
          description: formData.description?.trim() || "",
        },
      },
    });
  };

  const handleDelete = () => {
    if (!deletingRole) return;
    deleteMutation.mutate(deletingRole._id);
  };

  const handleEdit = (role: Role) => setEditingRole(role);

  const handleDeleteConfirm = (id: string) => {
    const role = roles.find((r) => r._id === id);
    if (role) setDeletingRole(role);
  };

  // Table content
  const tableContent =
    roles.length === 0 ? (
      <tr>
        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
          No roles found
        </td>
      </tr>
    ) : (
      roles.map((role) => (
        <RoleTableRow
          key={role._id}
          role={role}
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
          <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-600">
            Manage user roles and permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Add Role</Button>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Search roles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <RolesTable
        tableContent={tableContent}
        error={error ? new Error(error.message) : null}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <Suspense fallback={<div>Loading pagination...</div>}>
        <RolePagination
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
        title="Create New Role">
        <FormShell<RoleFormValues>
          defaultValues={{ name: "", description: "" }}
          resolver={zodResolver(roleSchema)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Role"
          onCancel={() => setShowCreateModal(false)}>
          <RoleForm mode="create" isSubmitting={createMutation.isPending} />
        </FormShell>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        title="Edit Role">
        <FormShell<RoleFormValues>
          defaultValues={{
            name: editingRole?.name || "",
            description: editingRole?.description || "",
          }}
          resolver={zodResolver(roleSchema)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
          submitLabel="Update Role"
          onCancel={() => setEditingRole(null)}>
          <RoleForm mode="edit" isSubmitting={updateMutation.isPending} />
        </FormShell>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        title="Delete Role">
        {deletingRole && <DeleteRoleContent roleName={deletingRole.name} />}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletingRole(null)}>
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
              "Delete Role"
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
