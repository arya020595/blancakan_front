"use client";

import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";
import { Icons } from "./icons";
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
 * ErrorModal - A beautiful, shadcn-based modal for displaying backend validation errors
 * 
 * Supports two error formats:
 * 1. Object format: { errors: { field: ["message1", "message2"] } }
 * 2. Array format: { errors: ["message1", "message2"] }
 * 
 * Features:
 * - Beautiful design with shadcn Alert components
 * - Lucide React icons for modern look
 * - Accessible modal with proper focus management
 * - Handles both error formats automatically
 * - Field-specific error grouping with elegant styling
 * - Smooth animations and hover effects
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
      title={
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50 border border-red-200 shadow-sm">
            <Icons.warning size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
            {error.message && (
              <p className="text-sm text-gray-600 leading-relaxed">{error.message}</p>
            )}
          </div>
        </div>
      }
      size="lg"
      footer={
        showCloseButton ? (
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {isObjectFormat && Object.keys(error.errors as Record<string, string[]>).length > 1 && (
                `${Object.keys(error.errors as Record<string, string[]>).length} fields have errors`
              )}
              {isArrayFormat && (error.errors as string[]).length > 1 && (
                `${(error.errors as string[]).length} errors found`
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="min-w-24 hover:bg-gray-50 transition-colors duration-200"
            >
              <Icons.close size={16} className="mr-2" />
              Close
            </Button>
          </div>
        ) : undefined
      }>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {/* Object format: field-specific errors */}
        {isObjectFormat && (
          <div className="space-y-3">
            {Object.entries(error.errors as Record<string, string[]>).map(([field, messages], index) => (
              <Alert 
                key={field} 
                variant="destructive" 
                className="border-l-4 border-red-500 bg-red-50/50 transition-colors duration-200 hover:bg-red-50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icons.error size={16} />
                <div className="ml-2">
                  <h4 className="font-semibold text-red-800 capitalize mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full" />
                    {field.replace(/[_-]/g, " ")}
                  </h4>
                  <AlertDescription className="text-red-700">
                    {messages.length === 1 ? (
                      <p className="leading-relaxed text-sm">{messages[0]}</p>
                    ) : (
                      <ul className="space-y-2 ml-2">
                        {messages.map((message, msgIndex) => (
                          <li key={msgIndex} className="flex items-start gap-3 group">
                            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-red-600 transition-colors" />
                            <span className="leading-relaxed text-sm">{message}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Array format: general errors */}
        {isArrayFormat && (
          <Alert variant="destructive" className="border-l-4 border-red-500 bg-red-50/50 transition-colors duration-200 hover:bg-red-50">
            <Icons.error size={16} />
            <AlertDescription className="ml-2 text-red-700">
              {(error.errors as string[]).length === 1 ? (
                <p className="leading-relaxed text-sm">{(error.errors as string[])[0]}</p>
              ) : (
                <div className="space-y-3">
                  <p className="font-medium text-red-800 text-sm">Multiple errors occurred:</p>
                  <ul className="space-y-2 ml-2">
                    {(error.errors as string[]).map((message, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-red-600 transition-colors" />
                        <span className="leading-relaxed text-sm">{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Fallback for unknown error format */}
        {!isObjectFormat && !isArrayFormat && (
          <Alert variant="destructive" className="border-l-4 border-red-500 bg-red-50/50 transition-colors duration-200 hover:bg-red-50">
            <Icons.error size={16} />
            <AlertDescription className="ml-2 text-red-700">
              <div className="space-y-2">
                <p className="font-medium text-red-800 text-sm">Unexpected Error</p>
                <p className="leading-relaxed text-sm">
                  {error.message || "An unknown error occurred. Please check your input and try again."}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {isObjectFormat && Object.keys(error.errors as Record<string, string[]>).length === 0 && (
          <Alert variant="destructive" className="border-l-4 border-red-500 bg-red-50/50">
            <Icons.error size={16} />
            <AlertDescription className="ml-2 text-red-700">
              <div className="space-y-2">
                <p className="font-medium text-red-800 text-sm">No Error Details</p>
                <p className="leading-relaxed text-sm">
                  No specific error details were provided. Please check your input and try again.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Modal>
  );
}

export default ErrorModal;