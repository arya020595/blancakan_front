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
import {
  CreateEventTypeModal,
  DeleteConfirmModal,
  EditEventTypeModal,
} from "@/components/event-types/event-type-modals";
import { EventTypePagination } from "@/components/event-types/event-type-pagination";
import { EventTypeTableRow } from "@/components/event-types/event-type-table-row";
import { EventTypesTable } from "@/components/event-types/event-types-table";
import { CategoryTableSkeleton } from "@/components/loading/skeleton";
import { useOptimisticToasts } from "@/components/toast";
import {
  useCreateEventType,
  useDeleteEventType,
  useEventTypes,
  useUpdateEventType,
} from "@/hooks/event-types-hooks";
import type {
  CreateEventTypeRequest,
  EventType,
  UpdateEventTypeRequest,
} from "@/lib/api/types";
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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Enhanced toast system
  const toasts = useOptimisticToasts();

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
    error: createError,
  } = useCreateEventType();

  const {
    updateEventType,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateEventType();

  const {
    deleteEventType,
    isLoading: isDeleting,
    error: deleteError,
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
    async (formData: FormData) => {
      const eventTypeData: CreateEventTypeRequest = {
        event_type: {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          icon_url: formData.get("icon_url") as string,
          sort_order: parseInt(formData.get("sort_order") as string, 10),
          is_active: formData.get("is_active") === "on",
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
        setShowCreateModal(true);
        toasts.createError("Event Type");
        logger.error("Failed to create event type", error);
      }
    },
    [
      createEventType,
      addEventTypeOptimistic,
      replaceTempEventTypeOptimistic,
      removeEventTypeOptimistic,
      toasts,
    ]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
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
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          icon_url: formData.get("icon_url") as string,
          sort_order: parseInt(formData.get("sort_order") as string, 10),
          is_active: formData.get("is_active") === "on",
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
        setEditingEventType(originalEventType);
        toasts.updateError("Event Type");
        logger.error("Failed to update event type", error);
      }
    },
    [
      editingEventType,
      updateEventType,
      updateEventTypeOptimistic,
      toasts,
      isTempId,
    ]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (isTempId(id)) {
        logger.warn("Attempted to delete temporary event type", { id });
        return;
      }

      const eventTypeToDelete = eventTypes.find((et) => et._id === id);
      if (!eventTypeToDelete) return;

      try {
        removeEventTypeOptimistic(id);
        setDeleteConfirm(null);

        await deleteEventType(id);
        toasts.deleteSuccess("Event Type");

        logger.info("Event type deleted successfully");
      } catch (error) {
        addEventTypeOptimistic(eventTypeToDelete);
        setDeleteConfirm(id);
        toasts.deleteError("Event Type");
        logger.error("Failed to delete event type", error);
      }
    },
    [
      eventTypes,
      deleteEventType,
      removeEventTypeOptimistic,
      addEventTypeOptimistic,
      toasts,
      isTempId,
    ]
  );

  const handleEdit = useCallback((eventType: EventType) => {
    setEditingEventType(eventType);
  }, []);

  const handleDeleteConfirm = useCallback((id: string) => {
    setDeleteConfirm(id);
  }, []);

  // Memoized error state
  const errorState = useMemo(
    () => error || createError || updateError || deleteError,
    [error, createError, updateError, deleteError]
  );

  // Memoized table content
  const tableContent = useMemo(() => {
    if (isLoading) {
      return <CategoryTableSkeleton rows={5} />;
    }

    if (eventTypes.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-12 text-center">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No event types found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first event type."}
              </p>
            </div>
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
  }, [isLoading, eventTypes, handleEdit, handleDeleteConfirm, searchQuery]);

  return (
    <ComponentErrorBoundary>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Event Types
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage event type categories for your events. Configure icons,
              display order, and availability.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Event Type
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search event types..."
              />
            </div>
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
                  Error loading event types
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorState.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Types Table */}
        <Suspense fallback={<CategoryTableSkeleton rows={10} />}>
          <EventTypesTable
            tableContent={tableContent}
            isLoading={isLoading}
            error={errorState ? new Error(errorState.message) : null}
          />
        </Suspense>

        {/* Pagination */}
        {meta && (
          <EventTypePagination
            meta={meta}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}

        {/* Modals */}
        <CreateEventTypeModal
          isOpen={showCreateModal}
          isCreating={isCreating}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />

        <EditEventTypeModal
          isOpen={!!editingEventType}
          eventType={editingEventType}
          isUpdating={isUpdating}
          onClose={() => setEditingEventType(null)}
          onSubmit={handleUpdate}
        />

        <DeleteConfirmModal
          isOpen={!!deleteConfirm}
          eventTypeName={
            deleteConfirm
              ? eventTypes.find((et) => et._id === deleteConfirm)?.name
              : undefined
          }
          isDeleting={isDeleting}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        />
      </div>
    </ComponentErrorBoundary>
  );
}
