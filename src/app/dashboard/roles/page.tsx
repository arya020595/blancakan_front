/**
 * Roles Page with Enterprise Component Architecture
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

import { ComponentErrorBoundary } from "@/components/error-boundary";
// Refactored: use global Modal + field-only forms
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
import Modal from "@/components/ui/modal";
import {
  useCreateRole,
  useDeleteRole,
  useOptimisticRoles,
  useRoles,
  useUpdateRole,
} from "@/hooks/roles-hooks";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

const logger = createLogger("ROLES PAGE");

// Main component
export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // Enhanced toast system
  const toasts = useOptimisticToasts();

  // Optimistic updates hook
  const { addOptimisticUpdate, removeOptimisticUpdate } = useOptimisticRoles();

  // Hooks
  const { roles, meta, isLoading, error, fetchRoles, setRoles } = useRoles();

  const {
    createRole,
    isLoading: isCreating,
    error: createError,
  } = useCreateRole();

  const {
    updateRole,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateRole();

  const {
    deleteRole,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteRole();

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

  // Load roles when params change
  useEffect(() => {
    logger.info("Loading roles page", fetchParams);
    fetchRoles(fetchParams);
  }, [fetchRoles, fetchParams]);

  // Memoized handlers
  const handleCreate = useCallback(
    async (data: RoleFormValues) => {
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
        // Add optimistic update
        addOptimisticUpdate(tempId, "creating");
        setRoles((prev) => [optimisticRole, ...prev]);
        setShowCreateModal(false);

        const response = await createRole(roleData);

        // Replace temporary role with real one
        setRoles((prev) =>
          prev.map((role) => (role._id === tempId ? response : role))
        );
        removeOptimisticUpdate(tempId);
        toasts.createSuccess("Role");

        logger.info("Role created successfully");
      } catch (error) {
        // Remove temporary role
        setRoles((prev) => prev.filter((role) => role._id !== tempId));
        removeOptimisticUpdate(tempId);
        setShowCreateModal(true);
        toasts.createError("Role");
        logger.error("Failed to create role", error);
      }
    },
    [createRole, setRoles, addOptimisticUpdate, removeOptimisticUpdate, toasts]
  );

  const handleUpdate = useCallback(
    async (data: RoleFormValues) => {
      if (!editingRole) return;

      if (isTempId(editingRole._id)) {
        logger.warn("Attempted to edit temporary role", {
          id: editingRole._id,
        });
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
        // Add optimistic update
        addOptimisticUpdate(editingRole._id, "updating");
        setRoles((prev) =>
          prev.map((role) =>
            role._id === editingRole._id ? optimisticRole : role
          )
        );
        setEditingRole(null);

        const response = await updateRole(editingRole._id, roleData);

        // Update with server response
        setRoles((prev) =>
          prev.map((role) => (role._id === editingRole._id ? response : role))
        );
        removeOptimisticUpdate(editingRole._id);
        toasts.updateSuccess("Role");

        logger.info("Role updated successfully");
      } catch (error) {
        // Revert optimistic update
        setRoles((prev) =>
          prev.map((role) =>
            role._id === editingRole._id ? originalRole : role
          )
        );
        removeOptimisticUpdate(editingRole._id);
        setEditingRole(originalRole);
        toasts.updateError("Role");
        logger.error("Failed to update role", error);
      }
    },
    [
      editingRole,
      updateRole,
      setRoles,
      addOptimisticUpdate,
      removeOptimisticUpdate,
      toasts,
      isTempId,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (!deletingRole) return;

    if (isTempId(deletingRole._id)) {
      logger.warn("Attempted to delete temporary role", {
        id: deletingRole._id,
      });
      return;
    }

    const roleToDelete = deletingRole;

    try {
      // Add optimistic update
      addOptimisticUpdate(deletingRole._id, "deleting");
      setRoles((prev) => prev.filter((role) => role._id !== deletingRole._id));
      setDeletingRole(null);

      await deleteRole(deletingRole._id);
      removeOptimisticUpdate(deletingRole._id);
      toasts.deleteSuccess("Role");

      logger.info("Role deleted successfully");
    } catch (error) {
      // Revert optimistic update
      setRoles((prev) => [...prev, roleToDelete]);
      removeOptimisticUpdate(deletingRole._id);
      setDeletingRole(roleToDelete);
      toasts.deleteError("Role");
      logger.error("Failed to delete role", error);
    }
  }, [
    deletingRole,
    deleteRole,
    setRoles,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    toasts,
    isTempId,
  ]);

  const handleEdit = useCallback((role: Role) => {
    setEditingRole(role);
  }, []);

  const handleDeleteConfirm = useCallback(
    (id: string) => {
      const role = roles.find((role) => role._id === id);
      if (role) {
        setDeletingRole(role);
      }
    },
    [roles]
  );

  // Memoized error state
  const errorState = useMemo(
    () => error || createError || updateError || deleteError,
    [error, createError, updateError, deleteError]
  );

  // Memoized table content
  const tableContent = useMemo(() => {
    if (roles.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            No roles found
          </td>
        </tr>
      );
    }

    return roles.map((role) => (
      <RoleTableRow
        key={role._id}
        role={role}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />
    ));
  }, [roles, handleEdit, handleDeleteConfirm]);

  return (
    <ComponentErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
            <p className="text-sm text-gray-600">
              Manage user roles and permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Add Role
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search roles..."
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

        {/* Roles Table with Suspense */}
        <RolesTable
          tableContent={tableContent}
          error={errorState ? new Error(errorState.message) : null}
          isLoading={isLoading}
        />

        {/* Pagination with Suspense */}
        <Suspense fallback={<div>Loading pagination...</div>}>
          <RolePagination
            meta={meta}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </Suspense>

        {/* Modals */}
        {/* Create Role Modal */}
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

        {/* Edit Role Modal */}
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

        {/* Delete Role Modal */}
        <Modal
          isOpen={!!deletingRole}
          onClose={() => setDeletingRole(null)}
          title="Delete Role">
          {deletingRole && <DeleteRoleContent roleName={deletingRole.name} />}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeletingRole(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="-ml-1 h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Role"
              )}
            </button>
          </div>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
}
