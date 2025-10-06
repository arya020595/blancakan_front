/**
 * Event Types Table Configuration
 *
 * Column and filter definitions for the event types data table
 */

import type { ColumnDef, FilterDef } from "@/components/ui/data-table";
import type { EventType } from "@/lib/api/types";

/**
 * Column definitions for event types table
 */
export const eventTypesColumns: ColumnDef<EventType>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (eventType) => (
      <div>
        <div className="font-medium text-gray-900">{eventType.name}</div>
        <div className="text-sm text-gray-500">{eventType.slug}</div>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (eventType) => (
      <span className="text-gray-900">
        {eventType.description || (
          <span className="text-gray-400 italic">No description</span>
        )}
      </span>
    ),
  },
  {
    key: "icon_url",
    header: "Icon",
    render: (eventType) => (
      <div className="flex items-center">
        {eventType.icon_url ? (
          <img
            src={eventType.icon_url}
            alt={eventType.name}
            className="h-6 w-6 rounded"
          />
        ) : (
          <span className="text-gray-400 text-xs">No icon</span>
        )}
      </div>
    ),
  },
  {
    key: "sort_order",
    header: "Order",
    sortable: true,
    render: (eventType) => (
      <span className="text-gray-900">{eventType.sort_order}</span>
    ),
  },
  {
    key: "is_active",
    header: "Status",
    sortable: true,
    render: (eventType) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          eventType.is_active
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {eventType.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (eventType) => (
      <span className="text-gray-900">
        {new Date(eventType.created_at).toLocaleDateString()}
      </span>
    ),
  },
];

/**
 * Filter definitions for event types table
 */
export const eventTypesFilters: FilterDef[] = [
  {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];
