/**
 * Event Types Page - DataTable Implementation
 *
 * Refactored using reusable DataTable component with URL-based state management
 * Features: Search, sort, filter, pagination with shareable URLs
 */

"use client";

import { DeleteEventTypeContent } from "@/components/event-types/forms/delete-event-type-content";
import { EventTypeForm } from "@/components/event-types/forms/event-type-form";
import { FormShell } from "@/components/forms/form-shell";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import ErrorModal from "@/components/ui/error-modal";
import { Icons } from "@/components/ui/icons";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import {
  useCreateEventType,
  useDeleteEventType,
  useEventTypes,
  useUpdateEventType,
} from "@/hooks/event-types-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import { useTableParams } from "@/hooks/use-table-params";
import type { EventType } from "@/lib/api/types";
import {
  eventTypeSchema,
  type EventTypeFormValues,
} from "@/lib/schemas/event-type-schema";
import { normalizeError } from "@/lib/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  eventTypesColumns,
  eventTypesFilters,
} from "./event-types-table-config";

export default function EventTypesPage() {
  // URL-based state management (search, sort, filters, pagination)
  const { params } = useTableParams();

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventType | null>(
    null
  );
  const [deletingEventType, setDeletingEventType] = useState<EventType | null>(
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
  const { data, isLoading, error } = useEventTypes({
    page: params.page,
    per_page: params.per_page,
    query: params.query || "*",
    sort: params.sort || "created_at:desc",
    filters: params.filter,
  });

  // Mutations - TanStack Query handles cache invalidation automatically
  const createMutation = useCreateEventType();
  const updateMutation = useUpdateEventType();
  const deleteMutation = useDeleteEventType();

  // Extract data from React Query response
  const eventTypes = data?.data ?? [];
  const meta = data?.meta ?? null;

  // Handle create mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowCreateModal(false);
      toasts.createSuccess("Event Type");
      createMutation.reset();
    }
    if (createMutation.isError) {
      showError(
        normalizeError(createMutation.error, "Failed to create event type")
      );
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  // Handle update mutation success/error
  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingEventType(null);
      toasts.updateSuccess("Event Type");
      updateMutation.reset();
    }
    if (updateMutation.isError) {
      showError(
        normalizeError(updateMutation.error, "Failed to update event type")
      );
      updateMutation.reset();
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  // Handle delete mutation success/error
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setDeletingEventType(null);
      toasts.deleteSuccess("Event Type");
      deleteMutation.reset();
    }
    if (deleteMutation.isError) {
      showError(
        normalizeError(deleteMutation.error, "Failed to delete event type")
      );
      deleteMutation.reset();
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  // Handlers - Simple, no async/await
  const handleCreate = (formData: EventTypeFormValues) => {
    createMutation.mutate({
      event_type: {
        name: formData.name,
        description: formData.description?.trim() || "",
        icon_url: formData.icon_url?.trim() || "",
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      },
    });
  };

  const handleUpdate = (formData: EventTypeFormValues) => {
    if (!editingEventType) return;

    updateMutation.mutate({
      id: editingEventType._id,
      data: {
        event_type: {
          name: formData.name,
          description: formData.description?.trim() || "",
          icon_url: formData.icon_url?.trim() || "",
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        },
      },
    });
  };

  const handleDelete = () => {
    if (!deletingEventType) return;
    deleteMutation.mutate(deletingEventType._id);
  };

  const handleEdit = (eventType: EventType) => setEditingEventType(eventType);

  const handleDeleteConfirm = (eventType: EventType) =>
    setDeletingEventType(eventType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Event Types</h1>
          <p className="text-sm text-gray-600">
            Manage event type categories for your events
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Icons.add size={16} className="mr-2" />
          Add Event Type
        </Button>
      </div>

      {/* DataTable - Handles search, sort, filter, pagination */}
      <DataTable
        columns={eventTypesColumns}
        data={eventTypes}
        meta={meta}
        isLoading={isLoading}
        error={error ? new Error(error.message) : null}
        searchable
        searchPlaceholder="Search event types..."
        filters={eventTypesFilters}
        resourceName="event type"
        actions={(eventType) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(eventType)}
              className="h-8 px-2">
              <Icons.edit size={16} className="text-gray-600 hover:text-indigo-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConfirm(eventType)}
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
        title="Create New Event Type">
        <FormShell<EventTypeFormValues>
          defaultValues={{
            name: "",
            description: "",
            icon_url: "",
            sort_order: 0,
            is_active: true,
          }}
          resolver={zodResolver(eventTypeSchema)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Event Type"
          onCancel={() => setShowCreateModal(false)}>
          <EventTypeForm
            mode="create"
            isSubmitting={createMutation.isPending}
          />
        </FormShell>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingEventType}
        onClose={() => setEditingEventType(null)}
        title="Edit Event Type">
        <FormShell<EventTypeFormValues>
          defaultValues={{
            name: editingEventType?.name || "",
            description: editingEventType?.description || "",
            icon_url: editingEventType?.icon_url || "",
            sort_order: editingEventType?.sort_order || 0,
            is_active: editingEventType?.is_active ?? true,
          }}
          resolver={zodResolver(eventTypeSchema)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
          submitLabel="Update Event Type"
          onCancel={() => setEditingEventType(null)}>
          <EventTypeForm mode="edit" isSubmitting={updateMutation.isPending} />
        </FormShell>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingEventType}
        onClose={() => setDeletingEventType(null)}
        title="Delete Event Type">
        {deletingEventType && (
          <DeleteEventTypeContent eventTypeName={deletingEventType.name} />
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletingEventType(null)}>
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
              "Delete Event Type"
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
