/**
 * Roles Table Configuration
 *
 * Column and filter definitions for the roles data table
 */

import type { ColumnDef, FilterDef } from "@/components/ui/data-table";
import type { Role } from "@/lib/api/types";

/**
 * Column definitions for roles table
 */
export const rolesColumns: ColumnDef<Role>[] = [
  {
    key: "name",
    header: "Role Name",
    sortable: true,
    render: (role) => (
      <div>
        <div className="font-medium text-gray-900">{role.name}</div>
        <div className="text-sm text-gray-500">{role._id}</div>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (role) => (
      <span className="text-gray-900">
        {role.description || (
          <span className="text-gray-400 italic">No description</span>
        )}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (role) => (
      <div>
        <div className="text-gray-900">{new Date(role.created_at).toLocaleDateString()}</div>
        <div className="text-sm text-gray-500">
          {new Date(role.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    ),
  },
  {
    key: "updated_at",
    header: "Updated",
    sortable: true,
    render: (role) => (
      <div>
        <div className="text-gray-900">{new Date(role.updated_at).toLocaleDateString()}</div>
        <div className="text-sm text-gray-500">
          {new Date(role.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    ),
  },
];

/**
 * Filter definitions for roles table
 * Can be extended with more filters as needed
 */
export const rolesFilters: FilterDef[] = [
  // Example: Add filters when backend supports them
  // {
  //   key: 'is_active',
  //   label: 'Status',
  //   type: 'select',
  //   options: [
  //     { label: 'Active', value: 'true' },
  //     { label: 'Inactive', value: 'false' },
  //   ],
  // },
];
