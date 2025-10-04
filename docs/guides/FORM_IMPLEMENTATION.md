# Form Implementation Guide

A comprehensive guide to implementing forms using Zod validation, React Hook Form, and shadcn/ui components in our Next.js application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [The Flow](#the-flow)
3. [Implementation Steps](#implementation-steps)
4. [Complete Example](#complete-example)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Modal Integration](#modal-integration)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

Our form architecture uses a layered approach:

```
┌─────────────────────────────────────┐
│           Page Component            │ ← Handles business logic & API calls
├─────────────────────────────────────┤
│            FormShell               │ ← Provides form context & submit handling
├─────────────────────────────────────┤
│          Form Component             │ ← Contains form fields (UI only)
├─────────────────────────────────────┤
│         shadcn/ui Components        │ ← FormField, Input, Textarea, etc.
├─────────────────────────────────────┤
│         Zod Schema + Types          │ ← Validation rules & TypeScript types
└─────────────────────────────────────┘
```

### Key Libraries

- **Zod**: Schema validation and type generation
- **React Hook Form**: Form state management and validation
- **shadcn/ui**: Consistent UI components with accessibility
- **@hookform/resolvers/zod**: Integration between Zod and React Hook Form

## The Flow

### 1. Schema Definition

```typescript
// Define validation rules and generate types
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type UserFormValues = z.infer<typeof userSchema>;
```

### 2. Form Component

```tsx
// Pure UI component with form fields
function UserForm() {
  const form = useFormContext<UserFormValues>();
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### 3. Form Shell Integration

```tsx
// Wrapper that provides form context and validation
<FormShell<UserFormValues>
  resolver={zodResolver(userSchema)}
  onSubmit={handleSubmit}
  defaultValues={{ name: "", email: "" }}>
  <UserForm />
</FormShell>
```

### 4. Page Integration

```tsx
// Business logic and API integration
function UserPage() {
  const handleSubmit = async (data: UserFormValues) => {
    await createUser(data);
  };

  return (
    <FormShell<UserFormValues>
      resolver={zodResolver(userSchema)}
      onSubmit={handleSubmit}
      defaultValues={{ name: "", email: "" }}>
      <UserForm />
    </FormShell>
  );
}
```

## Implementation Steps

### Step 1: Create Zod Schema

Create a schema file in `src/lib/schemas/`:

```typescript
// src/lib/schemas/user-schema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim(),

  age: z
    .number()
    .int("Age must be a whole number")
    .min(0, "Age must be positive")
    .max(120, "Age must be realistic"),

  description: z
    .string()
    .max(300, "Description must be less than 300 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  is_active: z.boolean(),
});

// Export the inferred type
export type UserFormValues = z.infer<typeof userSchema>;
```

### Step 2: Create Form Component

Create form component in appropriate feature directory:

```tsx
// src/components/users/forms/user-form.tsx
"use client";

import { UserFormValues } from "@/lib/schemas/user-schema";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export interface UserFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

/**
 * UserForm: fields-only component using shadcn/ui Form components.
 * Must be rendered inside FormShell(FormProvider).
 */
export function UserForm({ mode, isSubmitting }: UserFormProps) {
  const form = useFormContext<UserFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter user name"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter email address"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="120"
                placeholder="Enter age"
                disabled={isSubmitting}
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? 0 : parseInt(value, 10));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter description (optional)"
                disabled={isSubmitting}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Active</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}

export default UserForm;
```

### Step 3: Integrate in Page

```tsx
// src/app/dashboard/users/page.tsx
"use client";

import { UserForm } from "@/components/users/forms/user-form";
import { userSchema, type UserFormValues } from "@/lib/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormShell } from "@/components/forms/form-shell";
import { useCreateUser, useUpdateUser } from "@/hooks/user-hooks";
import Modal from "@/components/ui/modal";
import { useState } from "react";

export default function UsersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const handleCreate = async (data: UserFormValues) => {
    try {
      await createUser(data);
      setShowCreateModal(false);
      // Handle success (e.g., show toast, refresh data)
    } catch (error) {
      // Handle error
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowCreateModal(true)}>Create User</button>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User">
        <FormShell<UserFormValues>
          defaultValues={{
            name: "",
            email: "",
            age: 0,
            description: "",
            is_active: true,
          }}
          resolver={zodResolver(userSchema)}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          submitLabel="Create User"
          onCancel={() => setShowCreateModal(false)}>
          <UserForm mode="create" isSubmitting={isCreating} />
        </FormShell>
      </Modal>
    </div>
  );
}
```

## Complete Example

Here's the complete flow for a Role management form:

### 1. Schema (`src/lib/schemas/role-schema.ts`)

```typescript
import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be less than 50 characters")
    .trim()
    .refine(
      (name) => /^[a-zA-Z0-9\s\-_]+$/.test(name),
      "Role name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
```

### 2. Form Component (`src/components/roles/forms/role-form.tsx`)

```tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RoleFormValues } from "@/lib/schemas/role-schema";
import { useFormContext } from "react-hook-form";

