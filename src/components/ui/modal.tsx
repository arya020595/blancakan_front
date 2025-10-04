"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

/**
 * Modal (UI-only) powered by Radix Dialog (shadcn-compatible)
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const maxWidth = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  }[size];

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open: boolean) => (!open ? onClose() : void 0)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            {...(description ? {} : { "aria-describedby": undefined })}
            className={`relative w-full ${maxWidth} max-h-[calc(100vh-2rem)] bg-white rounded-lg shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 flex flex-col`}>
            {/* Fixed Header */}
            {title !== undefined && title !== null && (
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  {title}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-100"
                    aria-label="Close modal">
                    <svg
                      className="h-5 w-5"
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
                </Dialog.Close>
              </div>
            )}

            {/* Close button for modals without title */}
            {(title === undefined || title === null) && (
              <div className="absolute top-4 right-4 z-10">
                <Dialog.Close asChild>
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-100"
                    aria-label="Close modal">
                    <svg
                      className="h-5 w-5"
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
                </Dialog.Close>
              </div>
            )}

            {description && (
              <div className="px-6 pt-2 pb-4 border-b border-gray-200 flex-shrink-0">
                <Dialog.Description className="text-sm text-gray-600">
                  {description}
                </Dialog.Description>
              </div>
            )}

            {/* Scrollable Content */}
            <div
              className={`flex-1 overflow-y-auto ${
                title !== undefined && title !== null ? "p-6" : "p-6 pt-12"
              }`}>
              <div className="modal-body">{children}</div>
            </div>

            {/* Fixed Footer */}
            {footer && (
              <div className="border-t border-gray-200 p-6 pt-4 flex-shrink-0">
                {footer}
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
