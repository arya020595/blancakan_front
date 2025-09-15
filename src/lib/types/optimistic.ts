/**
 * Enhanced Types for Optimistic Updates
 * Provides better type safety for CRUD operations with optimistic updates
 */

import type { ApiError } from "@/lib/api/types";

// Generic optimistic state wrapper
export type OptimisticItem<T> = T & {
  _isOptimistic?: boolean;
  _operationType?: "create" | "update" | "delete";
  _tempId?: string;
};

// Optimistic operation result
export type OptimisticResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError; originalData?: T };

// Operation status for UI feedback
export type OperationStatus = "idle" | "pending" | "success" | "error";

// Enhanced error types
export interface OptimisticOperationError extends ApiError {
  operationType: "create" | "update" | "delete";
  rollbackData?: Record<string, unknown>;
  retryable: boolean;
}

// Generic CRUD hook state
export interface CrudHookState<T> {
  data: OptimisticItem<T>[];
  meta: Record<string, unknown> | null;
  isLoading: boolean;
  error: OptimisticOperationError | null;
  operationStatus: OperationStatus;
}

// Optimistic update configuration
export interface OptimisticConfig {
  enableOptimisticUpdates: boolean;
  rollbackOnError: boolean;
  showOptimisticIndicators: boolean;
  autoCleanupTimeout: number; // milliseconds
}

// Toast message types for consistent UI feedback
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Generic optimistic operation function type
export type OptimisticOperation<TInput, TOutput> = (
  input: TInput,
  config?: OptimisticConfig
) => Promise<TOutput>;

// Type guards for optimistic items
export const isOptimisticItem = <T>(
  item: T | OptimisticItem<T>
): item is OptimisticItem<T> => {
  return typeof item === "object" && item !== null && "_isOptimistic" in item;
};

export const isTempItem = <T>(item: T | OptimisticItem<T>): boolean => {
  if (!isOptimisticItem(item)) return false;

  // Check for _tempId property first
  if (item._tempId !== undefined) return true;

  // Check for temp- prefix in _id
  const itemWithId = item as T & { _id?: string };
  return Boolean(itemWithId._id?.startsWith("temp-"));
};

// Utility types for better inference
export type OptimisticCategoryItem = OptimisticItem<
  import("@/lib/api/types").Category
>;
export type OptimisticEventTypeItem = OptimisticItem<
  import("@/lib/api/types").EventType
>;

// Hook return types for consistency
export interface OptimisticListHook<T> {
  items: OptimisticItem<T>[];
  meta: Record<string, unknown> | null;
  isLoading: boolean;
  error: OptimisticOperationError | null;
  fetchItems: (params?: Record<string, unknown>) => Promise<void>;
  addOptimistic: (item: OptimisticItem<T>) => void;
  updateOptimistic: (item: OptimisticItem<T>) => void;
  removeOptimistic: (id: string) => void;
  replaceTempOptimistic: (tempId: string, realItem: T) => void;
  clearError: () => void;
}

export interface OptimisticCrudHook<TCreate, TUpdate, TItem> {
  operation: (input: TCreate | TUpdate | string) => Promise<TItem>;
  isLoading: boolean;
  error: OptimisticOperationError | null;
  clearError: () => void;
}

// Configuration for team standards
export const OPTIMISTIC_DEFAULTS: OptimisticConfig = {
  enableOptimisticUpdates: true,
  rollbackOnError: true,
  showOptimisticIndicators: true,
  autoCleanupTimeout: 30000, // 30 seconds
};

// Standard temporary ID generator
export const generateTempId = (prefix: string = "temp"): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Standard error creator for optimistic operations
export const createOptimisticError = (
  originalError: ApiError,
  operationType: "create" | "update" | "delete",
  rollbackData?: Record<string, unknown>
): OptimisticOperationError => ({
  ...originalError,
  operationType,
  rollbackData,
  retryable:
    (typeof originalError.status === "number" && originalError.status >= 500) ||
    originalError.status === 0, // Server errors or network issues
});
