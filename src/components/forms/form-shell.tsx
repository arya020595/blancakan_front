"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

  const handleFormSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {children}

        <div className="mt-6 flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={!!isSubmitting}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={!!isSubmitting}>
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
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default FormShell;
