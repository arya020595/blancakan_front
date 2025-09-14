/**
 * Toast Hook for Optimistic Updates
 * Specialized toast utilities for CRUD operations with optimistic updates
 */

import { useCallback } from "react";
import { useToastHelpers } from "./toast-provider";

export function useOptimisticToasts() {
  const { success, error, warning, info } = useToastHelpers();

  return {
    // CRUD operation toasts
    createSuccess: useCallback(
      (itemName: string = "item") => {
        success(`${itemName} created successfully!`);
      },
      [success]
    ),

    createError: useCallback(
      (itemName: string = "item") => {
        error(`Failed to create ${itemName}. Please try again.`);
      },
      [error]
    ),

    updateSuccess: useCallback(
      (itemName: string = "item") => {
        success(`${itemName} updated successfully!`);
      },
      [success]
    ),

    updateError: useCallback(
      (itemName: string = "item") => {
        error(`Failed to update ${itemName}. Please try again.`);
      },
      [error]
    ),

    deleteSuccess: useCallback(
      (itemName: string = "item") => {
        success(`${itemName} deleted successfully!`);
      },
      [success]
    ),

    deleteError: useCallback(
      (itemName: string = "item") => {
        error(`Failed to delete ${itemName}. Please try again.`);
      },
      [error]
    ),

    // Optimistic operation states
    optimisticCreate: useCallback(
      (itemName: string = "item") => {
        info(`Creating ${itemName}...`, "Changes will appear immediately");
      },
      [info]
    ),

    optimisticUpdate: useCallback(
      (itemName: string = "item") => {
        info(`Updating ${itemName}...`, "Changes will appear immediately");
      },
      [info]
    ),

    optimisticDelete: useCallback(
      (itemName: string = "item") => {
        warning(`Deleting ${itemName}...`, "This action will be permanent");
      },
      [warning]
    ),

    // Network/API errors
    networkError: useCallback(() => {
      error("Network error", "Please check your connection and try again");
    }, [error]),

    serverError: useCallback(() => {
      error(
        "Server error",
        "Something went wrong on our end. Please try again"
      );
    }, [error]),

    // Generic helpers
    operationSuccess: useCallback(
      (operation: string, itemName: string = "item") => {
        success(`${operation} ${itemName} successfully!`);
      },
      [success]
    ),

    operationError: useCallback(
      (operation: string, itemName: string = "item") => {
        error(`Failed to ${operation} ${itemName}. Please try again.`);
      },
      [error]
    ),

    // Validation errors
    validationError: useCallback(
      (message: string) => {
        warning("Validation Error", message);
      },
      [warning]
    ),

    // Permission errors
    permissionError: useCallback(() => {
      error(
        "Permission Denied",
        "You don't have permission to perform this action"
      );
    }, [error]),
  };
}

export default useOptimisticToasts;
