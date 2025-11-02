/**
 * Permissions Page - DataTable Implementation
 *
 * Refactored using reusable DataTable component with URL-based state management
 * Features: Search, sort, filter, pagination with shareable URLs
 *
 * Following the pattern from roles page
 */

"use client";

import { FormShell } from "@/components/forms/form-shell";
import { DeletePermissionContent } from "@/components/permissions/forms/delete-permission-content";
import { PermissionForm } from "@/components/permissions/forms/permission-form";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import ErrorModal from "@/components/ui/error-modal";
import { Icons } from "@/components/ui/icons";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import {
    useCreatePermission,
    useDeletePermission,
    usePermissions,
    useUpdatePermission,
} from "@/hooks/permissions-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import { useTableParams } from "@/hooks/use-table-params";
import type { Permission } from "@/lib/api/types";
import {
    permissionSchema,
    type PermissionFormValues,
} from "@/lib/schemas/permission-schema";
import { normalizeError } from "@/lib/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
    permissionsColumns,
    permissionsFilters,
} from "./permissions-table-config";

export default function PermissionsPage() {
  // URL-based state management (search, sort, filters, pagination)
  const { params } = useTableParams();

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [deletingPermission, setDeletingPermission] =
    useState<Permission | null>(null);

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
  const { data, isLoading, error } = usePermissions({
    page: params.page,
    per_page: params.per_page,
    query: params.query || "*",
    sort: params.sort || "created_at:desc",
    filter: params.filter,
  });

  // Mutations - TanStack Query handles cache invalidation automatically
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  // Extract data from React Query response
  const permissions = data?.data ?? [];
  const meta = data?.meta ?? null;

  // Handle create mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowCreateModal(false);
      toasts.createSuccess("Permission");
      createMutation.reset();
    }
    if (createMutation.isError) {
      showError(
        normalizeError(createMutation.error, "Failed to create permission")
      );
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  // Handle update mutation success/error
  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingPermission(null);
      toasts.updateSuccess("Permission");
      updateMutation.reset();
    }
    if (updateMutation.isError) {
      showError(
        normalizeError(updateMutation.error, "Failed to update permission")
      );
      updateMutation.reset();
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  // Handle delete mutation success/error
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setDeletingPermission(null);
      toasts.deleteSuccess("Permission");
      deleteMutation.reset();
    }
    if (deleteMutation.isError) {
      showError(
        normalizeError(deleteMutation.error, "Failed to delete permission")
      );
      deleteMutation.reset();
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  // Handlers - Simplified with mutation callbacks!
  const handleCreate = (formData: PermissionFormValues) => {
    // Parse conditions if it's a string
    let parsedConditions: Record<string, any> = {};
    if (formData.conditions) {
      try {
        parsedConditions = JSON.parse(formData.conditions);
      } catch (e) {
        parsedConditions = {};
      }
    }

    createMutation.mutate({
      permission: {
        action: formData.action,
        subject_class: formData.subject_class,
        conditions: parsedConditions,
        role_id: formData.role_id,
      },
    });
  };

  const handleUpdate = (formData: PermissionFormValues) => {
    if (!editingPermission) return;

    // Parse conditions if it's a string
    let parsedConditions: Record<string, any> = {};
    if (formData.conditions) {
      try {
        parsedConditions = JSON.parse(formData.conditions);
      } catch (e) {
        parsedConditions = {};
      }
    }

    updateMutation.mutate({
      id: editingPermission._id,
      data: {
        permission: {
          action: formData.action,
          subject_class: formData.subject_class,
          conditions: parsedConditions,
          role_id: formData.role_id,
        },
      },
    });
  };

  const handleDelete = () => {
    if (!deletingPermission) return;
    deleteMutation.mutate(deletingPermission._id);
  };

  const handleEdit = (permission: Permission) =>
    setEditingPermission(permission);

  const handleDeleteConfirm = (permission: Permission) =>
    setDeletingPermission(permission);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Permissions</h1>
          <p className="text-sm text-gray-600">
            Manage role permissions and access control
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Icons.add size={16} className="mr-2" />
          Add Permission
        </Button>
      </div>

      {/* DataTable - Handles search, sort, filter, pagination */}
      <DataTable
        columns={permissionsColumns}
        data={permissions}
        meta={meta}
        isLoading={isLoading}
        error={error ? new Error(error.message) : null}
        searchable
        searchPlaceholder="Search permissions..."
        filters={permissionsFilters}
        resourceName="permission"
        actions={(permission) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(permission)}
              className="h-8 px-2">
              <Icons.edit
                size={16}
                className="text-gray-600 hover:text-indigo-600"
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConfirm(permission)}
              className="h-8 px-2">
              <Icons.delete
                size={16}
                className="text-gray-600 hover:text-red-600"
              />
            </Button>
          </div>
        )}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Permission">
        <FormShell<PermissionFormValues>
          defaultValues={{
            action: "",
            subject_class: "",
            conditions: "",
            role_id: "",
          }}
          resolver={zodResolver(permissionSchema)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Permission"
          onCancel={() => setShowCreateModal(false)}>
          <PermissionForm
            mode="create"
            isSubmitting={createMutation.isPending}
          />
        </FormShell>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPermission}
        onClose={() => setEditingPermission(null)}
        title="Edit Permission">
        <FormShell<PermissionFormValues>
          defaultValues={{
            action: editingPermission?.action || "",
            subject_class: editingPermission?.subject_class || "",
            conditions: editingPermission?.conditions
              ? JSON.stringify(editingPermission.conditions, null, 2)
              : "",
            role_id: editingPermission?.role_id || "",
          }}
          resolver={zodResolver(permissionSchema)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
          submitLabel="Update Permission"
          onCancel={() => setEditingPermission(null)}>
          <PermissionForm
            mode="edit"
            isSubmitting={updateMutation.isPending}
          />
        </FormShell>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingPermission}
        onClose={() => setDeletingPermission(null)}
        title="Delete Permission">
        {deletingPermission && (
          <DeletePermissionContent
            permissionAction={deletingPermission.action}
            permissionSubject={deletingPermission.subject_class}
          />
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setDeletingPermission(null)}>
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
              "Delete Permission"
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
