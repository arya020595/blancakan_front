/**
 * Category Pagination Component
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

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api/types";
import React from "react";

interface CategoryPaginationProps {
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
 * CategoryPagination - Reusable pagination component with Suspense support
 *
 * Features:
 * - Accessible navigation with ARIA labels
 * - Keyboard navigation support
 * - Loading state handling
 * - Clear visual feedback
 * - Responsive design
 */
export const CategoryPagination = React.memo<CategoryPaginationProps>(
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
        aria-label="Categories pagination">
        {/* Page Info */}
        <div className="text-sm text-gray-700">
          <span className="font-medium">
            Page {meta.current_page} of {meta.total_pages}
          </span>
          <span className="ml-2 text-gray-500">
            ({meta.total_count} total{" "}
            {meta.total_count === 1 ? "category" : "categories"})
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(1)}
                      onKeyDown={(e) => handleKeyDown(e, () => onPageChange(1))}
                      disabled={isLoading}
                      aria-label="Go to page 1">
                      1
                    </Button>
                    {currentPage > 4 && (
                      <span className="px-2 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    )}
                  </>
                )}

                {/* Previous page */}
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => onPageChange(currentPage - 1))
                    }
                    disabled={isLoading}
                    aria-label={`Go to page ${currentPage - 1}`}>
                    {currentPage - 1}
                  </Button>
                )}

                {/* Current page */}
                <span
                  className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-500 rounded-md"
                  aria-current="page"
                  aria-label={`Current page, page ${currentPage}`}>
                  {currentPage}
                </span>

                {/* Next page */}
                {currentPage < meta.total_pages && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => onPageChange(currentPage + 1))
                    }
                    disabled={isLoading}
                    aria-label={`Go to page ${currentPage + 1}`}>
                    {currentPage + 1}
                  </Button>
                )}

                {/* Last page */}
                {currentPage < meta.total_pages - 2 && (
                  <>
                    {currentPage < meta.total_pages - 3 && (
                      <span className="px-2 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(meta.total_pages)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => onPageChange(meta.total_pages))
                      }
                      disabled={isLoading}
                      aria-label={`Go to page ${meta.total_pages}`}>
                      {meta.total_pages}
                    </Button>
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

CategoryPagination.displayName = "CategoryPagination";

// Export pagination skeleton for Suspense fallbacks
export const CategoryPaginationSkeleton = React.memo(() => (
  <div className="flex justify-between items-center animate-pulse">
    <div className="h-4 w-48 bg-gray-200 rounded"></div>
    <div className="flex gap-2">
      <div className="h-8 w-20 bg-gray-200 rounded"></div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
      <div className="h-8 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
));

CategoryPaginationSkeleton.displayName = "CategoryPaginationSkeleton";
