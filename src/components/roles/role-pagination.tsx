/**
 * Role Pagination Component
 *
 * Follows pagination best practices:
 * - Accessibility with proper ARIA labels
 * - Keyboard navigation support
 * - Clear visual feedback for disabled states
 * - Responsive design considerations
 * - Type-safe meta data handling
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/pagination/
 * @see https://react.dev/reference/react/memo
 */

"use client";

import type { PaginationMeta } from "@/lib/api/types";
import React from "react";

interface RolePaginationProps {
  /** Pagination metadata from API */
  meta: PaginationMeta | null;
  /** Current page number */
  currentPage: number;
  /** Handler for page changes */
  onPageChange: (page: number) => void;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * RolePagination - Reusable pagination component with Suspense support
 *
 * Features:
 * - Accessible navigation with ARIA labels
 * - Keyboard navigation support
 * - Loading state handling
 * - Clear visual feedback
 * - Responsive design
 */
export const RolePagination = React.memo<RolePaginationProps>(
  ({ meta, currentPage, onPageChange, isLoading = false }) => {
    // Don't render if no meta data or only one page
    if (!meta || meta.total_pages <= 1) {
      return null;
    }

    const handlePreviousPage = () => {
      if (meta.prev_page !== null && !isLoading) {
        onPageChange(currentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (meta.next_page !== null && !isLoading) {
        onPageChange(currentPage + 1);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    };

    return (
      <nav
        className="flex justify-between items-center"
        role="navigation"
        aria-label="Roles pagination">
        {/* Page Info */}
        <div className="text-sm text-gray-700">
          <span className="font-medium">
            Page {meta.current_page} of {meta.total_pages}
          </span>
          <span className="ml-2 text-gray-500">
            ({meta.total_count} total{" "}
            {meta.total_count === 1 ? "role" : "roles"})
          </span>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            onKeyDown={(e) => handleKeyDown(e, handlePreviousPage)}
            disabled={meta.prev_page === null || isLoading}
            className={`
            px-3 py-2 text-sm font-medium rounded-md border transition-colors
            ${
              meta.prev_page === null || isLoading
                ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            }
          `}
            aria-label={`Go to page ${currentPage - 1}`}
            aria-disabled={meta.prev_page === null || isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </>
            )}
          </button>

          {/* Page Number Display */}
          <div className="flex items-center space-x-1">
            {/* Show ellipsis and specific pages for larger page counts */}
            {meta.total_pages > 1 && (
              <div className="flex items-center space-x-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => onPageChange(1)}
                      onKeyDown={(e) => handleKeyDown(e, () => onPageChange(1))}
                      disabled={isLoading}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Go to page 1">
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 py-2 text-sm text-gray-500">…</span>
                    )}
                  </>
                )}

                {/* Previous page */}
                {currentPage > 1 && (
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => onPageChange(currentPage - 1))
                    }
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Go to page ${currentPage - 1}`}>
                    {currentPage - 1}
                  </button>
                )}

                {/* Current page */}
                <button
                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md cursor-default"
                  aria-label={`Current page, page ${currentPage}`}
                  aria-current="page">
                  {currentPage}
                </button>

                {/* Next page */}
                {currentPage < meta.total_pages && (
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => onPageChange(currentPage + 1))
                    }
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Go to page ${currentPage + 1}`}>
                    {currentPage + 1}
                  </button>
                )}

                {/* Last page */}
                {currentPage < meta.total_pages - 2 && (
                  <>
                    {currentPage < meta.total_pages - 3 && (
                      <span className="px-2 py-2 text-sm text-gray-500">…</span>
                    )}
                    <button
                      onClick={() => onPageChange(meta.total_pages)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => onPageChange(meta.total_pages))
                      }
                      disabled={isLoading}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Go to page ${meta.total_pages}`}>
                      {meta.total_pages}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            onKeyDown={(e) => handleKeyDown(e, handleNextPage)}
            disabled={meta.next_page === null || isLoading}
            className={`
            px-3 py-2 text-sm font-medium rounded-md border transition-colors
            ${
              meta.next_page === null || isLoading
                ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            }
          `}
            aria-label={`Go to page ${currentPage + 1}`}
            aria-disabled={meta.next_page === null || isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <>
                Next
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </nav>
    );
  }
);

RolePagination.displayName = "RolePagination";
