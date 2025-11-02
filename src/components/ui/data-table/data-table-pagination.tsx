/**
 * DataTablePagination - Pagination controls
 *
 * Enhanced pagination with:
 * - First/Previous/Next/Last buttons
 * - Page number display
 * - Items per page selector
 * - Keyboard navigation
 */

import { Button } from "@/components/ui/button";
import { useTableParams } from "@/hooks/use-table-params";
import type { PaginationMeta } from "@/lib/api/types";

interface DataTablePaginationProps {
  meta: PaginationMeta | null;
}

export function DataTablePagination({ meta }: DataTablePaginationProps) {
  const { params, setPage, setPerPage } = useTableParams();

  if (!meta) return null;

  const {
    current_page,
    total_pages,
    total_count,
    per_page,
    prev_page,
    next_page,
  } = meta;

  const hasNextPage = next_page !== null;
  const hasPrevPage = prev_page !== null;

  // Calculate showing range
  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total_count);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      {/* Left side: Results info */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{total_count}</span> results
        </p>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="per-page" className="text-sm text-gray-700">
            Per page:
          </label>
          <select
            id="per-page"
            value={params.per_page}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="block w-20 rounded-md border-gray-300 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Right side: Navigation buttons */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(1)}
          disabled={!hasPrevPage}
          aria-label="Go to first page">
          «
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => prev_page && setPage(prev_page)}
          disabled={!hasPrevPage}
          aria-label="Go to previous page">
          ‹
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers(current_page, total_pages).map((page, idx) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isCurrentPage = pageNum === current_page;

            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
                disabled={isCurrentPage}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isCurrentPage ? "page" : undefined}
                className={isCurrentPage ? "" : "text-gray-700"}>
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => next_page && setPage(next_page)}
          disabled={!hasNextPage}
          aria-label="Go to next page">
          ›
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(total_pages)}
          disabled={!hasNextPage}
          aria-label="Go to last page">
          »
        </Button>
      </div>
    </div>
  );
}

/**
 * Generate page numbers with ellipsis
 * Shows: 1 ... 5 6 [7] 8 9 ... 20
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const delta = 2; // Show 2 pages on each side of current
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  // Show ellipsis after first page if needed
  if (currentPage > delta + 2) {
    pages.push("...");
  }

  // Show range around current page
  const start = Math.max(2, currentPage - delta);
  const end = Math.min(totalPages - 1, currentPage + delta);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Show ellipsis before last page if needed
  if (currentPage < totalPages - delta - 1) {
    pages.push("...");
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}
