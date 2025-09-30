"use client";

import type { ValidationError } from "@/components/ui/error-modal";
import { useCallback, useState } from "react";

export interface UseErrorModalReturn {
  /** Current error state */
  error: ValidationError | null;
  /** Whether the error modal is open */
  isErrorModalOpen: boolean;
  /** Show error in modal */
  showError: (error: ValidationError) => void;
  /** Close error modal and clear error */
  closeError: () => void;
  /** Clear error without closing modal (useful for programmatic clearing) */
  clearError: () => void;
}

/**
 * Custom hook for managing error modal state
 * 
 * This hook provides a simple interface for:
 * - Displaying backend validation errors in a modal
 * - Managing modal open/close state
 * - Clearing errors programmatically
 * 
 * Perfect for form submissions where you want to show
 * backend validation errors without client-side validation logic.
 * 
 * @example
 * ```tsx
 * function MyForm() {
 *   const { error, isErrorModalOpen, showError, closeError } = useErrorModal();
 *   
 *   const handleSubmit = async (data) => {
 *     try {
 *       await submitForm(data);
 *     } catch (err) {
 *       if (err.response?.data?.status === 'error') {
 *         showError(err.response.data);
 *       }
 *     }
 *   };
 *   
 *   return (
 *     <>
 *       <form onSubmit={handleSubmit}>...</form>
 *       <ErrorModal 
 *         isOpen={isErrorModalOpen}
 *         onClose={closeError}
 *         error={error}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useErrorModal(): UseErrorModalReturn {
  const [error, setError] = useState<ValidationError | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const showError = useCallback((validationError: ValidationError) => {
    setError(validationError);
    setIsErrorModalOpen(true);
  }, []);

  const closeError = useCallback(() => {
    setIsErrorModalOpen(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isErrorModalOpen,
    showError,
    closeError,
    clearError,
  };
}

export default useErrorModal;