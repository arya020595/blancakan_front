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
import { CategoryFormValues } from "@/lib/schemas/category-schema";
import { useFormContext } from "react-hook-form";

export interface CategoryFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * CategoryForm: fields-only component using shadcn/ui Form components.
 * Must be rendered inside FormShell(FormProvider).
 */
export function CategoryForm({ mode, isSubmitting }: CategoryFormProps) {
  const form = useFormContext<CategoryFormValues>();

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
                placeholder="Enter category name"
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
                placeholder="Enter category description (optional)"
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
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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

export default CategoryForm;
