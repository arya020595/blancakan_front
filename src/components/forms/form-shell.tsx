"use client";

import Spinner from "@/components/ui/spinner";
import React from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";

export interface FormShellProps<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  resolver?: Resolver<T>;
  onSubmit: SubmitHandler<T>;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  error?: string | null;
  children: React.ReactNode; // fields only
}

/**
 * FormShell wraps react-hook-form so features can provide only field components.
 * - No API calls inside, only calls onSubmit with typed data
 * - Consistent footer buttons and error area
 */
export function FormShell<T extends FieldValues>({
  defaultValues,
  resolver,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  error,
  children,
}: FormShellProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    resolver,
    mode: "onSubmit",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {children}

        <div className="mt-6 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={!!isSubmitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
              {cancelLabel}
            </button>
          )}
          <button
            type="submit"
            disabled={!!isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner
                  size={16}
                  className="-ml-1 text-white"
                  ariaLabel="Processing"
                />
                Processing...
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default FormShell;
