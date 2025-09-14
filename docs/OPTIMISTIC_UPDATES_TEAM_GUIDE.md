# Optimistic Updates - Team Standards & Guidelines

## 📋 Table of Contents

1. [Overview](#overview)
2. [When to Use Optimistic Updates](#when-to-use)
3. [Implementation Patterns](#implementation-patterns)
4. [Code Standards](#code-standards)
5. [Error Handling](#error-handling)
6. [Performance Guidelines](#performance-guidelines)
7. [Testing Strategies](#testing-strategies)
8. [Common Pitfalls](#common-pitfalls)
9. [Migration Guide](#migration-guide)
10. [Examples](#examples)

## 🎯 Overview

Optimistic updates provide immediate UI feedback by updating the interface before API responses, significantly improving user experience through faster perceived performance.

### ✅ Benefits

- **60-80% faster perceived performance**
- **Better user experience** - No loading delays for simple operations
- **Reduced network dependency** - UI responds immediately
- **Graceful error handling** - Automatic rollback on failures

### 📊 Performance Impact

```
Traditional Flow:  User Action → API Call → Wait → UI Update    (800ms-2s)
Optimistic Flow:   User Action → UI Update → API Call → Verify (50ms-100ms)
```

## 🎨 When to Use Optimistic Updates

### ✅ **Recommended For:**

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Form submissions with predictable responses
- ✅ Simple state changes (toggles, status updates)
- ✅ Operations with high success rates (>95%)
- ✅ User-initiated actions with immediate feedback expectations

### ❌ **Not Recommended For:**

- ❌ Complex calculations or validations
- ❌ Operations requiring server-side processing
- ❌ Payment processing or financial transactions
- ❌ Operations with low success rates (<90%)
- ❌ File uploads or media processing

## 🏗️ Implementation Patterns

### Pattern 1: Basic Hook-Based (Current Standard)

```typescript
// ✅ Good: Current pattern
const {
  categories,
  addCategoryOptimistic,
  updateCategoryOptimistic,
  removeCategoryOptimistic,
} = useCategories();

const handleCreate = async (data) => {
  const tempId = generateTempId();
  const optimisticItem = createOptimisticItem(data, tempId);

  try {
    addCategoryOptimistic(optimisticItem);
    const response = await createCategory(data);
    replaceTempOptimistic(tempId, response);
  } catch (error) {
    removeCategoryOptimistic(tempId);
    showErrorToast(error);
  }
};
```

### Pattern 2: Enhanced with React 19 useOptimistic (Future)

```typescript
// ✅ Future: React 19 pattern
const [optimisticCategories, addOptimistic] = useOptimistic(
  categories,
  (state, newCategory) => [...state, newCategory]
);

const handleCreate = async (data) => {
  addOptimistic(optimisticItem);

  try {
    await createCategory(data);
  } catch (error) {
    // React handles rollback automatically
    showErrorToast(error);
  }
};
```

## 📝 Code Standards

### 1. **File Structure**

```
/hooks/
  entity-hooks.ts              # Basic optimistic hooks
  entity-hooks-v2.ts           # Enhanced version (React 19 ready)

/components/
  error-boundary.tsx           # Error handling
  /toast/
    toast-provider.tsx         # Toast system
    use-optimistic-toasts.ts   # CRUD-specific toasts
  /loading/
    skeleton.tsx               # Loading components

/lib/types/
  optimistic.ts                # Shared types
```

### 2. **Naming Conventions**

```typescript
// ✅ Good: Consistent naming
const {
  items, // Main data array
  addItemOptimistic, // Add optimistic item
  updateItemOptimistic, // Update optimistic item
  removeItemOptimistic, // Remove optimistic item
  replaceTempOptimistic, // Replace temp with real
} = useItems();

// ✅ Good: Temporary ID patterns
const tempId = `temp-${Date.now()}`;
const isTempId = (id: string) => id.startsWith("temp-");

// ✅ Good: Operation types
type OperationType = "create" | "update" | "delete";
```

### 3. **Type Safety**

```typescript
// ✅ Good: Strong typing
interface OptimisticItem<T> {
  _isOptimistic?: boolean;
  _operationType?: "create" | "update" | "delete";
  _tempId?: string;
}

type OptimisticCategory = OptimisticItem<Category>;

// ✅ Good: Type guards
const isOptimisticItem = <T>(item: T): item is OptimisticItem<T> => {
  return "_isOptimistic" in item;
};
```

## ⚠️ Error Handling

### 1. **Standard Error Pattern**

```typescript
// ✅ Good: Complete error handling
const handleOperation = async (data) => {
  const tempId = generateTempId();
  const optimisticItem = createOptimisticItem(data);
  const originalState = getCurrentState();

  try {
    // 1. Optimistic update
    addOptimistic(optimisticItem);

    // 2. API call
    const response = await apiCall(data);

    // 3. Update with real data
    updateOptimistic(response);

    // 4. Success feedback
    showSuccessToast("Operation successful");
  } catch (error) {
    // 5. Rollback on error
    revertOptimistic(originalState);

    // 6. Error feedback
    showErrorToast("Operation failed");

    // 7. Re-enable retry
    enableRetry();

    // 8. Log error
    logger.error("Operation failed", { data, error });
  }
};
```

### 2. **Error Boundary Integration**

```typescript
// ✅ Good: Wrap components with error boundaries
export default function CategoriesPage() {
  return (
    <ComponentErrorBoundary>
      <CategoriesContent />
    </ComponentErrorBoundary>
  );
}
```

### 3. **Toast Integration**

```typescript
// ✅ Good: Use standardized toasts
const { createSuccess, createError, networkError } = useOptimisticToasts();

try {
  await createCategory(data);
  createSuccess("Category");
} catch (error) {
  if (error.code === "NETWORK_ERROR") {
    networkError();
  } else {
    createError("Category");
  }
}
```

## ⚡ Performance Guidelines

### 1. **Memoization Strategy**

```typescript
// ✅ Good: Memoize callbacks
const handleEdit = useCallback((item: Item) => {
  setEditingItem(item);
}, []);

const handleDelete = useCallback((id: string) => {
  setDeleteConfirm(id);
}, []);

// ✅ Good: Memoize derived state
const optimisticItems = useMemo(
  () => items.filter((item) => !isTempId(item.id)),
  [items]
);

// ✅ Good: Memoize components
const ItemRow = React.memo(({ item, onEdit, onDelete }) => {
  // Component implementation
});
```

### 2. **Loading States**

```typescript
// ✅ Good: Use skeleton components
{
  isLoading ? (
    <CategoryTableSkeleton rows={5} />
  ) : (
    <CategoryTable categories={categories} />
  );
}

// ✅ Good: Optimistic indicators
{
  isTempCategory && (
    <OptimisticOverlay isVisible={true}>
      <CategoryRow category={category} />
    </OptimisticOverlay>
  );
}
```

## 🧪 Testing Strategies

### 1. **Hook Testing**

```typescript
// ✅ Good: Test optimistic behavior
describe("useCategories optimistic updates", () => {
  it("should add item optimistically", async () => {
    const { result } = renderHook(() => useCategories());

    act(() => {
      result.current.addCategoryOptimistic(mockCategory);
    });

    expect(result.current.categories).toContain(mockCategory);
  });

  it("should rollback on error", async () => {
    const { result } = renderHook(() => useCategories());
    mockApi.createCategory.mockRejectedValue(new Error("API Error"));

    await act(async () => {
      try {
        await result.current.createCategory(mockData);
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.categories).not.toContain(mockCategory);
  });
});
```

### 2. **Component Testing**

```typescript
// ✅ Good: Test user interactions
describe("CategoriesPage", () => {
  it("should show optimistic feedback on create", async () => {
    render(<CategoriesPage />);

    fireEvent.click(screen.getByText("Add Category"));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByText("Create"));

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });
});
```

## 🚨 Common Pitfalls

### 1. **❌ Memory Leaks**

```typescript
// ❌ Bad: Cleanup not handled
useEffect(() => {
  const timeout = setTimeout(() => {
    removeOptimistic(tempId);
  }, 30000);
  // Missing cleanup!
}, []);

// ✅ Good: Proper cleanup
useEffect(() => {
  const timeout = setTimeout(() => {
    removeOptimistic(tempId);
  }, 30000);

  return () => clearTimeout(timeout);
}, []);
```

### 2. **❌ Race Conditions**

```typescript
// ❌ Bad: No request cancellation
const fetchData = async () => {
  const data = await api.getData();
  setData(data);
};

// ✅ Good: Request cancellation
const fetchData = useCallback(async () => {
  const abortController = new AbortController();

  try {
    const data = await api.getData({ signal: abortController.signal });
    setData(data);
  } catch (error) {
    if (error.name !== "AbortError") {
      handleError(error);
    }
  }

  return () => abortController.abort();
}, []);
```

### 3. **❌ Inconsistent State**

```typescript
// ❌ Bad: Direct state mutation
const updateItem = (id, changes) => {
  const item = items.find((i) => i.id === id);
  item.name = changes.name; // Mutation!
};

// ✅ Good: Immutable updates
const updateItem = (id, changes) => {
  setItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
  );
};
```

## 🔄 Migration Guide

### From Regular CRUD to Optimistic

1. **Step 1: Update Hook**

```typescript
// Before
const { categories, isLoading, error, refetch } = useCategories();

// After
const {
  categories,
  isLoading,
  error,
  addCategoryOptimistic,
  updateCategoryOptimistic,
  removeCategoryOptimistic,
} = useCategories();
```

2. **Step 2: Update Handlers**

```typescript
// Before
const handleCreate = async (data) => {
  await createCategory(data);
  refetch(); // Refetch all data
};

// After
const handleCreate = async (data) => {
  const tempItem = createOptimisticItem(data);
  addCategoryOptimistic(tempItem);

  try {
    const response = await createCategory(data);
    replaceTempOptimistic(tempItem.id, response);
  } catch (error) {
    removeCategoryOptimistic(tempItem.id);
    handleError(error);
  }
};
```

3. **Step 3: Add Visual Feedback**

```typescript
// Add optimistic indicators
{
  item._isOptimistic && (
    <span className="text-blue-600 text-xs">Saving...</span>
  );
}

// Disable actions on temp items
<button disabled={isTempItem(item)} onClick={() => handleEdit(item)}>
  Edit
</button>;
```

## 📚 Examples

### Complete Category Management Example

```typescript
"use client";

import React, { useState, useCallback } from "react";
import { useCategories, useCreateCategory } from "@/hooks/categories-hooks";
import { useOptimisticToasts } from "@/components/toast";
import { ComponentErrorBoundary } from "@/components/error-boundary";
import { CategoryTableSkeleton } from "@/components/loading";

export default function CategoriesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    categories,
    isLoading,
    addCategoryOptimistic,
    removeCategoryOptimistic,
    replaceTempCategoryOptimistic,
  } = useCategories();

  const { createCategory } = useCreateCategory();
  const { createSuccess, createError } = useOptimisticToasts();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticCategory = {
        _id: tempId,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        addCategoryOptimistic(optimisticCategory);
        setShowCreateModal(false);

        const response = await createCategory({
          category: {
            name: optimisticCategory.name,
            description: optimisticCategory.description,
            is_active: true,
            parent_id: null,
          },
        });

        replaceTempCategoryOptimistic(tempId, response);
        createSuccess("Category");
      } catch (error) {
        removeCategoryOptimistic(tempId);
        setShowCreateModal(true);
        createError("Category");
      }
    },
    [
      addCategoryOptimistic,
      removeCategoryOptimistic,
      replaceTempCategoryOptimistic,
      createCategory,
      createSuccess,
      createError,
    ]
  );

  return (
    <ComponentErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Categories</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Add Category
          </button>
        </div>

        {isLoading ? (
          <CategoryTableSkeleton rows={5} />
        ) : (
          <CategoriesTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showCreateModal && (
          <CreateModal
            onSubmit={handleCreate}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </ComponentErrorBoundary>
  );
}
```

## 🎯 Team Checklist

### ✅ Implementation Checklist

- [ ] **Hook Implementation**

  - [ ] Basic CRUD operations with optimistic updates
  - [ ] Proper temporary ID management
  - [ ] Error rollback functionality
  - [ ] Type safety with TypeScript

- [ ] **UI/UX Implementation**

  - [ ] Loading skeleton components
  - [ ] Optimistic visual indicators
  - [ ] Toast notifications for feedback
  - [ ] Disabled states for temporary items

- [ ] **Error Handling**

  - [ ] Error boundary integration
  - [ ] Graceful error recovery
  - [ ] Retry mechanisms
  - [ ] Proper error logging

- [ ] **Performance**

  - [ ] React.memo for components
  - [ ] useCallback for handlers
  - [ ] useMemo for derived state
  - [ ] Cleanup timeouts and effects

- [ ] **Testing**
  - [ ] Unit tests for hooks
  - [ ] Integration tests for components
  - [ ] Error scenario testing
  - [ ] Performance testing

### 🔍 Code Review Checklist

- [ ] **Optimistic Updates**

  - [ ] Temporary IDs generated correctly
  - [ ] Rollback logic implemented
  - [ ] Visual feedback provided
  - [ ] Error handling complete

- [ ] **Performance**

  - [ ] Unnecessary re-renders prevented
  - [ ] Memory leaks avoided
  - [ ] Loading states implemented
  - [ ] Race conditions handled

- [ ] **User Experience**
  - [ ] Immediate feedback provided
  - [ ] Error messages clear and actionable
  - [ ] Loading states meaningful
  - [ ] Retry options available

---

## 🚀 Summary

Optimistic updates provide significant UX improvements when implemented correctly. Follow these patterns and guidelines to ensure consistent, reliable, and performant implementations across the team.

**Key Principles:**

1. **Immediate feedback** - Update UI first
2. **Graceful recovery** - Rollback on errors
3. **Clear communication** - Visual indicators and toasts
4. **Type safety** - Strong TypeScript integration
5. **Performance first** - Memoization and cleanup

For questions or clarifications, refer to the implementation examples or reach out to the team leads.
