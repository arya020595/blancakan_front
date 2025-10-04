"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RoleFormValues } from "@/lib/schemas/role-schema";
import { useFormContext } from "react-hook-form";

export interface RoleFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * RoleForm: fields-only component using shadcn/ui Form components.
 * Must be rendered inside FormShell(FormProvider).
 */
export function RoleForm({ mode, isSubmitting }: RoleFormProps) {
  const form = useFormContext<RoleFormValues>();

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
                placeholder="Enter role name"
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
                placeholder="Enter role description (optional)"
                disabled={isSubmitting}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export default RoleForm;