export interface RoleFormProps {
  mode: "create" | "edit";
  isSubmitting?: boolean;
}

export function RoleForm({ mode, isSubmitting }: RoleFormProps) {
  const form = useFormContext<RoleFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter role name"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter role description (optional)"
                disabled={isSubmitting}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
```

### 3. Page Integration (`src/app/dashboard/roles/page.tsx`)

```tsx
"use client";

import { RoleForm } from "@/components/roles/forms/role-form";
import { roleSchema, type RoleFormValues } from "@/lib/schemas/role-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormShell } from "@/components/forms/form-shell";
// ... other imports

export default function RolesPage() {
  const handleCreate = async (data: RoleFormValues) => {
    // API call logic
  };

  return (
    <FormShell<RoleFormValues>
      defaultValues={{
        name: "",
        description: "",
      }}
      resolver={zodResolver(roleSchema)}
      onSubmit={handleCreate}
      isSubmitting={isCreating}
      submitLabel="Create Role">
      <RoleForm mode="create" isSubmitting={isCreating} />
    </FormShell>
  );
}
```

## Best Practices

### 1. Schema Design

- **Always use `.trim()`** for string fields to remove whitespace
- **Use specific error messages** instead of generic ones
- **Use `.optional().or(z.literal(""))` for optional strings** to handle empty form fields
- **Group related validations** and add comments for complex rules

### 2. Form Components

- **Keep forms pure UI components** - no API calls or business logic
- **Use TypeScript generics** for type safety
- **Always accept `isSubmitting` prop** to disable fields during submission
- **Use semantic field names** that match your API

### 3. Performance

- **Use `mode: "onSubmit"`** in FormShell for better performance
- **Avoid unnecessary re-renders** by keeping form components lightweight
- **Use `React.memo`** for complex form components if needed

### 4. Accessibility

- **Always provide labels** using FormLabel
- **Use proper input types** (email, number, url, etc.)
- **Provide clear error messages** that explain how to fix issues
- **Use proper ARIA attributes** (handled automatically by shadcn/ui)

## Common Patterns

### Optional Fields with Empty String Handling

```typescript
description: z
  .string()
  .max(300, "Description must be less than 300 characters")
  .trim()
  .optional()
  .or(z.literal("")),
```

### Number Fields with Proper Validation

```typescript
age: z
  .number()
  .int("Age must be a whole number")
  .min(0, "Age must be positive")
  .max(120, "Age must be realistic"),
```

### Complex String Validation

```typescript
username: z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
  .refine(
    async (username) => {
      // Custom async validation
      const isAvailable = await checkUsernameAvailability(username);
      return isAvailable;
    },
    "Username is already taken"
  ),
```

### Checkbox Fields

```tsx
<FormField
  control={form.control}
  name="is_active"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={isSubmitting}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active</FormLabel>
      </div>
    </FormItem>
  )}
/>
```

### Number Input with Proper Type Conversion

```tsx
<FormField
  control={form.control}
  name="sort_order"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Sort Order</FormLabel>
      <FormControl>
        <Input
          type="number"
          min="0"
          max="999"
          placeholder="Enter sort order"
          disabled={isSubmitting}
          {...field}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value === "" ? 0 : parseInt(value, 10));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Conditional Fields

```tsx
<FormField
  control={form.control}
  name="type"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Type</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;

{
  /* Show additional fields based on selection */
}
{
  form.watch("type") === "premium" && (
    <FormField
      control={form.control}
      name="premium_features"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Premium Features</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

## Modal Integration

Our Modal component is designed to work seamlessly with forms and supports vertical scrolling for long content.

### Basic Modal with Form

```tsx
// Modal with form integration
<Modal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  title="Create New User">
  <FormShell<UserFormValues>
    resolver={zodResolver(userSchema)}
    onSubmit={handleSubmit}
    defaultValues={{ name: "", email: "", is_active: true }}
    submitLabel="Create User"
    onCancel={() => setShowCreateModal(false)}>
    <UserForm mode="create" isSubmitting={isSubmitting} />
  </FormShell>
