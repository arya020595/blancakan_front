# Form Quick Reference

Quick reference for implementing forms using our standard stack.

## 🚀 Quick Start Checklist

- [ ] Create Zod schema in `src/lib/schemas/`
- [ ] Export type using `z.infer<typeof schema>`
- [ ] Create form component using shadcn/ui FormField
- [ ] Use FormShell with zodResolver
- [ ] Add to page with proper error handling

## 📝 Basic Form Template

### 1. Schema Template

```typescript
import { z } from "zod";

export const [name]Schema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type [Name]FormValues = z.infer<typeof [name]Schema>;
```

### 2. Form Component Template

```tsx
"use client";

import { [Name]FormValues } from "@/lib/schemas/[name]-schema";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function [Name]Form({ isSubmitting }: { isSubmitting?: boolean }) {
  const form = useFormContext<[Name]FormValues>();

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name *</FormLabel>
          <FormControl>
            <Input placeholder="Enter name" disabled={isSubmitting} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### 3. Page Integration Template

```tsx
import { [name]Schema, [Name]FormValues } from "@/lib/schemas/[name]-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormShell } from "@/components/forms/form-shell";
import { [Name]Form } from "@/components/[name]/forms/[name]-form";

<FormShell<[Name]FormValues>
  resolver={zodResolver([name]Schema)}
  onSubmit={handleSubmit}
  defaultValues={{ name: "", description: "", is_active: true }}
>
  <[Name]Form isSubmitting={isSubmitting} />
</FormShell>
```

## 🎯 Common Field Patterns

### Text Input

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name *</FormLabel>
      <FormControl>
        <Input placeholder="Enter name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Textarea

```tsx
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea placeholder="Enter description" rows={3} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Number Input

```tsx
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
          {...field}
          onChange={(e) =>
            field.onChange(
              e.target.value === "" ? 0 : parseInt(e.target.value, 10)
            )
          }
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox

```tsx
<FormField
  control={form.control}
  name="is_active"
  render={({ field }) => (
    <FormItem className="flex flex-row items-end space-x-3 space-y-0">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active</FormLabel>
      </div>
    </FormItem>
  )}
/>
```

## 🔍 Common Validation Patterns

### Required String

```typescript
name: z.string().min(1, "Name is required").trim();
```

### Optional String (handles empty)

```typescript
description: z.string().optional().or(z.literal(""));
```

### Email

```typescript
email: z.string().email("Invalid email address");
```

### URL

```typescript
website: z.string().url("Invalid URL").optional().or(z.literal(""));
```

### Number with Range

```typescript
age: z.number().int().min(0).max(120);
```

### String with Pattern

```typescript
username: z.string().regex(/^[a-zA-Z0-9_]+$/, "Invalid username format");
```

### Custom Validation

```typescript
name: z.string().refine((val) => val !== "admin", "Name cannot be 'admin'");
```

## ⚠️ Common Issues & Solutions

| Issue                            | Solution                                          |
| -------------------------------- | ------------------------------------------------- |
| TypeScript field errors          | Ensure schema field names match exactly           |
| Form not validating              | Add `resolver={zodResolver(schema)}` to FormShell |
| Number fields as strings         | Use custom onChange with parseInt                 |
| Empty strings failing validation | Use `.optional().or(z.literal(""))`               |
| Checkbox not updating            | Use `onCheckedChange` not `onChange`              |

## 📚 Need More Detail?

See [FORM_IMPLEMENTATION.md](FORM_IMPLEMENTATION.md) for complete documentation.
