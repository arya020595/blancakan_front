/**
 * Category Table Row Component
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

import type { Category } from "@/lib/api/types";
import React, { useCallback } from "react";

interface CategoryTableRowProps {
  /** Category data to display */
  category: Category;
  /** Handler for edit action */
  onEdit: (category: Category) => void;
  /** Handler for delete action */
  onDelete: (id: string) => void;
}

/**
 * CategoryTableRow - Displays a single category in table format
 *
 * Features:
 * - Optimistic UI feedback for temporary categories
 * - Proper accessibility with titles and disabled states
 * - Consistent styling with Tailwind CSS
 * - Memoized to prevent unnecessary re-renders
 */
export const CategoryTableRow = React.memo<CategoryTableRowProps>(
  ({ category, onEdit, onDelete }) => {
    // Check if this is a temporary category (optimistic update)
    const isTempCategory = category._id.startsWith("temp-");

    // Memoized handlers to prevent child re-renders
    const handleEdit = useCallback(() => {
      onEdit(category);
    }, [category, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(category._id);
    }, [category._id, onDelete]);

    return (
      <tr
        className={`hover:bg-gray-50 transition-colors ${
          isTempCategory ? "opacity-70" : ""
        }`}
        role="row">
        {/* Name Column */}
        <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">
              {category.name}
            </div>
            {isTempCategory && (
              <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Saving...
              </span>
            )}
          </div>
        </td>

        {/* Description Column */}
        <td className="px-6 py-4" role="gridcell">
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {category.description || "No description"}
          </div>
        </td>

        {/* Status Column */}
        <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            {category.is_active ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Created Date Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          role="gridcell">
          {new Date(category.created_at).toLocaleDateString()}
        </td>

        {/* Actions Column */}
        <td
          className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          role="gridcell">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleEdit}
              disabled={isTempCategory}
              className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                isTempCategory ? "Cannot edit while saving..." : "Edit category"
              }
              aria-label={`Edit ${category.name}`}>
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isTempCategory}
              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                isTempCategory
                  ? "Cannot delete while saving..."
                  : "Delete category"
              }
              aria-label={`Delete ${category.name}`}>
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

CategoryTableRow.displayName = "CategoryTableRow";
