# Backend Error Display Pattern Blueprint

This document describes a reusable pattern for displaying backend validation errors in modals/dialogs, perfect for rapid frontend development where you want to focus on UI without duplicating backend validation logic.

## Overview

The pattern consists of:

1. **ErrorModal Component** - Reusable modal for displaying errors
2. **useErrorModal Hook** - State management for error display
3. **Error Utilities** - Helper functions for different error formats
4. **Integration Pattern** - How to use in forms and pages

## Core Philosophy

- **Backend-First Validation**: Let backend handle all validation logic
- **UI-Only Frontend**: Frontend focuses purely on user interface
- **Error Display**: Show backend errors in a user-friendly way
- **Rapid Development**: Minimal client-side validation code

## Files Created

```
src/
├── components/ui/
│   └── error-modal.tsx           # Reusable error display modal
├── hooks/
│   └── use-error-modal.ts        # Error state management hook
├── lib/utils/
│   └── error-utils.ts            # Error formatting utilities
└── components/examples/
    └── simple-form-with-error-modal.tsx  # Usage example
```

## Supported Error Formats

### Object Format (Field-Specific Errors)
```json
{
  "status": "error",
  "message": "Role creation failed",
  "errors": {
    "name": ["must be filled"],
    "email": ["is invalid", "has already been taken"],
    "password": ["must be at least 8 characters"]
  }
}
```

### Array Format (General Errors)
```json
{
  "status": "error", 
  "message": "Role creation failed",
  "errors": [
    "Name has already been taken",
    "Description can't be blank"
  ]
}
```

## Basic Usage

### 1. Import Required Components

```tsx
import ErrorModal from "@/components/ui/error-modal";
import { useErrorModal } from "@/hooks/use-error-modal";
import { normalizeError } from "@/lib/utils/error-utils";
```

### 2. Setup Hook

```tsx
function MyForm() {
  const { error, isErrorModalOpen, showError, closeError } = useErrorModal();
  
  // ... rest of component
}
```

### 3. Handle API Errors

```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    setShowModal(false); // Close form on success
  } catch (error) {
    // Show backend validation errors
    const validationError = normalizeError(error, "Failed to submit form");
    showError(validationError);
  }
};
```

### 4. Render Error Modal

```tsx
return (
  <>
    {/* Your form modal */}
    <Modal isOpen={showFormModal} onClose={closeForm}>
      {/* Form content */}
    </Modal>
    
    {/* Error display modal */}
    <ErrorModal
      isOpen={isErrorModalOpen}
      onClose={closeError}
      error={error}
      title="Validation Error"
    />
  </>
);
```

## Advanced Usage

### Custom Error Titles

```tsx
<ErrorModal
  isOpen={isErrorModalOpen}
  onClose={closeError}
  error={error}
  title="Category Creation Failed"
/>
```

### Disable Close Button

```tsx
<ErrorModal
  isOpen={isErrorModalOpen}
  onClose={closeError}
  error={error}
  showCloseButton={false}
/>
```

### Programmatic Error Creation

```tsx
import { createValidationError, createFieldValidationError } from "@/lib/utils/error-utils";

// Simple error
const simpleError = createValidationError("Something went wrong");
showError(simpleError);

// Field-specific errors
const fieldError = createFieldValidationError("Validation failed", {
  name: "is required",
  email: ["is invalid", "already taken"]
});
showError(fieldError);
```

## Integration Examples

### With FormShell Pattern

```tsx
function CategoryPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { error, isErrorModalOpen, showError, closeError } = useErrorModal();
  const { createCategory, isLoading } = useCreateCategory();

  const handleCreate = async (data: CategoryFormValues) => {
    try {
      await createCategory(data);
      setShowCreateModal(false);
    } catch (error) {
      showError(normalizeError(error));
    }
  };

  return (
    <>
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <FormShell onSubmit={handleCreate} isSubmitting={isLoading}>
          <CategoryForm mode="create" />
        </FormShell>
      </Modal>
      
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={error}
      />
    </>
  );
}
```

### With Multiple Operations

```tsx
function MultiOperationPage() {
  const { error, isErrorModalOpen, showError, closeError } = useErrorModal();

  const handleCreate = async (data) => {
    try {
      await createItem(data);
    } catch (error) {
      showError(normalizeError(error, "Failed to create item"));
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateItem(data);
    } catch (error) {
      showError(normalizeError(error, "Failed to update item"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
    } catch (error) {
      showError(normalizeError(error, "Failed to delete item"));
    }
  };

  // Single error modal handles all operations
  return (
    <>
      {/* Multiple forms/modals */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={error}
      />
    </>
  );
}
```

## Utility Functions

### Error Type Checking

```tsx
import { isObjectFormatError, isArrayFormatError } from "@/lib/utils/error-utils";

if (isObjectFormatError(error)) {
  // Handle field-specific errors
  console.log("Fields with errors:", Object.keys(error.errors));
}

if (isArrayFormatError(error)) {
  // Handle general errors
  console.log("Error messages:", error.errors);
}
```

### Error Information Extraction

```tsx
import { 
  extractAllErrorMessages, 
  getFirstErrorMessage, 
  getErrorCount,
  hasFieldError,
  getFieldErrors 
} from "@/lib/utils/error-utils";

// Get all error messages as flat array
const allMessages = extractAllErrorMessages(error);

// Get just the first error message
const firstMessage = getFirstErrorMessage(error);

// Count total errors
const count = getErrorCount(error);

// Check specific field errors (object format only)
if (hasFieldError(error, "email")) {
  const emailErrors = getFieldErrors(error, "email");
}
```

