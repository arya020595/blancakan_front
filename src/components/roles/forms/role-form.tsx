"use client";

import { useFormContext } from "react-hook-form";

export type RoleFormValues = {
  name: string;
  description?: string;
};

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
          {...register("name", { required: true })}
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter role name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">Name is required.</p>
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
          rows={3}
          {...register("description")}
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter role description (optional)"
        />
      </div>
    </>
  );
}

export default RoleForm;
