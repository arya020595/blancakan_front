import type { ValidationError, ValidationErrorArray, ValidationErrorObject } from "@/components/ui/error-modal";

/**
 * Utility functions for handling backend validation errors
 * 
 * These functions help normalize different error response formats
 * and extract useful information for display purposes.
 */

/**
 * Type guard to check if error is object format
 */
export function isObjectFormatError(error: ValidationError): error is ValidationErrorObject {
  return error.errors && typeof error.errors === "object" && !Array.isArray(error.errors);
}

/**
 * Type guard to check if error is array format
 */
export function isArrayFormatError(error: ValidationError): error is ValidationErrorArray {
  return Array.isArray(error.errors);
}

/**
 * Extract all error messages from any error format
 * Returns a flat array of all error messages
 */
export function extractAllErrorMessages(error: ValidationError): string[] {
  if (isObjectFormatError(error)) {
    return Object.values(error.errors).flat();
  }
  
  if (isArrayFormatError(error)) {
    return error.errors;
  }
  
  // This should never happen given the ValidationError type, but as a fallback
  return [(error as { message?: string }).message || "An unknown error occurred"];
}

/**
 * Get the first error message (useful for simple error displays)
 */
export function getFirstErrorMessage(error: ValidationError): string {
  const messages = extractAllErrorMessages(error);
  return messages[0] || error.message || "An unknown error occurred";
}

/**
 * Count total number of errors
 */
export function getErrorCount(error: ValidationError): number {
  return extractAllErrorMessages(error).length;
}

/**
 * Get field names that have errors (only for object format)
 */
export function getErrorFields(error: ValidationError): string[] {
  if (isObjectFormatError(error)) {
    return Object.keys(error.errors);
  }
  return [];
}

/**
 * Check if a specific field has errors (only for object format)
 */
export function hasFieldError(error: ValidationError, fieldName: string): boolean {
  if (isObjectFormatError(error)) {
    return fieldName in error.errors && error.errors[fieldName].length > 0;
  }
  return false;
}

/**
 * Get errors for a specific field (only for object format)
 */
export function getFieldErrors(error: ValidationError, fieldName: string): string[] {
  if (isObjectFormatError(error) && fieldName in error.errors) {
    return error.errors[fieldName];
  }
  return [];
}

/**
 * Format field name for display (converts snake_case/kebab-case to Title Case)
 */
export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Convert any error-like object to ValidationError format
 * Useful for normalizing different backend error responses
 */
export function normalizeError(
  errorResponse: any,
  fallbackMessage = "An error occurred"
): ValidationError {
  // Already in correct format
  if (errorResponse?.status === "error" && errorResponse?.errors) {
    return errorResponse as ValidationError;
  }

  // Handle Axios error responses
  if (errorResponse?.response?.data) {
    const data = errorResponse.response.data;
    if (data.status === "error" && data.errors) {
      return data as ValidationError;
    }
  }

  // Handle plain error objects with message
  if (errorResponse?.message) {
    return {
      status: "error",
      message: errorResponse.message,
      errors: [errorResponse.message],
    };
  }

  // Handle string errors
  if (typeof errorResponse === "string") {
    return {
      status: "error",
      message: errorResponse,
      errors: [errorResponse],
    };
  }

  // Fallback
  return {
    status: "error",
    message: fallbackMessage,
    errors: [fallbackMessage],
  };
}

/**
 * Create a validation error from a simple message
 */
export function createValidationError(message: string): ValidationError {
  return {
    status: "error",
    message,
    errors: [message],
  };
}

/**
 * Create a validation error with field-specific errors
 */
export function createFieldValidationError(
  message: string,
  fieldErrors: Record<string, string | string[]>
): ValidationError {
  const normalizedErrors: Record<string, string[]> = {};
  
  for (const [field, errors] of Object.entries(fieldErrors)) {
    normalizedErrors[field] = Array.isArray(errors) ? errors : [errors];
  }

  return {
    status: "error",
    message,
    errors: normalizedErrors,
  };
}