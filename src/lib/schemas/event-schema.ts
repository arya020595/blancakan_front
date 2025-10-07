/**
 * Event Schema - Zod validation for event forms
 */

import { z } from "zod";

/**
 * Event form validation schema
 */
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  
  start_date: z
    .string()
    .min(1, "Start date is required"),
  
  start_time: z
    .string()
    .min(1, "Start time is required"),
  
  end_date: z
    .string()
    .min(1, "End date is required"),
  
  end_time: z
    .string()
    .min(1, "End time is required"),
  
  location_type: z
    .enum(["online", "offline", "hybrid"])
    .refine((val) => val !== undefined, {
      message: "Location type is required",
    }),
  
  location: z.object({
    venue_name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    meeting_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }).optional(),
  
  timezone: z
    .string()
    .min(1, "Timezone is required"),
  
  organizer_id: z
    .string()
    .min(1, "Organizer is required"),
  
  event_type_id: z
    .string()
    .min(1, "Event type is required"),
  
  category_ids: z
    .array(z.string())
    .min(1, "At least one category is required"),
  
  is_paid: z
    .boolean()
    .default(false),
  
  cover_image: z
    .instanceof(File)
    .optional()
    .or(z.string().optional()), // Allow string for existing image URL
});

/**
 * Infer TypeScript type from schema
 */
export type EventFormValues = z.infer<typeof eventSchema>;
