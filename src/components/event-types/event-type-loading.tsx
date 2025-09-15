/**
 * Event Type Loading Component
 *
 * Provides skeleton loading states for event types list.
 * Follows accessibility guidelines with proper ARIA attributes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy
 * @see https://inclusive-components.design/loading-states/
 */

"use client";

import React from "react";

interface EventTypeLoadingProps {
  /** Number of skeleton rows to display */
  rowCount?: number;
  /** Whether to show the header skeleton */
  showHeader?: boolean;
  /** Whether to show pagination skeleton */
  showPagination?: boolean;
}

/**
 * EventTypeLoading - Skeleton loading component for event types
 *
 * Displays animated skeleton placeholders while data is loading.
 */
export const EventTypeLoading = React.memo<EventTypeLoadingProps>(
  ({ rowCount = 5, showHeader = true, showPagination = true }) => {
    return (
      <div
        className="space-y-6"
        role="status"
        aria-busy="true"
        aria-label="Loading event types">
        {/* Header skeleton */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              {/* Title skeleton */}
              <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse" />
              {/* Subtitle skeleton */}
              <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search skeleton */}
              <div className="h-10 bg-gray-200 rounded-md w-full sm:w-80 animate-pulse" />
              {/* Create button skeleton */}
              <div className="h-10 bg-gray-200 rounded-md w-full sm:w-40 animate-pulse" />
            </div>
          </div>
        )}

        {/* Table skeleton */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {/* Table header skeleton */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Checkbox skeleton */}
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                {/* Header columns skeleton */}
                <div className="flex gap-8">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </div>

          {/* Table rows skeleton */}
          <div className="divide-y divide-gray-200">
            {Array.from({ length: rowCount }, (_, index) => (
              <div
                key={index}
                className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Checkbox skeleton */}
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />

                    {/* Icon skeleton */}
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />

                    {/* Content skeleton */}
                    <div className="space-y-2">
                      {/* Name skeleton */}
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                      {/* Description skeleton */}
                      <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
                    </div>

                    {/* Slug skeleton */}
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />

                    {/* Sort order skeleton */}
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />

                    {/* Status skeleton */}
                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                  </div>

                  {/* Actions skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        {showPagination && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            {/* Left side - Item count */}
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>

            {/* Right side - Page navigation */}
            <div className="flex items-center gap-1">
              {/* Previous button */}
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />

              {/* Page numbers */}
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gray-200 rounded animate-pulse"
                />
              ))}

              {/* Next button */}
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        )}

        {/* Screen reader announcement */}
        <span className="sr-only">Loading event types data...</span>
      </div>
    );
  }
);

EventTypeLoading.displayName = "EventTypeLoading";

/**
 * EventTypeRowSkeleton - Individual row skeleton for incremental loading
 */
export const EventTypeRowSkeleton = React.memo(() => {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Checkbox skeleton */}
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />

          {/* Icon skeleton */}
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />

          {/* Content skeleton */}
          <div className="space-y-2">
            {/* Name skeleton */}
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            {/* Description skeleton */}
            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
          </div>

          {/* Slug skeleton */}
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />

          {/* Sort order skeleton */}
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />

          {/* Status skeleton */}
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
});

EventTypeRowSkeleton.displayName = "EventTypeRowSkeleton";

/**
 * EventTypeCardSkeleton - Card layout skeleton for mobile views
 */
export const EventTypeCardSkeleton = React.memo(() => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />

          <div className="space-y-2">
            {/* Name skeleton */}
            <div className="h-5 bg-gray-200 rounded w-28 animate-pulse" />
            {/* Slug skeleton */}
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>

        {/* Status skeleton */}
        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
});

EventTypeCardSkeleton.displayName = "EventTypeCardSkeleton";
