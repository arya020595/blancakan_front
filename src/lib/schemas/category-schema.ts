/**
 * Category Form Schemas
 * Validation schemas for category management
 */

import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters")
    .trim()
    .refine(
      (name) => /^[a-zA-Z0-9\s\-_&]+$/.test(name),
      "Category name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands"
    ),
  description: z
    .string()
    .max(300, "Description must be less than 300 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

// Type exports
export type CategoryFormValues = z.infer<typeof categorySchema>;
