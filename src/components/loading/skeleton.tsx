/**
 * Loading Skeleton Components
 * Reusable skeleton loading components for better perceived performance
 */

import React from "react";

// Base skeleton component
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "md",
  animate = true,
}) => {
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`
        bg-gray-200 
        ${roundedClasses[rounded]}
        ${animate ? "animate-pulse" : ""}
        ${className}
      `}
      style={style}
    />
  );
};

// Table skeleton components
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => (
  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="px-6 py-3">
              <Skeleton height="1rem" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <Skeleton height="1rem" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Card skeleton components
export const CardSkeleton: React.FC<{
  showImage?: boolean;
  lines?: number;
  className?: string;
}> = ({ showImage = false, lines = 3, className = "" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
    {showImage && <Skeleton className="mb-4" height="12rem" rounded="md" />}
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  </div>
);

// Form skeleton components
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <Skeleton className="mb-2" width="6rem" height="1rem" />
        <Skeleton height="2.5rem" rounded="md" />
      </div>
    ))}
    <div className="flex justify-end gap-3 mt-6">
      <Skeleton width="5rem" height="2.5rem" rounded="md" />
      <Skeleton width="5rem" height="2.5rem" rounded="md" />
    </div>
  </div>
);

// List skeleton components
export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
    <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
    <div className="flex-1 space-y-2">
      <Skeleton width="60%" height="1rem" />
      <Skeleton width="40%" height="0.75rem" />
    </div>
    <Skeleton width="4rem" height="1.5rem" rounded="md" />
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    {Array.from({ length: items }).map((_, index) => (
      <ListItemSkeleton key={index} />
    ))}
  </div>
);

// Dashboard/Stats skeleton components
export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton width="8rem" height="1rem" />
        <Skeleton width="4rem" height="2rem" />
      </div>
      <Skeleton width="3rem" height="3rem" rounded="md" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton width="12rem" height="2rem" />
        <Skeleton width="20rem" height="1rem" />
      </div>
      <Skeleton width="8rem" height="2.5rem" rounded="md" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>

    {/* Content Area */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton lines={5} />
      <CardSkeleton lines={5} />
    </div>
  </div>
);

// Page skeleton wrapper
export const PageSkeleton: React.FC<{
  children?: React.ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
}> = ({ children, showHeader = true, showSidebar = false }) => (
  <div className="min-h-screen bg-gray-50">
    {showHeader && (
      <div className="bg-white border-b border-gray-200 p-4">
        <Skeleton width="10rem" height="2rem" />
      </div>
    )}

    <div className={`flex ${showSidebar ? "max-w-7xl mx-auto" : ""}`}>
      {showSidebar && (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height="2rem" rounded="md" />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 p-6">{children || <DashboardSkeleton />}</div>
    </div>
  </div>
);

// Optimistic loading overlay
export const OptimisticOverlay: React.FC<{
  isVisible: boolean;
  children: React.ReactNode;
  opacity?: number;
}> = ({ isVisible, children, opacity = 0.6 }) => (
  <div className="relative">
    {children}
    {isVisible && (
      <div
        className="absolute inset-0 flex items-center justify-center bg-white z-10"
        style={{ opacity }}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
          <span className="text-sm text-gray-600">Saving...</span>
        </div>
      </div>
    )}
  </div>
);

const SkeletonComponents = {
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  ListItemSkeleton,
  ListSkeleton,
  StatCardSkeleton,
  DashboardSkeleton,
  PageSkeleton,
  OptimisticOverlay,
};

export default SkeletonComponents;
