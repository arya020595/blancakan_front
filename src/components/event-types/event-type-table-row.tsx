/**
 * Event Type Table Row Component
 *
 * Follows React best practices:
 * - Memoized for performance optimization
 * - Single responsibility principle
 * - Proper TypeScript interfaces
 * - Accessibility considerations
 * - Clear prop interfaces
 *
 * @see https://react.dev/reference/react/memo
 * @see https://react.dev/learn/passing-props-to-a-component
 */

"use client";

import type { EventType } from "@/lib/api/types";
import Image from "next/image";
import React, { useCallback } from "react";

interface EventTypeTableRowProps {
  /** Event type data to display */
  eventType: EventType;
  /** Handler for edit action */
  onEdit: (eventType: EventType) => void;
  /** Handler for delete action */
  onDelete: (id: string) => void;
}

/**
 * EventTypeTableRow - Displays a single event type in table format
 *
 * Features:
 * - Optimistic UI feedback for temporary event types
 * - Icon display with fallback
 * - Sort order and slug display
 * - Proper accessibility with titles and disabled states
 * - Consistent styling with Tailwind CSS
 * - Memoized to prevent unnecessary re-renders
 */
export const EventTypeTableRow = React.memo<EventTypeTableRowProps>(
  ({ eventType, onEdit, onDelete }) => {
    // Check if this is a temporary event type (optimistic update)
    const isTempEventType = eventType._id.startsWith("temp-");

    // Memoized handlers to prevent child re-renders
    const handleEdit = useCallback(() => {
      onEdit(eventType);
    }, [eventType, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(eventType._id);
    }, [eventType._id, onDelete]);

    return (
      <tr
        className={`hover:bg-gray-50 transition-colors ${
          isTempEventType ? "opacity-70" : ""
        }`}
        role="row">
        {/* Name Column with Icon */}
        <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
          <div className="flex items-center">
            {/* Icon */}
            <div className="flex-shrink-0 h-8 w-8 mr-3">
              {eventType.icon_url ? (
                <Image
                  className="h-8 w-8 rounded object-cover"
                  src={eventType.icon_url}
                  alt={`${eventType.name} icon`}
                  width={32}
                  height={32}
                  onError={(e) => {
                    // Fallback to default icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              {/* Default icon fallback */}
              <div
                className={`h-8 w-8 rounded bg-gray-200 flex items-center justify-center ${
                  eventType.icon_url ? "hidden" : ""
                }`}>
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Name and temp indicator */}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {eventType.name}
              </div>
              {isTempEventType && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                  Saving...
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Description Column */}
        <td className="px-6 py-4" role="gridcell">
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {eventType.description || "No description"}
          </div>
        </td>

        {/* Slug Column */}
        <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
          <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {eventType.slug}
          </span>
        </td>

        {/* Sort Order Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          role="gridcell">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {eventType.sort_order}
          </span>
        </td>

        {/* Status Column */}
        <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              eventType.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            {eventType.is_active ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Created Date Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          role="gridcell">
          {new Date(eventType.created_at).toLocaleDateString()}
        </td>

        {/* Actions Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          role="gridcell">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleEdit}
              disabled={isTempEventType}
              className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                isTempEventType
                  ? "Cannot edit while saving..."
                  : "Edit event type"
              }
              aria-label={`Edit ${eventType.name}`}>
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isTempEventType}
              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                isTempEventType
                  ? "Cannot delete while saving..."
                  : "Delete event type"
              }
              aria-label={`Delete ${eventType.name}`}>
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

EventTypeTableRow.displayName = "EventTypeTableRow";
