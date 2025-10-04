/**
 * Role Form Schemas
 * Validation schemas for role management
 */

import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be less than 50 characters")
    .trim()
    .refine(
      (name) => /^[a-zA-Z0-9\s\-_]+$/.test(name),
      "Role name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

// Type exports
export type RoleFormValues = z.infer<typeof roleSchema>;
