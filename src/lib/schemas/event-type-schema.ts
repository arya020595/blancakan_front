/**
 * Event Type Form Schemas
 * Validation schemas for event type management
 */

import { z } from "zod";

export const eventTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Event type name is required")
    .min(2, "Event type name must be at least 2 characters")
    .max(50, "Event type name must be less than 50 characters")
    .trim(),
  description: z
    .string()
    .max(300, "Description must be less than 300 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  icon_url: z.url("Please enter a valid URL").optional().or(z.literal("")),
  is_active: z.boolean(),
  sort_order: z
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order must be 0 or greater")
    .max(999, "Sort order must be less than 1000"),
});

// Type exports
export type EventTypeFormValues = z.infer<typeof eventTypeSchema>;
