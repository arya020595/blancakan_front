"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EventTypeFormValues } from "@/lib/schemas/event-type-schema";
import { useFormContext } from "react-hook-form";

export interface EventTypeFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * EventTypeForm: fields-only component using shadcn/ui Form components.
 * Must be rendered inside FormShell(FormProvider).
 */
export function EventTypeForm({ mode, isSubmitting }: EventTypeFormProps) {
  const form = useFormContext<EventTypeFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter event type name"
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter event type description (optional)"
                disabled={isSubmitting}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="icon_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Icon URL</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="Enter icon URL (optional)"
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
        name="sort_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sort Order</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="999"
                placeholder="Enter sort order (0-999)"
                disabled={isSubmitting}
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? 0 : parseInt(value, 10));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-end space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Active</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}

export default EventTypeForm;
