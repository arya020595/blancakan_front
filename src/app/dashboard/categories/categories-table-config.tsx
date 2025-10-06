/**
 * Categories Table Configuration
 *
 * Column and filter definitions for the categories data table
 */

import type { ColumnDef, FilterDef } from "@/components/ui/data-table";
import type { Category } from "@/lib/api/types";

/**
 * Column definitions for categories table
 */
export const categoriesColumns: ColumnDef<Category>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (category) => (
      <div>
        <div className="font-medium text-gray-900">{category.name}</div>
        <div className="text-sm text-gray-500">{category._id}</div>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (category) => (
      <span className="text-gray-900">
        {category.description || (
          <span className="text-gray-400 italic">No description</span>
        )}
      </span>
    ),
  },
  {
    key: "is_active",
    header: "Status",
    sortable: true,
    render: (category) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          category.is_active
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {category.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (category) => (
      <span className="text-gray-900">
        {new Date(category.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "updated_at",
    header: "Updated",
    sortable: true,
    render: (category) => (
      <span className="text-gray-900">
        {new Date(category.updated_at).toLocaleDateString()}
      </span>
    ),
  },
];

/**
 * Filter definitions for categories table
 */
export const categoriesFilters: FilterDef[] = [
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
