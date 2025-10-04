/**
 * Search Form Schemas
 * Validation schemas for search and filter forms
 */

import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .max(100, "Search query must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

// Type exports
export type SearchFormValues = z.infer<typeof searchSchema>;
