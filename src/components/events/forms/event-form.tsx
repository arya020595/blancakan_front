/**
 * Event Form Component
 * Comprehensive form for creating/editing events with date/time pickers, location fields, etc.
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Using native select for now - can upgrade to custom Select component later
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/categories-hooks";
import { useEventTypes } from "@/hooks/event-types-hooks";
import { useOrganizers } from "@/hooks/organizers-hooks";
import type { EventFormValues } from "@/lib/schemas/event-schema";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface EventFormProps {
  mode: "create" | "edit";
  isSubmitting: boolean;
}

// Common timezones for the select dropdown
const COMMON_TIMEZONES = [
  { value: "Asia/Jakarta", label: "WIB - Western Indonesia Time" },
  { value: "Asia/Makassar", label: "WITA - Central Indonesia Time" },
  { value: "Asia/Jayapura", label: "WIT - Eastern Indonesia Time" },
];

const LOCATION_TYPES = [
  { value: "online", label: "Online Event" },
  { value: "offline", label: "In-Person Event" },
  { value: "hybrid", label: "Hybrid Event" },
];

export function EventForm({ mode, isSubmitting }: EventFormProps) {
  const form = useFormContext<EventFormValues>();

  // Watch location type to conditionally show location fields
  const locationType = form.watch("location_type");

  // Fetch data for dropdowns
  const { data: categoriesData } = useCategories({
    page: 1,
    per_page: 100,
    query: "*",
  });

  const { data: eventTypesData } = useEventTypes({
    page: 1,
    per_page: 100,
    query: "*",
  });

  const { data: organizersData } = useOrganizers({
    page: 1,
    per_page: 100,
    query: "*",
  });

  const categories = categoriesData?.data ?? [];
  const eventTypes = eventTypesData?.data ?? [];
  const organizers = organizersData?.data ?? [];

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event title..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event..."
                    rows={4}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="event_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Select event type...</option>
                      {eventTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Select organizer...</option>
                      {organizers.map((organizer) => (
                        <option key={organizer._id} value={organizer._id}>
                          {organizer.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time *</FormLabel>
                  <FormControl>
                    <Input type="time" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date *</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time *</FormLabel>
                  <FormControl>
                    <Input type="time" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select timezone...</option>
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location & Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="location_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Format *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select event format...</option>
                    {LOCATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Online Event Location */}
          {(locationType === "online" || locationType === "hybrid") && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Online Details</h4>

              <FormField
                control={form.control}
                name="location.platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Zoom, Google Meet, Microsoft Teams..."
                        disabled={isSubmitting}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location.link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link *</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://zoom.us/j/..."
                        disabled={isSubmitting}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Offline Event Location */}
          {(locationType === "offline" || locationType === "hybrid") && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Venue Details</h4>

              <FormField
                control={form.control}
                name="location.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full address..."
                        disabled={isSubmitting}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city..."
                          disabled={isSubmitting}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter state or province..."
                          disabled={isSubmitting}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Categories Multi-Select */}
          <FormField
            control={form.control}
            name="category_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories *</FormLabel>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                  {categories.map((category) => {
                    const isSelected =
                      field.value?.includes(category._id) || false;
                    return (
                      <label
                        key={category._id}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-50",
                          isSelected && "bg-indigo-50 border border-indigo-200"
                        )}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentValue = field.value || [];
                            if (e.target.checked) {
                              if (currentValue.length < 5) {
                                field.onChange([...currentValue, category._id]);
                              }
                            } else {
                              field.onChange(
                                currentValue.filter(
                                  (id: string) => id !== category._id
                                )
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    );
                  })}
                </div>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Select 1-5 categories. Selected: {field.value?.length || 0}/5
                </p>
              </FormItem>
            )}
          />

          {/* Event Settings */}
          <FormField
            control={form.control}
            name="is_paid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This is a paid event</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Cover Image */}
          <FormField
            control={form.control}
            name="cover_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
                </p>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
