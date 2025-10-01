/**
 * Event Types Page with Enterprise Component Architecture
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
import { EventTypePagination } from "@/components/event-types/event-type-pagination";
import { EventTypeTableRow } from "@/components/event-types/event-type-table-row";
import { EventTypesTable } from "@/components/event-types/event-types-table";
import { DeleteEventTypeContent } from "@/components/event-types/forms/delete-event-type-content";
import {
  EventTypeForm,
  type EventTypeFormValues,
} from "@/components/event-types/forms/event-type-form";
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
import type {
  CreateEventTypeRequest,
  EventType,
  UpdateEventTypeRequest,
} from "@/lib/api/types";
import { normalizeError } from "@/lib/utils/error-utils";
import { createLogger } from "@/lib/utils/logger";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

const logger = createLogger("EVENT_TYPES PAGE");

// Main component
export default function EventTypesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventType | null>(
    null
  );
  const [deletingEventType, setDeletingEventType] = useState<EventType | null>(null);

  // Enhanced toast system
  const toasts = useOptimisticToasts();

  // Error modal hook
  const { error: modalError, isErrorModalOpen, showError, closeError } = useErrorModal();

  // Hooks
  const {
    eventTypes,
    meta,
    isLoading,
    error,
    fetchEventTypes,
    addEventTypeOptimistic,
    updateEventTypeOptimistic,
    removeEventTypeOptimistic,
    replaceTempEventTypeOptimistic,
  } = useEventTypes();

  const {
    createEventType,
    isLoading: isCreating,
    clearError: clearCreateError,
  } = useCreateEventType();

  const {
    updateEventType,
    isLoading: isUpdating,
    clearError: clearUpdateError,
  } = useUpdateEventType();

  const {
    deleteEventType,
    isLoading: isDeleting,
    clearError: clearDeleteError,
  } = useDeleteEventType();

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

  // Load event types when params change
  useEffect(() => {
    logger.info("Loading event types page", fetchParams);
    fetchEventTypes(fetchParams);
  }, [fetchEventTypes, fetchParams]);

  // Memoized handlers
  const handleCreate = useCallback(
    async (data: EventTypeFormValues) => {
      const eventTypeData: CreateEventTypeRequest = {
        event_type: {
          name: data.name,
          description: (data.description || "").trim(),
          icon_url: (data.icon_url || "").trim(),
          sort_order: data.sort_order,
          is_active: data.is_active,
        },
      };

      const tempId = `temp-${Date.now()}`;
      const optimisticEventType: EventType = {
        _id: tempId,
        name: eventTypeData.event_type.name,
        description: eventTypeData.event_type.description,
        icon_url: eventTypeData.event_type.icon_url,
        is_active: eventTypeData.event_type.is_active,
        slug: eventTypeData.event_type.name.toLowerCase().replace(/\s+/g, "-"),
        sort_order: eventTypeData.event_type.sort_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        addEventTypeOptimistic(optimisticEventType);
        setShowCreateModal(false);

        const response = await createEventType(eventTypeData);
        replaceTempEventTypeOptimistic(tempId, response);
        toasts.createSuccess("Event Type");

        logger.info("Event type created successfully");
      } catch (error) {
        removeEventTypeOptimistic(tempId);
        setShowCreateModal(false); // Close form modal on error
        
        // Show detailed validation errors in modal
        const validationError = normalizeError(error, "Failed to create event type");
        showError(validationError);
        // Clear hook error to prevent table hiding
        clearCreateError();
        logger.error("Failed to create event type", error);
      }
    },
    [
      createEventType,
      addEventTypeOptimistic,
      replaceTempEventTypeOptimistic,
      removeEventTypeOptimistic,
      toasts,
      showError,
      clearCreateError,
    ]
  );

  const handleUpdate = useCallback(
    async (data: EventTypeFormValues) => {
      if (!editingEventType) return;

      if (isTempId(editingEventType._id)) {
        logger.warn("Attempted to edit temporary event type", {
          id: editingEventType._id,
        });
        setEditingEventType(null);
        return;
      }

      const eventTypeData: UpdateEventTypeRequest = {
        event_type: {
          name: data.name,
          description: (data.description || "").trim(),
          icon_url: (data.icon_url || "").trim(),
          sort_order: data.sort_order,
          is_active: data.is_active,
        },
      };

      const optimisticEventType: EventType = {
        ...editingEventType,
        name: eventTypeData.event_type.name,
        description: eventTypeData.event_type.description,
        icon_url: eventTypeData.event_type.icon_url,
        sort_order: eventTypeData.event_type.sort_order,
        is_active: eventTypeData.event_type.is_active,
        updated_at: new Date().toISOString(),
      };

      const originalEventType = editingEventType;

      try {
        updateEventTypeOptimistic(optimisticEventType);
        setEditingEventType(null);

        const response = await updateEventType(
          editingEventType._id,
          eventTypeData
        );
        updateEventTypeOptimistic(response);
        toasts.updateSuccess("Event Type");

        logger.info("Event type updated successfully");
      } catch (error) {
        updateEventTypeOptimistic(originalEventType);
        setEditingEventType(null); // Close edit modal on error
        
        // Show detailed validation errors in modal
        const validationError = normalizeError(error, "Failed to update event type");
        showError(validationError);
        // Clear hook error to prevent table hiding
        clearUpdateError();
        logger.error("Failed to update event type", error);
      }
    },
    [
      editingEventType,
      updateEventType,
      updateEventTypeOptimistic,
      toasts,
      isTempId,
      showError,
      clearUpdateError,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (!deletingEventType) return;

    if (isTempId(deletingEventType._id)) {
      logger.warn("Attempted to delete temporary event type", {
        id: deletingEventType._id,
      });
      return;
    }

    const eventTypeToDelete = deletingEventType;

    try {
      removeEventTypeOptimistic(deletingEventType._id);
      setDeletingEventType(null);

      await deleteEventType(deletingEventType._id);
      toasts.deleteSuccess("Event Type");

      logger.info("Event type deleted successfully");
    } catch (error) {
      addEventTypeOptimistic(eventTypeToDelete);
      setDeletingEventType(null); // Close delete modal on error
      
      // Show detailed validation errors in modal
      const validationError = normalizeError(error, "Failed to delete event type");
      showError(validationError);
      // Clear hook error to prevent table hiding
      clearDeleteError();
      logger.error("Failed to delete event type", error);
    }
  }, [
    deletingEventType,
    deleteEventType,
    removeEventTypeOptimistic,
    addEventTypeOptimistic,
    toasts,
    showError,
    clearDeleteError,
    isTempId,
  ]);

  const handleEdit = useCallback((eventType: EventType) => {
    setEditingEventType(eventType);
  }, []);

  const handleDeleteConfirm = useCallback(
    (id: string) => {
      const eventType = eventTypes.find((eventType) => eventType._id === id);
      if (eventType) {
        setDeletingEventType(eventType);
      }
    },
    [eventTypes]
  );

  // Memoized error state (only fetch errors should affect table display)
  const errorState = useMemo(
    () => error, // Only use fetch error since mutation errors are handled by modal
    [error]
  );

  // Memoized table content
  const tableContent = useMemo(() => {
    if (eventTypes.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
            No event types found
          </td>
        </tr>
      );
    }

    return eventTypes.map((eventType) => (
      <EventTypeTableRow
        key={eventType._id}
        eventType={eventType}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />
    ));
  }, [eventTypes, handleEdit, handleDeleteConfirm]);

  return (
    <ComponentErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Event Types</h1>
            <p className="text-sm text-gray-600">
              Manage event type categories for your events. Configure icons, display order, and availability.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>Add Event Type</Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search event types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Event Types Table with Suspense */}
        <EventTypesTable
          tableContent={tableContent}
          error={errorState ? new Error(errorState.message) : null}
          isLoading={isLoading}
        />

        {/* Pagination with Suspense */}
        <Suspense fallback={<div>Loading pagination...</div>}>
          <EventTypePagination
            meta={meta}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </Suspense>

        {/* Modals */}
        {/* Create Event Type Modal */}
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
            onSubmit={handleCreate}
            isSubmitting={isCreating}
            submitLabel="Create Event Type"
            onCancel={() => setShowCreateModal(false)}>
            <EventTypeForm mode="create" isSubmitting={isCreating} />
          </FormShell>
        </Modal>

        {/* Edit Event Type Modal */}
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
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
            submitLabel="Update Event Type"
            onCancel={() => setEditingEventType(null)}>
            <EventTypeForm mode="edit" isSubmitting={isUpdating} />
          </FormShell>
        </Modal>

        {/* Delete Event Type Modal */}
        <Modal
          isOpen={!!deletingEventType}
          onClose={() => setDeletingEventType(null)}
          title="Delete Event Type">
          {deletingEventType && (
            <DeleteEventTypeContent eventTypeName={deletingEventType.name} />
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingEventType(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}>
              Delete Event Type
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
    </ComponentErrorBoundary>
  );
}