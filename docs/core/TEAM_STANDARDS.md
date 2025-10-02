# Team Development Standards

## Optimistic Updates Pattern - Official Team Standard

### Overview

This document establishes the official team standards for implementing optimistic updates in our Next.js application. The pattern used in `src/app/dashboard/categories/page.tsx` is our **approved standard** for all CRUD operations.

### Why Optimistic Updates?

✅ **Industry Best Practice** - Used by Twitter, Facebook, Gmail, and all modern apps  
✅ **React 18/19 Official Pattern** - Supported by React team with `useOptimistic` hook  
✅ **Next.js Recommended** - Official Next.js documentation recommends this pattern  
✅ **Superior UX** - Immediate feedback, perceived performance improvement  
✅ **Error Resilient** - Automatic rollback on failures

## Implementation Standards

### 1. Hook Architecture (REQUIRED)

```typescript
// ✅ Correct: Use custom hooks for all CRUD operations
const {
  items,
  addItemOptimistic,
  updateItemOptimistic,
  removeItemOptimistic,
  replaceItemOptimistic,
} = useItems();

// ❌ Wrong: Direct API calls in components
const response = await fetch("/api/items", { method: "POST" });
```

### 2. Temporary ID Pattern (REQUIRED)

```typescript
// ✅ Correct: Use temp- prefix for optimistic items
const tempId = `temp-${Date.now()}`;
const optimisticItem = { _id: tempId, ...itemData };

// ✅ Correct: Check for temporary items
const isTempItem = item._id.startsWith("temp-");

// ❌ Wrong: Using random UUIDs or no temp identification
```

### 3. Performance Optimization (REQUIRED)

```typescript
// ✅ Correct: Memoize components and callbacks
const TableRow = React.memo(({ item, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);
  return <tr>...</tr>;
});

// ✅ Correct: Memoize expensive computations
const tableContent = useMemo(() => {
  return items.map((item) => <TableRow key={item._id} item={item} />);
}, [items]);

// ❌ Wrong: Creating new functions on every render
```

### 4. Error Handling (REQUIRED)

```typescript
// ✅ Correct: Rollback on error with user feedback
try {
  addItemOptimistic(optimisticItem);
  const response = await createItem(itemData);
  replaceItemOptimistic(tempId, response);
  showSuccessToast("Item created!");
} catch (error) {
  removeItemOptimistic(tempId);
  showErrorToast("Failed to create item");
}

// ❌ Wrong: No rollback or user feedback
```

### 5. Component Structure (REQUIRED)

```typescript
// ✅ Correct: Wrap pages in error boundaries
export default function ItemsPage() {
  return <ComponentErrorBoundary>{/* page content */}</ComponentErrorBoundary>;
}

// ✅ Correct: Use centralized toast system
const { showToast } = useOptimisticToasts();
```

## File Structure Standards

### Required Files for New Features

```
src/hooks/[feature]-hooks.ts          # Custom hooks with optimistic logic
src/components/[feature]/             # Feature-specific components
src/lib/api/services/[feature]-service.ts  # API service layer
src/lib/types/[feature].ts           # TypeScript interfaces
```

### Component Organization

```typescript
// ✅ Correct: Separate concerns
const TableRow = React.memo(({ item, onEdit, onDelete }) => {
  /* ... */
});
const LoadingRow = React.memo(() => {
  /* ... */
});
const EmptyState = React.memo(() => {
  /* ... */
});

export default function ItemsPage() {
  // Main component logic
}
```

## Code Quality Standards

### TypeScript (REQUIRED)

- All components must be fully typed
- Use discriminated unions for state management
- Implement proper error types
- No `any` types in production code

### Performance (REQUIRED)

- Use `React.memo` for list items and frequently re-rendered components
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive computations
- Implement proper key props for list items

### Error Handling (REQUIRED)

- Wrap all pages in `ComponentErrorBoundary`
- Implement optimistic rollback for all mutations
- Provide user feedback for all operations
- Log errors with context for debugging

### Testing Requirements

- Unit tests for all custom hooks
- Integration tests for optimistic operations
- E2E tests for critical user flows
- Error boundary testing

## Migration Guidelines

### For Existing Code

1. **Audit Current Implementation**: Identify non-optimistic CRUD operations
2. **Create Custom Hooks**: Move API logic to custom hooks with optimistic patterns
3. **Add Error Boundaries**: Wrap components in error boundaries
4. **Implement Toast System**: Replace alert() with centralized toast notifications
5. **Performance Optimization**: Add memoization to frequently rendered components

### For New Features

1. **Start with Hook Design**: Design the optimistic hook first
2. **Implement Error Boundaries**: Add error handling from the beginning
3. **Use Reusable Components**: Leverage existing toast, skeleton, and error components
4. **Follow Naming Conventions**: Use consistent file and function naming

## Code Review Checklist

### Optimistic Updates ✅

- [ ] Uses custom hook for API operations
- [ ] Implements temporary ID pattern
- [ ] Has proper rollback on errors
- [ ] Provides user feedback

### Performance ✅

- [ ] Components are memoized where appropriate
- [ ] Callbacks are memoized with useCallback
- [ ] Expensive operations use useMemo
- [ ] List items have stable keys

### Error Handling ✅

- [ ] Page wrapped in error boundary
- [ ] Errors are caught and handled
- [ ] User receives feedback on errors
- [ ] Errors are logged for debugging

### TypeScript ✅

- [ ] All props and state are typed
- [ ] No any types used
- [ ] Interfaces are properly defined
- [ ] Type guards are used where needed

## Examples and References

### Reference Implementation

- **File**: `src/app/dashboard/categories/page.tsx`
- **Hook**: `src/hooks/categories-hooks.ts`
- **Types**: `src/lib/types/optimistic.ts`

### Related Documentation

- `docs/optimistic-updates-summary.md` - Technical deep dive
- `docs/guides/BEST_PRACTICES.md` - General development practices
- `docs/examples/COMPONENT_EXAMPLES.md` - Reusable component examples

---

**Last Updated**: September 2025  
**Status**: Official Team Standard  
**Approval**: Required for all new features and major refactors