</Modal>
```

### Scrollable Modal Features

The Modal component automatically handles:

- **Vertical Scrolling**: Content that exceeds viewport height becomes scrollable
- **Fixed Header**: Title and close button remain visible during scroll
- **Fixed Footer**: FormShell buttons stay at bottom during scroll
- **Responsive Height**: Maximum height is `calc(100vh - 2rem)` with proper padding

### Modal Structure

```
┌─────────────────────────────────────┐
│           Fixed Header              │ ← Title + Close Button
├─────────────────────────────────────┤
│                                     │
│                                     │ ← Scrollable Content Area
│          Form Content               │   (overflow-y-auto)
│                                     │
│                                     │
├─────────────────────────────────────┤
│           Fixed Footer              │ ← FormShell Buttons
└─────────────────────────────────────┘
```

### Large Form Example

For forms with many fields, the modal automatically provides scrolling:

```tsx
// Example with many fields
<Modal
  isOpen={showModal}
  onClose={closeModal}
  title="Detailed User Form"
  size="lg"> {/* Use "lg" for wider forms */}
  <FormShell<DetailedUserFormValues>
    resolver={zodResolver(detailedUserSchema)}
    onSubmit={handleSubmit}
    defaultValues={{...}}>
    {/* This form has 15+ fields - modal will scroll automatically */}
    <DetailedUserForm mode="create" />
  </FormShell>
</Modal>
```

### Modal Sizes

Choose appropriate size based on form complexity:

- **`size="sm"`** - Simple forms (1-3 fields)
- **`size="md"`** - Standard forms (4-8 fields) - Default
- **`size="lg"`** - Complex forms (9+ fields or wide inputs)

### Best Practices for Modal Forms

1. **Use appropriate sizing**: Large forms should use `size="lg"`
2. **Keep titles concise**: They remain visible during scroll
3. **Group related fields**: Use logical field ordering
4. **Test scrolling**: Verify all fields are accessible on mobile devices
5. **Consider field count**: Very long forms (20+ fields) might benefit from multi-step approach

### Modal Without Title

For cases where you don't need a title:

```tsx
<Modal isOpen={showModal} onClose={closeModal}>
  {" "}
  {/* No title prop */}
  <FormShell>
    <UserForm />
  </FormShell>
</Modal>
```

The close button automatically positions in the top-right corner when no title is provided.

## Troubleshooting

### Common Issues

#### 1. "Property does not exist on type" errors

**Problem**: TypeScript errors when accessing form fields
**Solution**: Ensure your schema and form types match exactly

```typescript
// ❌ Wrong - field names don't match
const schema = z.object({ userName: z.string() });
<Input {...register("username")} />; // TypeScript error

// ✅ Correct - field names match
const schema = z.object({ username: z.string() });
<Input {...register("username")} />; // Works correctly
```

#### 2. Form not validating

**Problem**: Form submits without validation
**Solution**: Ensure zodResolver is properly configured

```tsx
// ❌ Missing resolver
<FormShell onSubmit={handleSubmit}>

// ✅ With resolver
<FormShell
  resolver={zodResolver(userSchema)}
  onSubmit={handleSubmit}
>
```

#### 3. Number fields showing string values

**Problem**: Number inputs return strings instead of numbers
**Solution**: Use proper type conversion in onChange

```tsx
// ❌ Without conversion
<Input type="number" {...field} />

// ✅ With conversion
<Input
  type="number"
  {...field}
  onChange={(e) => {
    const value = e.target.value;
    field.onChange(value === "" ? 0 : parseInt(value, 10));
  }}
/>
```

#### 4. Optional fields validation issues

**Problem**: Empty strings failing validation on optional fields
**Solution**: Use `.optional().or(z.literal(""))` pattern

```typescript
// ❌ Will fail on empty string
description: z.string().optional(),

// ✅ Handles empty strings correctly
description: z.string().optional().or(z.literal("")),
```

#### 5. Checkbox not updating

**Problem**: Checkbox doesn't change when clicked
**Solution**: Use `onCheckedChange` instead of `onChange`

```tsx
// ❌ Wrong event handler
<Checkbox
  checked={field.value}
  onChange={field.onChange}
/>

// ✅ Correct event handler
<Checkbox
  checked={field.value}
  onCheckedChange={field.onChange}
/>
```

### Debugging Tips

1. **Use React DevTools** to inspect form state
2. **Add console.logs** in schema validation to debug validation rules
3. **Check network tab** to see what data is being sent to API
4. **Use TypeScript strict mode** to catch type issues early
5. **Test edge cases** like empty strings, very long text, special characters

## File Structure

```
src/
├── lib/schemas/
│   ├── index.ts              # Re-exports all schemas
│   ├── common.ts             # Shared validation helpers
│   ├── user-schema.ts        # User form validation
│   ├── role-schema.ts        # Role form validation
│   └── category-schema.ts    # Category form validation
├── components/
│   ├── forms/
│   │   └── form-shell.tsx    # Reusable form wrapper
│   ├── ui/                   # shadcn/ui components
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── checkbox.tsx
│   └── [feature]/forms/
│       └── [feature]-form.tsx # Feature-specific form
└── app/dashboard/[feature]/
    └── page.tsx              # Page with form integration
```

This guide provides everything you need to implement consistent, type-safe, and accessible forms in your Next.js application using our established patterns and libraries.
