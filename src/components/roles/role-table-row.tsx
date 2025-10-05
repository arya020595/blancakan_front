/**
 * Role Table Row Component
 *
 * Purpose:
 * - Renders a single row representing a `Role` in a table.
 * - Handles row-level UI like temporary optimistic state, and exposes
 *   `onEdit` and `onDelete` callbacks to the parent page/component.
 *
 * Props:
 * - `role`: the `Role` object to display (expects `_id`, `name`, `description`,
 *   `created_at`, `updated_at`).
 * - `onEdit(role)`: called when the user clicks Edit. Parent should open
 *   an edit modal and handle updating.
 * - `onDelete(id)`: called when the user confirms deletion. Parent should
 *   handle optimistic deletion and API call.
 *
 * Usage:
 * <tr>
 *  <RoleTableRow role={role} onEdit={openEdit} onDelete={confirmDelete} />
 * </tr>
 *
 * Notes:
 * - The component visually indicates optimistic/temporary roles (ids that
 *   start with "temp-") and disables actions while saving.
 *
 * @see https://react.dev/reference/react/memo
 * @see https://react.dev/learn/passing-props-to-a-component
 */

"use client";

import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/api/types";
import React, { useCallback } from "react";

interface RoleTableRowProps {
  /** Role data to display */
  role: Role;
  /** Handler for edit action */
  onEdit: (role: Role) => void;
  /** Handler for delete action */
  onDelete: (id: string) => void;
}

/**
 * RoleTableRow - Displays a single role in table format
 *
 * Features:
 * - Optimistic UI feedback for temporary roles
 * - Proper accessibility with titles and disabled states
 * - Consistent styling with Tailwind CSS
 * - Memoized to prevent unnecessary re-renders
 */
export const RoleTableRow = React.memo<RoleTableRowProps>(
  ({ role, onEdit, onDelete }) => {
    // Check if this is a temporary role (optimistic update)
    const isTempRole = role._id.startsWith("temp-");

    // Memoized handlers to prevent child re-renders
    const handleEdit = useCallback(() => {
      onEdit(role);
    }, [role, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(role._id);
    }, [role._id, onDelete]);

    return (
      <tr
        className={`hover:bg-gray-50 transition-colors ${
          isTempRole ? "opacity-70" : ""
        }`}
        role="row">
        {/* Name Column */}
        <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">{role.name}</div>
            {isTempRole && (
              <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Saving...
              </span>
            )}
          </div>
        </td>

        {/* Description Column */}
        <td className="px-6 py-4" role="gridcell">
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {role.description || "No description"}
          </div>
        </td>

        {/* Created Date Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          role="gridcell">
          {new Date(role.created_at).toLocaleDateString()}
        </td>

        {/* Updated Date Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          role="gridcell">
          {new Date(role.updated_at).toLocaleDateString()}
        </td>

        {/* Actions Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          role="gridcell">
          <div className="flex justify-end space-x-2">
            <Button
              variant="link"
              size="sm"
              onClick={handleEdit}
              disabled={isTempRole}
              className="text-indigo-600 hover:text-indigo-900 h-auto p-0"
              title={isTempRole ? "Cannot edit while saving..." : "Edit role"}
              aria-label={`Edit ${role.name}`}>
              Edit
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={handleDelete}
              disabled={isTempRole}
              className="text-red-600 hover:text-red-900 h-auto p-0"
              title={
                isTempRole ? "Cannot delete while saving..." : "Delete role"
              }
              aria-label={`Delete ${role.name}`}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  }
);

RoleTableRow.displayName = "RoleTableRow";