## Best Practices

### 1. Keep Forms Simple
```tsx
// ✅ Good: Field-only form component
function CategoryForm({ mode, isSubmitting }) {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <input {...register("name")} />
      {errors.name && <span>Name is required</span>}
    </div>
  );
}

// ❌ Bad: Form with API calls and complex error handling
function CategoryForm({ onSubmit, onError }) {
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (data) => {
    try {
      const result = await fetch('/api/categories', { ... });
      // Complex error handling logic
    } catch (error) {
      // Error parsing and setting
    }
  };
  
  // Complex validation logic
}
```

### 2. Centralized Error Handling

```tsx
// ✅ Good: One error modal per page/section
function Page() {
  const { showError } = useErrorModal();
  
  // All operations use the same error display
  const handleCreate = () => { /* use showError */ };
  const handleUpdate = () => { /* use showError */ };
  const handleDelete = () => { /* use showError */ };
}

// ❌ Bad: Multiple error handling mechanisms
function Page() {
  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  // Multiple error states and displays
}
```

### 3. Consistent Error Normalization

```tsx
// ✅ Good: Always normalize errors
try {
  await apiCall();
} catch (error) {
  const validationError = normalizeError(error, "Operation failed");
  showError(validationError);
}

// ❌ Bad: Inconsistent error handling
try {
  await apiCall();
} catch (error) {
  if (error.response?.data?.errors) {
    showError(error.response.data);
  } else {
    alert("Something went wrong");
  }
}
```

### 4. Meaningful Error Messages

```tsx
// ✅ Good: Specific fallback messages
const handleCreate = async (data) => {
  try {
    await createCategory(data);
  } catch (error) {
    showError(normalizeError(error, "Failed to create category"));
  }
};

// ❌ Bad: Generic error messages
const handleCreate = async (data) => {
  try {
    await createCategory(data);
  } catch (error) {
    showError(normalizeError(error, "Error"));
  }
};
```

## Accessibility Features

The ErrorModal component includes:

- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`)
- Focus management (traps focus within modal)
- Keyboard navigation (ESC to close)
- Screen reader friendly error descriptions
- Color contrast compliant error indicators

## Styling Customization

The error modal uses Tailwind classes and can be customized:

```tsx
// Custom error modal with different styling
<ErrorModal
  isOpen={isErrorModalOpen}
  onClose={closeError}
  error={error}
  title="Custom Title"
  className="custom-error-modal" // If you add className prop
/>
```

For different error severity levels, you can create variants:

```tsx
// Warning modal
<ErrorModal
  isOpen={isWarningModalOpen}
  onClose={closeWarning}
  error={warningError}
  title="Warning"
  severity="warning" // If you add severity prop
/>
```

## TypeScript Integration

The pattern is fully typed:

```tsx
import type { ValidationError } from "@/components/ui/error-modal";

// Custom error handling function
function handleApiError(error: unknown): ValidationError {
  return normalizeError(error, "API request failed");
}

// Type-safe hook usage
const { 
  error,           // ValidationError | null
  isErrorModalOpen, // boolean
  showError,       // (error: ValidationError) => void
  closeError       // () => void
} = useErrorModal();
```

## Testing

Example test for the pattern:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { useErrorModal } from "@/hooks/use-error-modal";
import ErrorModal from "@/components/ui/error-modal";

function TestComponent() {
  const { error, isErrorModalOpen, showError, closeError } = useErrorModal();
  
  const handleShowError = () => {
    showError({
      status: "error",
      message: "Test error",
      errors: { name: ["is required"] }
    });
  };

  return (
    <>
      <button onClick={handleShowError}>Show Error</button>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={error}
      />
    </>
  );
}

test("shows error modal with field errors", () => {
  render(<TestComponent />);
  
  fireEvent.click(screen.getByText("Show Error"));
  
  expect(screen.getByText("Test error")).toBeInTheDocument();
  expect(screen.getByText("Name")).toBeInTheDocument();
  expect(screen.getByText("is required")).toBeInTheDocument();
});
```

## Migration from Existing Error Handling

### Before (Traditional Approach)
```tsx
function OldForm() {
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  
  const handleSubmit = async (data) => {
    setErrors({});
    setApiError("");
    
    try {
      await submitData(data);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setApiError("Something went wrong");
      }
    }
  };

  return (
    <form>
      {apiError && <div className="error">{apiError}</div>}
      <input name="name" />
      {errors.name && <span>{errors.name[0]}</span>}
      {/* Complex error display logic */}
    </form>
  );
}
```

### After (Error Modal Pattern)
```tsx
function NewForm() {
  const { error, isErrorModalOpen, showError, closeError } = useErrorModal();
  
  const handleSubmit = async (data) => {
    try {
      await submitData(data);
    } catch (error) {
      showError(normalizeError(error, "Failed to submit form"));
    }
  };

  return (
    <>
      <form>
        <input name="name" />
        {/* Simple form, no error display logic */}
      </form>
      
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeError}
        error={error}
      />
    </>
  );
}
```

## Performance Considerations

- Error modal only renders when needed (`isOpen` check)
- Uses React.memo for modal components to prevent unnecessary rerenders
- Error utilities are pure functions (can be memoized if needed)
- Hook uses useCallback for stable function references

## Conclusion

This pattern provides a clean, reusable way to handle backend validation errors without duplicating validation logic on the frontend. It promotes rapid development by allowing frontend developers to focus purely on UI while backend handles all validation concerns.

The pattern scales well from simple forms to complex multi-step workflows and provides consistent error display across your application.