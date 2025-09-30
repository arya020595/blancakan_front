"use client";

import { Button } from "./button";
import { Modal } from "./modal";

// Error response types that match your backend formats
export interface ValidationErrorObject {
  status: "error";
  message: string;
  errors: Record<string, string[]>;
}

export interface ValidationErrorArray {
  status: "error";
  message: string;
  errors: string[];
}

export type ValidationError = ValidationErrorObject | ValidationErrorArray;

export interface ErrorModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler to close the modal */
  onClose: () => void;
  /** The error object from backend */
  error: ValidationError | null;
  /** Custom title for the modal */
  title?: string;
  /** Show close button in footer */
  showCloseButton?: boolean;
}

/**
 * ErrorModal - A reusable modal for displaying backend validation errors
 * 
 * Supports two error formats:
 * 1. Object format: { errors: { field: ["message1", "message2"] } }
 * 2. Array format: { errors: ["message1", "message2"] }
 * 
 * Features:
 * - Accessible modal with proper focus management
 * - Handles both error formats automatically
 * - Field-specific error grouping
 * - Clean, readable error display
 * - Keyboard navigation support
 */
export function ErrorModal({
  isOpen,
  onClose,
  error,
  title = "Validation Errors",
  showCloseButton = true,
}: ErrorModalProps) {
  if (!error) return null;

  const isObjectFormat = error.errors && typeof error.errors === "object" && !Array.isArray(error.errors);
  const isArrayFormat = Array.isArray(error.errors);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={error.message}
      size="md"
      footer={
        showCloseButton ? (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : undefined
      }>
      <div className="space-y-4">
        {/* Object format: field-specific errors */}
        {isObjectFormat && (
          <div className="space-y-3">
            {Object.entries(error.errors as Record<string, string[]>).map(([field, messages]) => (
              <div key={field} className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-red-800 capitalize">
                      {field.replace(/[_-]/g, " ")}
                    </h4>
                    <div className="mt-1 text-sm text-red-700">
                      {messages.length === 1 ? (
                        <p>{messages[0]}</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1">
                          {messages.map((message, index) => (
                            <li key={index}>{message}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Array format: general errors */}
        {isArrayFormat && (
          <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  {(error.errors as string[]).length === 1 ? (
                    <p>{(error.errors as string[])[0]}</p>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      {(error.errors as string[]).map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for unknown error format */}
        {!isObjectFormat && !isArrayFormat && (
          <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{error.message || "An unknown error occurred"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ErrorModal;