/**
 * Event Type Pagination Component
 */

"use client";

import type { PaginationMeta } from "@/lib/api/types";
import React from "react";

interface EventTypePaginationProps {
  meta: PaginationMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const EventTypePagination = React.memo<EventTypePaginationProps>(
  ({ meta, currentPage, onPageChange, isLoading = false }) => {
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

    return (
      <nav className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          <span className="font-medium">
            Page {meta.current_page} of {meta.total_pages}
          </span>
          <span className="ml-2 text-gray-500">
            ({meta.total_count} total event types)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={meta.prev_page === null || isLoading}
            className="px-3 py-2 text-sm font-medium rounded-md border">
            Previous
          </button>

          <button
            onClick={handleNextPage}
            disabled={meta.next_page === null || isLoading}
            className="px-3 py-2 text-sm font-medium rounded-md border">
            Next
          </button>
        </div>
      </nav>
    );
  }
);

EventTypePagination.displayName = "EventTypePagination";
