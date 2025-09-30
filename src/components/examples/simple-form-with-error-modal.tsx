/**
 * Example: Simple Form with Error Modal Pattern
 * 
 * This demonstrates the core error modal pattern for forms
 * without complex integrations. Perfect blueprint for rapid development.
 * 
 * Key concepts:
 * 1. Import and use useErrorModal hook
 * 2. Import and render ErrorModal component  
 * 3. Replace try/catch error handling to show validation errors
 * 4. Keep forms simple - no client validation logic needed
 * 5. Focus on UI, let backend handle all validation
 */

"use client";

import {
    CategoryForm,
    type CategoryFormValues,
} from "@/components/categories/forms/category-form";
import { FormShell } from "@/components/forms/form-shell";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ui/error-modal"; // NEW: Import ErrorModal
import Modal from "@/components/ui/modal";
import { useCreateCategory } from "@/hooks/categories-hooks";
import { useErrorModal } from "@/hooks/use-error-modal"; // NEW: Import useErrorModal hook
import type { CreateCategoryRequest } from "@/lib/api/types";
import { normalizeError } from "@/lib/utils/error-utils"; // NEW: Import error utility
import { createLogger } from "@/lib/utils/logger";
import { useCallback, useState } from "react";

const logger = createLogger("SIMPLE FORM WITH ERROR MODAL");

// Simplified example component
export default function SimpleFormWithErrorModal() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // NEW: Add error modal hook - this manages error state and modal visibility
  const { error, isErrorModalOpen, showError, closeError } = useErrorModal();

  // Mutation hook
  const { createCategory, isLoading } = useCreateCategory();

  // UPDATED: Create handler with error modal integration
  const handleCreate = useCallback(
    async (data: CategoryFormValues) => {
      const categoryData: CreateCategoryRequest = {
        category: {
          name: data.name,
          description: (data.description || "").trim(),
          is_active: true,
          parent_id: null,
        },
      };

      try {
        await createCategory(categoryData);
        setShowCreateModal(false); // Close form modal on success
        
        // Optional: Show success message
        console.log("Category created successfully!");
        logger.info("Category created successfully");
      } catch (error) {
        // NEW: Instead of generic error handling, show detailed validation errors
        const validationError = normalizeError(error, "Failed to create category");
        showError(validationError);
        logger.error("Failed to create category", error);
        
        // Note: We DON'T close the form modal here, so user can fix errors and retry
      }
    },
    [createCategory, showError]
  );

  return (
    <div className="space-y-6">
      {/* Simple page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Simple Form with Error Modal
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Example of the error modal pattern for rapid development
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Category
        </Button>
      </div>

      {/* Create Category Modal - Standard Modal + FormShell + Field-only Form */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Category">
        <FormShell<CategoryFormValues>
          defaultValues={{ name: "", description: "" }}
          onSubmit={handleCreate}
          isSubmitting={isLoading}
          submitLabel="Create Category"
          onCancel={() => setShowCreateModal(false)}>
          {/* Form contains ONLY fields - no validation logic, no error handling */}
          <CategoryForm mode="create" isSubmitting={isLoading} />
        </FormShell>
      </Modal>

      {/* NEW: Error Modal for Backend Validation Errors */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={error}
        title="Validation Error"
      />

      {/* Example content */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          How This Pattern Works
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>1. No Client Validation:</strong> The form has no validation logic. 
            Submit any data and let the backend validate.
          </p>
          <p>
            <strong>2. Backend Error Display:</strong> When backend returns validation errors, 
            they're displayed in a clean modal with proper formatting.
          </p>
          <p>
            <strong>3. Handles Both Formats:</strong> Works with both object-based 
            ({`{ errors: { name: ["required"] } }`}) and array-based 
            ({`{ errors: ["Name required"] }`}) error formats.
          </p>
          <p>
            <strong>4. Rapid Development:</strong> Frontend developers focus on UI only, 
            no need to duplicate backend validation logic.
          </p>
        </div>
      </div>
    </div>
  );
}