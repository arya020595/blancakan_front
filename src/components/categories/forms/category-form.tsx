"use client";

import { useFormContext } from "react-hook-form";

export type CategoryFormValues = {
  name: string;
  description?: string;
  is_active: boolean;
};

export interface CategoryFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * CategoryForm: fields-only component. Must be rendered inside FormShell(FormProvider).
 */
export function CategoryForm({ mode, isSubmitting }: CategoryFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CategoryFormValues>();

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
          placeholder="Enter category name"
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
          placeholder="Enter category description (optional)"
        />
      </div>

      <div className="flex items-center">
        <input
          id={`${mode}-is_active`}
          type="checkbox"
          {...register("is_active")}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor={`${mode}-is_active`}
          className="ml-2 block text-sm text-gray-700">
          Active
        </label>
      </div>
    </>
  );
}

export default CategoryForm;