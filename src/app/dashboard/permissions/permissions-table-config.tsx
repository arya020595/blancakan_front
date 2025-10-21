/**
 * Permissions Table Configuration
 *
 * Column and filter definitions for the permissions data table
 */

import type { ColumnDef, FilterDef } from "@/components/ui/data-table";
import type { Permission } from "@/lib/api/types";

/**
 * Column definitions for permissions table
 */
export const permissionsColumns: ColumnDef<Permission>[] = [
  {
    key: "action",
    header: "Action",
    sortable: true,
    render: (permission) => (
      <div>
        <div className="font-medium text-gray-900 capitalize">
          {permission.action}
        </div>
        <div className="text-sm text-gray-500">{permission._id}</div>
      </div>
    ),
  },
  {
    key: "subject_class",
    header: "Subject Class",
    sortable: true,
    render: (permission) => (
      <span className="text-gray-900 font-medium">
        {permission.subject_class}
      </span>
    ),
  },
  {
    key: "role_id",
    header: "Role ID",
    render: (permission) => (
      <span className="text-sm text-gray-600 font-mono">
        {permission.role_id}
      </span>
    ),
  },
  {
    key: "conditions",
    header: "Conditions",
    render: (permission) => {
      const hasConditions =
        permission.conditions &&
        Object.keys(permission.conditions).length > 0;

      return hasConditions ? (
        <div className="max-w-xs">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto">
            {JSON.stringify(permission.conditions, null, 2)}
          </code>
        </div>
      ) : (
        <span className="text-gray-400 italic text-sm">No conditions</span>
      );
    },
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (permission) => (
      <div>
        <div className="text-gray-900">
          {new Date(permission.created_at).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(permission.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    ),
  },
];

/**
 * Filter definitions for permissions table
 */
export const permissionsFilters: FilterDef[] = [
  // Filters can be extended when backend supports them
  // {
  //   key: 'action',
  //   label: 'Action',
  //   type: 'select',
  //   options: [
  //     { label: 'Create', value: 'create' },
  //     { label: 'Read', value: 'read' },
  //     { label: 'Update', value: 'update' },
  //     { label: 'Destroy', value: 'destroy' },
  //     { label: 'Manage', value: 'manage' },
  //   ],
  // },
];
