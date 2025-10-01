"use client";

import { useFormContext } from "react-hook-form";

export type EventTypeFormValues = {
  name: string;
  description?: string;
  icon_url?: string;
  sort_order: number;
  is_active: boolean;
};

export interface EventTypeFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * EventTypeForm: fields-only component. Must be rendered inside FormShell(FormProvider).
 */
export function EventTypeForm({ mode, isSubmitting }: EventTypeFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EventTypeFormValues>();

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
          placeholder="Enter event type name"
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
          placeholder="Enter event type description (optional)"
        />
      </div>

      <div>
        <label
          htmlFor={`${mode}-icon_url`}
          className="mb-1 block text-sm font-medium text-gray-700">
          Icon URL
        </label>
        <input
          id={`${mode}-icon_url`}
          type="url"
          {...register("icon_url")}
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter icon URL (optional)"
        />
        {errors.icon_url && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid URL.</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${mode}-sort_order`}
          className="mb-1 block text-sm font-medium text-gray-700">
          Sort Order *
        </label>
        <input
          id={`${mode}-sort_order`}
          type="number"
          min="0"
          {...register("sort_order", { 
            required: true, 
            valueAsNumber: true,
            min: 0 
          })}
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter sort order"
        />
        {errors.sort_order && (
          <p className="mt-1 text-sm text-red-600">
            Sort order is required and must be a positive number.
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id={`${mode}-is_active`}
          type="checkbox"
          {...register("is_active")}
          disabled={isSubmitting}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor={`${mode}-is_active`}
          className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>
    </>
  );
}

export default EventTypeForm;