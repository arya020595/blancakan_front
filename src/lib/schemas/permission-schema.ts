/**
 * Permission Form Schemas
 * Validation schemas for permission management
 */

import { z } from "zod";

export const permissionSchema = z.object({
  action: z
    .string()
    .min(1, "Action is required")
    .trim()
    .refine(
      (action) => /^[a-zA-Z_]+$/.test(action),
      "Action can only contain letters and underscores"
    ),
  subject_class: z
    .string()
    .min(1, "Subject class is required")
    .trim(),
  conditions: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      "Conditions must be valid JSON"
    ),
  role_id: z
    .string()
    .min(1, "Role is required"),
});

// Type exports
export type PermissionFormValues = z.infer<typeof permissionSchema>;
