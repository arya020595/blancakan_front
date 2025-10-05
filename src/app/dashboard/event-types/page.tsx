/**
 * Event Types Page - TanStack Query Implementation
 *
 * Following official TanStack Query pattern
 * @see docs/guides/TANSTACK_QUERY_CRUD_GUIDE.md
 */

"use client";

import { EventTypePagination } from "@/components/event-types/event-type-pagination";
import { EventTypeTableRow } from "@/components/event-types/event-type-table-row";
import { EventTypesTable } from "@/components/event-types/event-types-table";
import { DeleteEventTypeContent } from "@/components/event-types/forms/delete-event-type-content";
import { EventTypeForm } from "@/components/event-types/forms/event-type-form";
import { FormShell } from "@/components/forms/form-shell";
import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ui/error-modal";
import Modal from "@/components/ui/modal";
import {
  useCreateEventType,
  useDeleteEventType,
  useEventTypes,
  useUpdateEventType,
} from "@/hooks/event-types-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import type { EventType } from "@/lib/api/types";
import {
  eventTypeSchema,
  type EventTypeFormValues,
} from "@/lib/schemas/event-type-schema";
import { normalizeError } from "@/lib/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";

export default function EventTypesPage() {
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // TanStack Query hooks
  const { data, isLoading, error } = useEventTypes({
    page: currentPage,
    per_page: 10,
    query: searchQuery || "*",
    sort: "created_at:desc",
  });

  // Mutations
  const createMutation = useCreateEventType();
  const updateMutation = useUpdateEventType();
  const deleteMutation = useDeleteEventType();

  // Extract data
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

  const handleDeleteConfirm = (id: string) => {
    const eventType = eventTypes.find((et) => et._id === id);
    if (eventType) setDeletingEventType(eventType);
  };

  // Table content
  const tableContent =
    eventTypes.length === 0 ? (
      <tr>
        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
          No event types found
        </td>
      </tr>
    ) : (
      eventTypes.map((eventType) => (
        <EventTypeTableRow
          key={eventType._id}
          eventType={eventType}
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
          <h1 className="text-2xl font-semibold text-gray-900">Event Types</h1>
          <p className="text-sm text-gray-600">
            Manage event type categories for your events
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Add Event Type</Button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search event types..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Table */}
      <EventTypesTable
        tableContent={tableContent}
        error={error ? new Error(error.message) : null}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <Suspense fallback={<div>Loading pagination...</div>}>
        <EventTypePagination
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
            Delete Event Type
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
