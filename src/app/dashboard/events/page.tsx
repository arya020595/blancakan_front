/**
 * Events Page - DataTable Implementation
 *
 * Refactored using reusable DataTable component with URL-based state management
 * Features: Search, sort, filter, pagination with shareable URLs
 */

"use client";

import { useOptimisticToasts } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import ErrorModal from "@/components/ui/error-modal";
import { Icons } from "@/components/ui/icons";
import Modal from "@/components/ui/modal";
import Spinner from "@/components/ui/spinner";
import {
    useCancelEvent,
    useCreateEvent,
    useDeleteEvent,
    useEvents,
    usePublishEvent,
    useUpdateEvent,
} from "@/hooks/events-hooks";
import { useErrorModal } from "@/hooks/use-error-modal";
import { useTableParams } from "@/hooks/use-table-params";
import type { Event } from "@/lib/api/types";
import { normalizeError } from "@/lib/utils/error-utils";
import { useEffect, useState } from "react";
import { eventsColumns, eventsFilters } from "./events-table-config";

export default function EventsPage() {
  // URL-based state management (search, sort, filters, pagination)
  const { params } = useTableParams();

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [publishingEvent, setPublishingEvent] = useState<Event | null>(null);
  const [cancelingEvent, setCancelingEvent] = useState<Event | null>(null);

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
  const { data, isLoading, error } = useEvents({
    page: params.page,
    per_page: params.per_page,
    query: params.query || "*",
    sort: params.sort || "created_at:desc",
    filters: params.filter,
  });

  // Mutations - TanStack Query handles cache invalidation automatically
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const publishMutation = usePublishEvent();
  const cancelMutation = useCancelEvent();

  // Extract data from React Query response
  const events = data?.data ?? [];
  const meta = data?.meta ?? null;

  // Handle create mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowCreateModal(false);
      toasts.createSuccess("Event");
      createMutation.reset();
    }
    if (createMutation.isError) {
      showError(
        normalizeError(createMutation.error, "Failed to create event")
      );
      createMutation.reset();
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  // Handle update mutation success/error
  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingEvent(null);
      toasts.updateSuccess("Event");
      updateMutation.reset();
    }
    if (updateMutation.isError) {
      showError(
        normalizeError(updateMutation.error, "Failed to update event")
      );
      updateMutation.reset();
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  // Handle delete mutation success/error
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setDeletingEvent(null);
      toasts.deleteSuccess("Event");
      deleteMutation.reset();
    }
    if (deleteMutation.isError) {
      showError(
        normalizeError(deleteMutation.error, "Failed to delete event")
      );
      deleteMutation.reset();
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  // Handle publish mutation success/error
  useEffect(() => {
    if (publishMutation.isSuccess) {
      setPublishingEvent(null);
      toasts.updateSuccess("Event published");
      publishMutation.reset();
    }
    if (publishMutation.isError) {
      showError(
        normalizeError(publishMutation.error, "Failed to publish event")
      );
      publishMutation.reset();
    }
  }, [publishMutation.isSuccess, publishMutation.isError]);

  // Handle cancel mutation success/error
  useEffect(() => {
    if (cancelMutation.isSuccess) {
      setCancelingEvent(null);
      toasts.updateSuccess("Event canceled");
      cancelMutation.reset();
    }
    if (cancelMutation.isError) {
      showError(
        normalizeError(cancelMutation.error, "Failed to cancel event")
      );
      cancelMutation.reset();
    }
  }, [cancelMutation.isSuccess, cancelMutation.isError]);

  // Handlers
  const handleDelete = () => {
    if (!deletingEvent) return;
    deleteMutation.mutate(deletingEvent._id);
  };

  const handlePublish = () => {
    if (!publishingEvent) return;
    publishMutation.mutate(publishingEvent._id);
  };

  const handleCancel = () => {
    if (!cancelingEvent) return;
    cancelMutation.mutate(cancelingEvent._id);
  };

  const handleEdit = (event: Event) => {
    // For now, just show a message - full edit form would be complex
    alert("Edit functionality coming soon! This requires a comprehensive form with date/time pickers, location fields, category selection, and image upload.");
  };

  const handleDeleteConfirm = (event: Event) => setDeletingEvent(event);
  const handlePublishConfirm = (event: Event) => setPublishingEvent(event);
  const handleCancelConfirm = (event: Event) => setCancelingEvent(event);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="text-sm text-gray-600">
            Manage your events and their details
          </p>
        </div>
        <Button onClick={() => alert("Create event form coming soon!")}>
          <Icons.add size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      {/* DataTable - Handles search, sort, filter, pagination */}
      <DataTable
        columns={eventsColumns}
        data={events}
        meta={meta}
        isLoading={isLoading}
        error={error ? new Error(error.message) : null}
        searchable
        searchPlaceholder="Search events..."
        filters={eventsFilters}
        resourceName="event"
        actions={(event) => (
          <div className="flex items-center justify-end gap-2">
            {event.status === "draft" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePublishConfirm(event)}
                className="h-8 px-2"
                title="Publish Event">
                <Icons.upload size={16} className="text-gray-600 hover:text-green-600" />
              </Button>
            )}
            {event.status === "published" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancelConfirm(event)}
                className="h-8 px-2"
                title="Cancel Event">
                <Icons.close size={16} className="text-gray-600 hover:text-orange-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(event)}
              className="h-8 px-2"
              title="Edit Event">
              <Icons.edit size={16} className="text-gray-600 hover:text-indigo-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConfirm(event)}
              className="h-8 px-2"
              title="Delete Event">
              <Icons.delete size={16} className="text-gray-600 hover:text-red-600" />
            </Button>
          </div>
        )}
      />

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={!!publishingEvent}
        onClose={() => setPublishingEvent(null)}
        title="Publish Event">
        {publishingEvent && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to publish <strong>{publishingEvent.title}</strong>?
              This will make the event visible to the public.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setPublishingEvent(null)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            className="bg-green-600 hover:bg-green-700">
            {publishMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner
                  size={16}
                  className="-ml-1 text-white"
                  ariaLabel="Publishing"
                />
                Publishing...
              </span>
            ) : (
              "Publish Event"
            )}
          </Button>
        </div>
      </Modal>

      {/* Cancel Event Modal */}
      <Modal
        isOpen={!!cancelingEvent}
        onClose={() => setCancelingEvent(null)}
        title="Cancel Event">
        {cancelingEvent && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to cancel <strong>{cancelingEvent.title}</strong>?
              This action cannot be undone.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setCancelingEvent(null)}>
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner
                  size={16}
                  className="-ml-1 text-white"
                  ariaLabel="Canceling"
                />
                Canceling...
              </span>
            ) : (
              "Cancel Event"
            )}
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        title="Delete Event">
        {deletingEvent && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{deletingEvent.title}</strong>?
              This action cannot be undone.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setDeletingEvent(null)}>
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
              "Delete Event"
            )}
          </Button>
        </div>
      </Modal>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={modalError}
        title="Error"
      />
    </div>
  );
}
