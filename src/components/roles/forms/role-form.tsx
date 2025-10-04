"use client";

import { RoleFormValues } from "@/lib/schemas/role-schema";
import { useFormContext } from "react-hook-form";

export interface RoleFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * RoleForm: fields-only component. Must be rendered inside FormShell(FormProvider).
 */
export function RoleForm({ mode, isSubmitting }: RoleFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RoleFormValues>();

  return (
    <>
      <div>
        <label
          htmlFor={`${mode}-name`}
          className="mb-1 block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          id={`${mode}-name`}
          type="text"
          {...register("name")}
          disabled={isSubmitting}
          className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter role name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${mode}-description`}
          className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id={`${mode}-description`}
          {...register("description")}
          disabled={isSubmitting}
          rows={3}
          className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter role description (optional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
    </>
  );
}

export default RoleForm;
