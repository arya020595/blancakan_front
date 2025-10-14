/**
 * Events Table Configuration
 *
 * Column and filter definitions for the events data table
 */

import type { ColumnDef, FilterDef } from "@/components/ui/data-table";
import type { Event } from "@/lib/api/types";
import { DateTime } from "luxon";

/**
 * Column definitions for events table
 */
export const eventsColumns: ColumnDef<Event>[] = [
  {
    key: "title",
    header: "Event Title",
    sortable: true,
    render: (event) => (
      <div>
        <div className="font-medium text-gray-900">{event.title}</div>
        <div className="text-sm text-gray-500">{event.slug}</div>
      </div>
    ),
  },
  {
    key: "starts_at_local",
    header: "Start Date",
    sortable: true,
    render: (event) => {
      // Parse as UTC and format with same style as toLocaleTimeString
      const dt = DateTime.fromISO(event.starts_at_local, { zone: 'utc' });
      return (
        <div>
          <div className="text-gray-900">{dt.toFormat('M/d/yyyy')}</div>
          <div className="text-sm text-gray-500">
            {dt.toFormat('h:mm a')}
          </div>
        </div>
      );
    },
  },
  {
    key: "location_type",
    header: "Location",
    sortable: true,
    render: (event) => (
      <div>
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            event.location_type === "online"
              ? "bg-blue-100 text-blue-800"
              : event.location_type === "offline"
              ? "bg-green-100 text-green-800"
              : "bg-purple-100 text-purple-800"
          }`}>
          {event.location_type.charAt(0).toUpperCase() +
            event.location_type.slice(1)}
        </span>
        {/* Show platform for online events */}
        {(event.location_type === "online" ||
          event.location_type === "hybrid") &&
          event.location?.platform && (
            <div className="text-sm text-gray-500 mt-1">
              {event.location.platform}
            </div>
          )}
        {/* Show city for offline events */}
        {(event.location_type === "offline" ||
          event.location_type === "hybrid") &&
          event.location?.city && (
            <div className="text-xs text-gray-400">{event.location.city}</div>
          )}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (event) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          event.status === "published"
            ? "bg-green-100 text-green-800"
            : event.status === "draft"
            ? "bg-gray-100 text-gray-800"
            : "bg-red-100 text-red-800"
        }`}>
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </span>
    ),
  },
  {
    key: "is_paid",
    header: "Type",
    sortable: true,
    render: (event) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          event.is_paid
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}>
        {event.is_paid ? "Paid" : "Free"}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (event) => {
      const createdAt = new Date(event.created_at);
      return (
        <div>
          <div className="text-gray-900">{createdAt.toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">
            {createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    key: "updated_at",
    header: "Updated At",
    sortable: true,
    render: (event) => {
      const updatedAt = new Date(event.updated_at);
      return (
        <div>
          <div className="text-gray-900">{updatedAt.toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">
            {updatedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
];

/**
 * Filter definitions for events table
 */
export const eventsFilters: FilterDef[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Canceled", value: "canceled" },
    ],
  },
  {
    key: "location_type",
    label: "Location Type",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Online", value: "online" },
      { label: "Offline", value: "offline" },
      { label: "Hybrid", value: "hybrid" },
    ],
  },
  {
    key: "is_paid",
    label: "Event Type",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Free", value: "false" },
      { label: "Paid", value: "true" },
    ],
  },
];
