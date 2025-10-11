/**
 * Event Schema - Zod validation for event forms
 * Based on Ruby event_contract.rb validation rules
 */

import { z } from "zod";

// Location schema - supports both online and offline events
const locationSchema = z.object({
  // For online events
  platform: z.string().optional(),
  link: z.string().optional(),
  // For offline events
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

/**
 * Event form validation schema
 * Note: Form still uses separate date/time fields for better UX,
 * but they are combined into starts_at_local/ends_at_local before sending to API
 */
export const eventSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title must be at most 255 characters"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must be at most 5000 characters"),

    // Form fields - kept separate for better UX
    start_date: z.string().min(1, "Start date is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_date: z.string().min(1, "End date is required"),
    end_time: z.string().min(1, "End time is required"),

    location_type: z.enum(["online", "offline", "hybrid"], {
      message: "Location type must be online, offline, or hybrid",
    }),

    timezone: z.string().min(1, "Timezone is required"),

    event_type_id: z.string().min(1, "Event type is required"),

    organizer_id: z.string().min(1, "Organizer is required"),

    cover_image: z
      .union([
        z.url("Must be a valid URL").optional(),
        z.instanceof(File).optional(),
        z.literal("").optional(),
      ])
      .optional(),

    status: z.enum(["draft", "published", "cancelled", "rejected"]),
    location: locationSchema.optional(),

    is_paid: z.boolean(),

    category_ids: z
      .array(z.string())
      .min(1, "At least one category is required")
      .max(5, "Cannot have more than 5 categories"),
  })
  .refine(
    (data) => {
      // Validate that end datetime is after start datetime
      const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
      const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
      return endDateTime > startDateTime;
    },
    {
      message: "End date and time must be after start date and time",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      // Validate that start datetime is not in the past (only for create)
      const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
      return startDateTime > new Date();
    },
    {
      message: "Start date and time cannot be in the past",
      path: ["start_date"],
    }
  )
  .refine(
    (data) => {
      // Validate online event location
      if (data.location_type === "online" || data.location_type === "hybrid") {
        if (!data.location?.platform || data.location.platform.trim() === "") {
          return false;
        }
      }
      return true;
    },
    {
      message: "Platform is required for online/hybrid events",
      path: ["location", "platform"],
    }
  )
  .refine(
    (data) => {
      // Validate online event link
      if (data.location_type === "online" || data.location_type === "hybrid") {
        if (!data.location?.link || data.location.link.trim() === "") {
          return false;
        }
      }
      return true;
    },
    {
      message: "Meeting link is required for online/hybrid events",
      path: ["location", "link"],
    }
  )
  .refine(
    (data) => {
      // Validate offline event address
      if (data.location_type === "offline" || data.location_type === "hybrid") {
        if (!data.location?.address || data.location.address.trim() === "") {
          return false;
        }
      }
      return true;
    },
    {
      message: "Address is required for offline/hybrid events",
      path: ["location", "address"],
    }
  )
  .refine(
    (data) => {
      // Validate offline event city
      if (data.location_type === "offline" || data.location_type === "hybrid") {
        if (!data.location?.city || data.location.city.trim() === "") {
          return false;
        }
      }
      return true;
    },
    {
      message: "City is required for offline/hybrid events",
      path: ["location", "city"],
    }
  )
  .refine(
    (data) => {
      // Validate offline event state
      if (data.location_type === "offline" || data.location_type === "hybrid") {
        if (!data.location?.state || data.location.state.trim() === "") {
          return false;
        }
      }
      return true;
    },
    {
      message: "State is required for offline/hybrid events",
      path: ["location", "state"],
    }
  );

/**
 * Infer TypeScript type from schema
 */
export type EventFormValues = z.infer<typeof eventSchema>;

// Schema for create request (removes past date validation for editing)
export const createEventSchema = eventSchema;

// Schema for update request (allows past dates for existing events)
export const updateEventSchema = eventSchema.omit({}).refine(
  (data) => {
    // Only validate end datetime is after start datetime for updates
    const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
    const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
    return endDateTime > startDateTime;
  },
  {
    message: "End date and time must be after start date and time",
    path: ["end_date"],
  }
);

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
