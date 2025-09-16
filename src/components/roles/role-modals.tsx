/**
 * Role Modal Components
 *
 * Follows React patterns and accessibility guidelines:
 * - Compound component pattern for related modals
 * - Proper modal accessibility with focus management
 * - Form validation and error handling
 * - TypeScript interfaces for type safety
 * - Server Actions integration
 *
 * @see https://react.dev/reference/react/Fragment
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

"use client";

import type { Role } from "@/lib/api/types";
import React, { useEffect, useRef } from "react";

// Base Modal Props
interface BaseModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler to close the modal */
  onClose: () => void;
}

// Create Role Modal Props
interface CreateRoleModalProps extends BaseModalProps {
  /** Loading state for create operation */
  isCreating: boolean;
  /** Form submission handler */
  onSubmit: (formData: FormData) => void;
}

/**
 * CreateRoleModal - Modal for creating new roles
 *
 * Features:
 * - Accessible modal with proper focus management
 * - Form validation
 * - Loading states
 * - Keyboard navigation support
 */
export const CreateRoleModal = React.memo<CreateRoleModalProps>(
  ({ isOpen, isCreating, onClose, onSubmit }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus management
    useEffect(() => {
      if (isOpen && firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-modal-title">
        <div
          ref={modalRef}
          className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3
              id="create-modal-title"
              className="text-lg font-medium text-gray-900">
              Create New Role
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form action={onSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="create-name"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  ref={firstInputRef}
                  id="create-name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label
                  htmlFor="create-description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="create-description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter role description (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isCreating}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isCreating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                    Creating...
                  </>
                ) : (
                  "Create Role"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

CreateRoleModal.displayName = "CreateRoleModal";

// Edit Role Modal Props
interface EditRoleModalProps extends BaseModalProps {
  /** Role being edited */
  role: Role | null;
  /** Loading state for update operation */
  isUpdating: boolean;
  /** Form submission handler */
  onSubmit: (formData: FormData) => void;
}

/**
 * EditRoleModal - Modal for editing existing roles
 */
export const EditRoleModal = React.memo<EditRoleModalProps>(
  ({ isOpen, role, isUpdating, onClose, onSubmit }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus management
    useEffect(() => {
      if (isOpen && firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen || !role) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title">
        <div
          ref={modalRef}
          className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3
              id="edit-modal-title"
              className="text-lg font-medium text-gray-900">
              Edit Role
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form action={onSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  ref={firstInputRef}
                  id="edit-name"
                  type="text"
                  name="name"
                  defaultValue={role.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={role.description}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter role description (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isUpdating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                    Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

EditRoleModal.displayName = "EditRoleModal";

// Delete Role Modal Props
interface DeleteRoleModalProps extends BaseModalProps {
  /** Role being deleted */
  role: Role | null;
  /** Loading state for delete operation */
  isDeleting: boolean;
  /** Delete confirmation handler */
  onConfirm: () => void;
}

/**
 * DeleteRoleModal - Modal for confirming role deletion
 */
export const DeleteRoleModal = React.memo<DeleteRoleModalProps>(
  ({ isOpen, role, isDeleting, onClose, onConfirm }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen || !role) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title">
        <div
          ref={modalRef}
          className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3
                id="delete-modal-title"
                className="text-lg font-medium text-gray-900">
                Delete Role
              </h3>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the role{" "}
              <span className="font-medium text-gray-900">
                &quot;{role.name}&quot;
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                  Deleting...
                </>
              ) : (
                "Delete Role"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DeleteRoleModal.displayName = "DeleteRoleModal";
