/**
 * Temporary Items Manager Hook
 * Manages temporary/optimistic items with automatic cleanup
 * Prevents operations on items that are still being processed
 */

import { useCallback, useRef } from "react";

interface TemporaryItem {
  id: string;
  timestamp: number;
  timeout?: NodeJS.Timeout;
}

export const useTemporaryItems = (cleanupDelay = 30000) => {
  // 30 seconds default
  const temporaryItems = useRef<Map<string, TemporaryItem>>(new Map());

  // Check if an item is temporary
  const isTemporary = useCallback((id: string): boolean => {
    return id.startsWith("temp-") || temporaryItems.current.has(id);
  }, []);

  // Add a temporary item
  const addTemporary = useCallback(
    (id: string, onCleanup?: (id: string) => void) => {
      // Clear existing timeout if any
      const existing = temporaryItems.current.get(id);
      if (existing?.timeout) {
        clearTimeout(existing.timeout);
      }

      // Set up automatic cleanup
      const timeout = setTimeout(() => {
        temporaryItems.current.delete(id);
        if (onCleanup) {
          onCleanup(id);
        }
      }, cleanupDelay);

      temporaryItems.current.set(id, {
        id,
        timestamp: Date.now(),
        timeout,
      });
    },
    [cleanupDelay]
  );

  // Remove a temporary item
  const removeTemporary = useCallback((id: string) => {
    const item = temporaryItems.current.get(id);
    if (item?.timeout) {
      clearTimeout(item.timeout);
    }
    temporaryItems.current.delete(id);
  }, []);

  // Clear all temporary items
  const clearAll = useCallback(() => {
    temporaryItems.current.forEach((item) => {
      if (item.timeout) {
        clearTimeout(item.timeout);
      }
    });
    temporaryItems.current.clear();
  }, []);

  // Get all temporary item IDs
  const getTemporaryIds = useCallback((): string[] => {
    return Array.from(temporaryItems.current.keys());
  }, []);

  return {
    isTemporary,
    addTemporary,
    removeTemporary,
    clearAll,
    getTemporaryIds,
  };
};
