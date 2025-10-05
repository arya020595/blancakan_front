# DataTable Quick Reference

**Fast reference for implementing DataTable in your module**

---

## ✅ Prerequisites

The nuqs adapter is already configured in `src/app/layout.tsx`. You're ready to go!

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Table Config (5 min)

```tsx
// src/app/dashboard/[module]/[module]-table-config.tsx
import type { YourType } from "@/lib/api/types";
import type { ColumnDef, FilterDef } from "@/components/ui/data-table";

export const yourColumns: ColumnDef<YourType>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (item) => new Date(item.created_at).toLocaleDateString(),
  },
];

export const yourFilters: FilterDef[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];
```

### Step 2: Update Page Component (10 min)

```tsx
// src/app/dashboard/[module]/page.tsx
"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTableParams } from "@/hooks/use-table-params";
import { useYourQuery } from "@/hooks/your-hooks";
import { yourColumns, yourFilters } from "./your-table-config";

export default function YourPage() {
  const { params } = useTableParams();

  const { data, isLoading, error } = useYourQuery({
    page: params.page,
    per_page: params.per_page,
    query: params.query || "*",
    sort: params.sort || "created_at:desc",
    filters: params.filter,
  });

  const items = data?.data ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Module</h1>
        <Button>Add Item</Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={yourColumns}
        data={items}
        meta={meta}
        isLoading={isLoading}
        error={error ? new Error(error.message) : null}
        searchable
        searchPlaceholder="Search..."
        filters={yourFilters}
        resourceName="item"
        actions={(item) => (
          <div className="flex gap-3">
            <Button variant="link" size="sm">
              Edit
            </Button>
            <Button variant="link" size="sm">
              Delete
            </Button>
          </div>
        )}
      />
    </div>
  );
}
```

### Step 3: Test (5 min)

- ✅ Search works and debounces
- ✅ Sort columns by clicking headers
- ✅ Filters update URL
- ✅ Pagination navigates correctly
- ✅ URL is shareable (copy/paste works)

---

## 📋 Common Patterns

### Custom Cell Rendering

```tsx
{
  key: 'status',
  header: 'Status',
  render: (item) => (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-medium",
      item.status === 'active'
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800'
    )}>
      {item.status}
    </span>
  ),
}
```

### Multi-Line Cell

```tsx
{
  key: 'user',
  header: 'User',
  render: (item) => (
    <div>
      <div className="font-medium">{item.name}</div>
      <div className="text-sm text-gray-500">{item.email}</div>
    </div>
  ),
}
```

### Action Buttons

```tsx
actions={(item) => (
  <div className="flex items-center gap-3">
    <Button
      variant="link"
      size="sm"
      onClick={() => handleEdit(item)}
      className="text-indigo-600 hover:text-indigo-900 h-auto p-0"
    >
      Edit
    </Button>
    <Button
      variant="link"
      size="sm"
      onClick={() => handleDelete(item)}
      className="text-red-600 hover:text-red-900 h-auto p-0"
    >
      Delete
    </Button>
  </div>
)}
```

---

## 🎛️ Filter Examples

### Select (Single Choice)

```tsx
{
  key: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ],
}
```

### Multi-Select

```tsx
{
  key: 'tags',
  label: 'Tags',
  type: 'multi-select',
  options: [
    { label: 'Web', value: 'web' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'API', value: 'api' },
  ],
}
```

### Date Range

```tsx
{
  key: 'created_date',
  label: 'Created Date',
  type: 'date-range',
}
```

### Boolean Toggle

```tsx
{
  key: 'is_featured',
  label: 'Featured Only',
  type: 'boolean',
}
```

---

## 🔧 Props Reference

### DataTable

| Prop                | Type                     | Required | Description         |
| ------------------- | ------------------------ | -------- | ------------------- |
| `columns`           | `ColumnDef<T>[]`         | ✅       | Column definitions  |
| `data`              | `T[]`                    | ✅       | Data items          |
| `meta`              | `PaginationMeta \| null` | ✅       | Pagination metadata |
| `isLoading`         | `boolean`                | ❌       | Loading state       |
| `error`             | `Error \| null`          | ❌       | Error state         |
| `searchable`        | `boolean`                | ❌       | Enable search       |
| `searchPlaceholder` | `string`                 | ❌       | Search placeholder  |
| `filters`           | `FilterDef[]`            | ❌       | Filter definitions  |
| `resourceName`      | `string`                 | ❌       | For empty state     |
| `actions`           | `(item: T) => ReactNode` | ❌       | Action buttons      |

### ColumnDef

| Prop        | Type                     | Required | Description     |
| ----------- | ------------------------ | -------- | --------------- |
| `key`       | `string`                 | ✅       | Unique key      |
| `header`    | `string`                 | ✅       | Display header  |
| `sortable`  | `boolean`                | ❌       | Enable sorting  |
| `render`    | `(item: T) => ReactNode` | ❌       | Custom renderer |
| `className` | `string`                 | ❌       | CSS classes     |
| `width`     | `string`                 | ❌       | Column width    |

---

## 🐛 Troubleshooting

### Search not working?

✅ Make sure `searchable={true}` is set

### URL not updating?

✅ Component must be client-side (`"use client"`)

### Filters not showing?

✅ Pass `filters={yourFilters}` prop

### Sort not working?

✅ Set `sortable: true` on columns

### TypeScript errors?

✅ Run `npm run build` to refresh

---

## 📚 Full Documentation

For complete guide with examples:

- **Blueprint**: `docs/DATA_TABLE_BLUEPRINT.md`
- **Example**: `src/app/dashboard/roles/page.tsx`

---

**Questions?** Check the Roles module implementation as reference!
