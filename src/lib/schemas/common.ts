/**
 * Common Validation Helpers
 * Shared utilities for form validation across modules
 */

import { z } from "zod";

/**
 * Validate data against a schema and return formatted errors
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }

  const errors = result.error.flatten().fieldErrors;
  return { success: false, data: null, errors };
}

/**
 * Create form resolver for React Hook Form
 */
export function createFormResolver<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown) => {
    const result = schema.safeParse(data);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, { message: string }> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      errors[path] = { message: issue.message };
    });

    return { values: {}, errors };
  };
}
