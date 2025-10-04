"use client";

import { EventTypeFormValues } from "@/lib/schemas/event-type-schema";
import { useFormContext } from "react-hook-form";

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
          {...register("name")}
          disabled={isSubmitting}
          className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter event type name"
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
          rows={3}
          {...register("description")}
          disabled={isSubmitting}
          className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter event type description (optional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
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
          className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.icon_url
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter icon URL (optional)"
        />
        {errors.icon_url && (
          <p className="mt-1 text-sm text-red-600">{errors.icon_url.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${mode}-sort_order`}
          className="mb-1 block text-sm font-medium text-gray-700">
          Sort Order
        </label>
        <input
          id={`${mode}-sort_order`}
          type="number"
          min="0"
          max="999"
          {...register("sort_order", { valueAsNumber: true })}
          disabled={isSubmitting}
          className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.sort_order
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter sort order (0-999)"
        />
        {errors.sort_order && (
          <p className="mt-1 text-sm text-red-600">
            {errors.sort_order.message}
          </p>
        )}
      </div>

      <div>
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
        {errors.is_active && (
          <p className="mt-1 text-sm text-red-600">
            {errors.is_active.message}
          </p>
        )}
      </div>
    </>
  );
}

export default EventTypeForm;
