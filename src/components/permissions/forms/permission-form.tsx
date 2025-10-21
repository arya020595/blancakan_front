"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { usePermissionOptions } from "@/hooks/permissions-hooks";
import { useRoles } from "@/hooks/roles-hooks";
import { PermissionFormValues } from "@/lib/schemas/permission-schema";
import { useFormContext } from "react-hook-form";

export interface PermissionFormProps {
  mode: "create" | "edit";
  isSubmitting: boolean;
}

/**
 * PermissionForm: fields-only component using shadcn/ui Form components.
 * Must be rendered inside FormShell(FormProvider).
 */
export function PermissionForm({ mode, isSubmitting }: PermissionFormProps) {
  const form = useFormContext<PermissionFormValues>();

  // Fetch roles for dropdown
  const { data: rolesData, isLoading: rolesLoading } = useRoles({
    per_page: 100,
    query: "*",
  });

  // Fetch permission options (subject classes)
  const { data: optionsData, isLoading: optionsLoading } =
    usePermissionOptions();

  const roles = rolesData?.data ?? [];
  const subjectClasses = optionsData?.subject_class ?? [];

  // Common actions
  const commonActions = ["create", "read", "update", "destroy", "manage"];

  return (
    <>
      <FormField
        control={form.control}
        name="role_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role *</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={isSubmitting || rolesLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">
                  {rolesLoading ? "Loading roles..." : "Select a role..."}
                </option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
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
        name="action"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action *</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Select an action...</option>
                {commonActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
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
        name="subject_class"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject Class *</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={isSubmitting || optionsLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">
                  {optionsLoading
                    ? "Loading subject classes..."
                    : "Select a subject class..."}
                </option>
                {subjectClasses.map((subjectClass) => (
                  <option key={subjectClass} value={subjectClass}>
                    {subjectClass}
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
        name="conditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conditions (JSON)</FormLabel>
            <FormControl>
              <Textarea
                placeholder='{"organizer_id": "user.organizer.id"}'
                disabled={isSubmitting}
                rows={4}
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500">
              Optional: Enter conditions as valid JSON (e.g., {"{"}
              &quot;user_id&quot;: &quot;user.id&quot;{"}"})
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export default PermissionForm;
