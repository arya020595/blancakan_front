/**
 * Roles Page - Simplified with Optimistic Updates
 */

"use client";

import { FormShell } from "@/components/forms/form-shell";
import { DeleteRoleContent } from "@/components/roles/forms/delete-role-content";
import {
  RoleForm,
  type RoleFormValues,
} from "@/components/roles/forms/role-form";
import { RolePagination } from "@/components/roles/role-pagination";
import { RoleTableRow } from "@/components/roles/role-table-row";
import { RolesTable } from "@/components/roles/roles-table";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ui/error-modal";
import Modal from "@/components/ui/modal";
import {
  useCreateRole,
  useDeleteRole,
  useOptimisticRoles,
  useRoles,
  useUpdateRole,
} from "@/hooks/roles-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "@/lib/api/types";
import { normalizeError } from "@/lib/utils/error-utils";
import { Suspense, useEffect, useState } from "react";

export default function RolesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // Enhanced toast system
  const toasts = useOptimisticToasts();

  // Error modal hook
  const {
    error: modalError,
    isErrorModalOpen,
    showError,
    closeError,
  } = useErrorModal();

  // Optimistic updates hook
  const { addOptimisticUpdate, removeOptimisticUpdate } = useOptimisticRoles();

  // Hooks
  const { roles, meta, isLoading, error, fetchRoles, setRoles } = useRoles();
  const {
    createRole,
    isLoading: isCreating,
    clearError: clearCreateError,
  } = useCreateRole();
  const {
    updateRole,
    isLoading: isUpdating,
    clearError: clearUpdateError,
  } = useUpdateRole();
  const {
    deleteRole,
    isLoading: isDeleting,
    clearError: clearDeleteError,
  } = useDeleteRole();

  // Fetch data when params change
  useEffect(() => {
    fetchRoles({
      page: currentPage,
      per_page: 10,
      query: searchQuery || "*",
    });
  }, [fetchRoles, currentPage, searchQuery]);

  // Create handler with optimistic updates
  const handleCreate = async (data: RoleFormValues) => {
    const roleData: CreateRoleRequest = {
      role: {
        name: data.name,
        description: (data.description || "").trim(),
      },
    };

    const tempId = `temp-${Date.now()}`;
    const optimisticRole: Role = {
      _id: tempId,
      name: roleData.role.name,
      description: roleData.role.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      addOptimisticUpdate(tempId, "creating");
      setRoles((prev) => [optimisticRole, ...prev]);
      setShowCreateModal(false);

      const response = await createRole(roleData);

      setRoles((prev) =>
        prev.map((role) => (role._id === tempId ? response : role))
      );
      removeOptimisticUpdate(tempId);
      toasts.createSuccess("Role");
    } catch (error) {
      setRoles((prev) => prev.filter((role) => role._id !== tempId));
      removeOptimisticUpdate(tempId);
      setShowCreateModal(false);
      showError(normalizeError(error, "Failed to create role"));
      clearCreateError();
    }
  };

  // Update handler with optimistic updates
  const handleUpdate = async (data: RoleFormValues) => {
    if (!editingRole) return;

    // Skip temp roles
    if (editingRole._id.startsWith("temp-")) {
      setEditingRole(null);
      return;
    }

    const roleData: UpdateRoleRequest = {
      role: {
        name: data.name,
        description: (data.description || "").trim(),
      },
    };

    const optimisticRole: Role = {
      ...editingRole,
      name: roleData.role.name,
      description: roleData.role.description,
      updated_at: new Date().toISOString(),
    };

    const originalRole = editingRole;

    try {
      addOptimisticUpdate(editingRole._id, "updating");
      setRoles((prev) =>
        prev.map((role) =>
          role._id === editingRole._id ? optimisticRole : role
        )
      );
      setEditingRole(null);

      const response = await updateRole(editingRole._id, roleData);

      setRoles((prev) =>
        prev.map((role) => (role._id === editingRole._id ? response : role))
      );
      removeOptimisticUpdate(editingRole._id);
      toasts.updateSuccess("Role");
    } catch (error) {
      setRoles((prev) =>
        prev.map((role) => (role._id === editingRole._id ? originalRole : role))
      );
      removeOptimisticUpdate(editingRole._id);
      setEditingRole(null);
      showError(normalizeError(error, "Failed to update role"));
      clearUpdateError();
    }
  };

  // Delete handler with optimistic updates
  const handleDelete = async () => {
    if (!deletingRole) return;

    // Skip temp roles
    if (deletingRole._id.startsWith("temp-")) return;

    const roleToDelete = deletingRole;

    try {
      addOptimisticUpdate(deletingRole._id, "deleting");
      setRoles((prev) => prev.filter((role) => role._id !== deletingRole._id));
      setDeletingRole(null);

      await deleteRole(deletingRole._id);
      removeOptimisticUpdate(deletingRole._id);
      toasts.deleteSuccess("Role");
    } catch (error) {
      setRoles((prev) => [...prev, roleToDelete]);
      removeOptimisticUpdate(deletingRole._id);
      setDeletingRole(null);
      showError(normalizeError(error, "Failed to delete role"));
      clearDeleteError();
    }
  };

  // Simple handlers
  const handleEdit = (role: Role) => setEditingRole(role);

  const handleDeleteConfirm = (id: string) => {
    const role = roles.find((role) => role._id === id);
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
      <input
        type="text"
        placeholder="Search roles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          submitLabel="Create Role"
          onCancel={() => setShowCreateModal(false)}>
          <RoleForm mode="create" isSubmitting={isCreating} />
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
          onSubmit={handleUpdate}
          isSubmitting={isUpdating}
          submitLabel="Update Role"
          onCancel={() => setEditingRole(null)}>
          <RoleForm mode="edit" isSubmitting={isUpdating} />
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
            disabled={isDeleting}>
            Delete Role
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
