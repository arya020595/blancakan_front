# DataTable Blueprint

**Reusable Table System with URL-Based State Management**

Complete guide for implementing search, sort, filter, and pagination features across all dashboard tables.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Component Reference](#component-reference)
5. [Configuration Guide](#configuration-guide)
6. [URL State Management](#url-state-management)
7. [Filter Types](#filter-types)
8. [Best Practices](#best-practices)
9. [Migration Guide](#migration-guide)
10. [Examples](#examples)

---

## Overview

### Features

✅ **Search** - Debounced search with 300ms delay
✅ **Sort** - Click column headers to sort (asc → desc → clear)
✅ **Filter** - 6 configurable filter types (select, multi-select, date-range, number-range, search, boolean)
✅ **Pagination** - First/prev/next/last with page numbers and items per page selector
✅ **URL State** - All state in URL for shareable/bookmarkable views
✅ **Loading States** - Skeleton loaders, empty states, error states
✅ **Type-Safe** - Full TypeScript support with generics
✅ **Accessible** - Keyboard navigation, ARIA labels, semantic HTML

### Benefits

- **64% Code Reduction**: ~280 lines → ~100 lines per page
- **Consistent UX**: Same patterns across all tables
- **Shareable URLs**: `?query=admin&sort=created_at:desc&page=2`
- **Browser History**: Back/forward buttons work correctly
- **State Persistence**: Refresh preserves filters/search
- **Performance**: Debounced search, optimized re-renders

### Tech Stack

- **nuqs** (5KB) - URL state management
- **use-debounce** (2KB) - Search debouncing
- **TanStack Query v5** - Data fetching (already implemented)
- **shadcn/Radix UI** - UI components

---

## Architecture

### Component Structure

```
src/components/ui/data-table/
├── data-table.tsx              # Main orchestrator
├── data-table-toolbar.tsx      # Search + filters
├── data-table-header.tsx       # Sortable headers
├── data-table-body.tsx         # Table body + states
├── data-table-pagination.tsx   # Pagination controls
├── data-table-filter.tsx       # Individual filters
├── types.ts                    # TypeScript definitions
└── index.ts                    # Barrel exports

src/hooks/
└── use-table-params.ts         # URL state management
```

### Data Flow

```
URL Parameters
    ↓
useTableParams() → params object
    ↓
useRoles(params) → TanStack Query
    ↓
Backend API → { data, meta }
    ↓
DataTable Component
    ↓
User Interaction → Update URL → Re-fetch
```

---

## Quick Start

### 0. Setup nuqs Adapter (One-Time Setup)

Add the nuqs adapter to your root layout:

```tsx
// src/app/layout.tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          {/* Your other providers */}
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
```

**Note**: This is already configured in the project. Skip to Step 1.

### 1. Create Table Configuration

Create a `*-table-config.tsx` file for your module:

```tsx
// src/app/dashboard/roles/roles-table-config.tsx
import type { Role } from "@/lib/api/types";
import type { ColumnDef, FilterDef } from "@/components/ui/data-table";

export const rolesColumns: ColumnDef<Role>[] = [
  {
    key: "name",
    header: "Role Name",
    sortable: true,
    render: (role) => (
      <div>
        <div className="font-medium">{role.name}</div>
        <div className="text-sm text-gray-500">{role._id}</div>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (role) =>
      role.description || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    render: (role) => new Date(role.created_at).toLocaleDateString(),
  },
];

export const rolesFilters: FilterDef[] = [
  {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];
```

### 2. Update Page Component

Replace your existing table implementation:

```tsx
// src/app/dashboard/roles/page.tsx
"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTableParams } from "@/hooks/use-table-params";
import { useRoles } from "@/hooks/roles-hooks";
import { rolesColumns, rolesFilters } from "./roles-table-config";

export default function RolesPage() {
  const { params } = useTableParams();

  const { data, isLoading, error } = useRoles({
    page: params.page,
    per_page: params.per_page,
    query: params.query || "*",
    sort: params.sort || "created_at:desc",
    filters: params.filter,
  });

  const roles = data?.data ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <Button>Add Role</Button>
      </div>

      <DataTable
        columns={rolesColumns}
        data={roles}
        meta={meta}
        isLoading={isLoading}
        error={error ? new Error(error.message) : null}
        searchable
        searchPlaceholder="Search roles..."
        filters={rolesFilters}
        resourceName="role"
        actions={(role) => (
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

### 3. Done! 🎉

Your table now has search, sort, filter, and pagination with URL state management.

---

## Component Reference

### DataTable Props

```typescript
interface DataTableProps<T> {
  // Required
  columns: ColumnDef<T>[]; // Column definitions
  data: T[]; // Data items
  meta: PaginationMeta | null; // Pagination metadata

  // Optional
  isLoading?: boolean; // Loading state
  error?: Error | null; // Error state
  actions?: (item: T) => ReactNode; // Action buttons
  searchable?: boolean; // Enable search
  searchPlaceholder?: string; // Search placeholder
  filters?: FilterDef[]; // Filter definitions
  config?: TableConfig; // Additional config
  resourceName?: string; // For empty state ("No {resourceName}s found")
}
```

### ColumnDef

```typescript
interface ColumnDef<T> {
  key: string; // Unique key
  header: string; // Display header
  sortable?: boolean; // Enable sorting
  render?: (item: T) => ReactNode; // Custom cell renderer
  className?: string; // Column CSS classes
  width?: string; // Column width
}
```

### FilterDef

```typescript
type FilterDef =
  | SelectFilterDef
  | MultiSelectFilterDef
  | DateRangeFilterDef
  | NumberRangeFilterDef
  | SearchFilterDef
  | BooleanFilterDef;

// See "Filter Types" section for details
```

---

## Configuration Guide

### Basic Table (No Filters)

```tsx
<DataTable
  columns={columns}
  data={data}
  meta={meta}
  isLoading={isLoading}
  resourceName="item"
/>
```

### With Search

```tsx
<DataTable
  columns={columns}
  data={data}
  meta={meta}
  searchable
  searchPlaceholder="Search..."
/>
```

### With Filters

```tsx
<DataTable
  columns={columns}
  data={data}
  meta={meta}
  filters={[
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]}
/>
```

### With Actions

```tsx
<DataTable
  columns={columns}
  data={data}
  meta={meta}
  actions={(item) => (
    <div className="flex gap-2">
      <Button onClick={() => handleEdit(item)}>Edit</Button>
      <Button onClick={() => handleDelete(item)}>Delete</Button>
    </div>
  )}
/>
```

### Full Configuration

```tsx
<DataTable
  columns={columns}
  data={data}
  meta={meta}
  isLoading={isLoading}
  error={error}
  searchable
  searchPlaceholder="Search..."
  filters={filters}
  config={{
    searchDebounce: 300,
    defaultSort: "created_at:desc",
    defaultPerPage: 20,
  }}
  resourceName="user"
  actions={(item) => <Actions item={item} />}
/>
```

---

## URL State Management

### URL Format

```
?query=search&sort=name:asc&page=2&per_page=20&filter[status]=active&filter[tags]=web,mobile
```

### useTableParams Hook

```typescript
const {
  params, // Backend-ready params object
  filters, // Current filter state
  sortState, // { field, direction }
  setSearch, // Update search query
  setSort, // Set sort field/direction
  toggleSort, // Toggle sort on column
  setFilter, // Set single filter
  setFilters, // Set multiple filters
  setPage, // Set page number
  setPerPage, // Set items per page
  resetFilters, // Clear all filters
  reset, // Reset everything
} = useTableParams();
```

### Usage Example

```typescript
// Get params from URL
const { params } = useTableParams();

// Pass to query hook
const { data } = useRoles({
  page: params.page,
  per_page: params.per_page,
  query: params.query,
  sort: params.sort,
  filters: params.filter,
});
```

### Benefits

- ✅ **Shareable Links**: Copy URL to share filtered view
- ✅ **Bookmarkable**: Save frequently used filters
- ✅ **Browser History**: Back/forward buttons work
- ✅ **State Persistence**: Refresh preserves filters
- ✅ **Deep Linking**: Link directly to filtered views

---

## Filter Types

### 1. Select (Single Choice)

```typescript
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

**URL**: `?filter[status]=active`

### 2. Multi-Select (Multiple Choices)

```typescript
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

**URL**: `?filter[tags]=web,mobile`

### 3. Date Range

```typescript
{
  key: 'created_date',
  label: 'Created Date',
  type: 'date-range',
  format: 'yyyy-MM-dd', // optional
}
```

**URL**: `?filter[created_date]=2024-01-01,2024-12-31`

### 4. Number Range

```typescript
{
  key: 'price',
  label: 'Price',
  type: 'number-range',
  min: 0,
  max: 1000,
  step: 10,
}
```

**URL**: `?filter[price]=50,200`

### 5. Boolean (Toggle)

```typescript
{
  key: 'is_featured',
  label: 'Featured Only',
  type: 'boolean',
}
```

**URL**: `?filter[is_featured]=true`

### 6. Search (Separate Filter Input)

```typescript
{
  key: 'tags_search',
  label: 'Search Tags',
  type: 'search',
  placeholder: 'Type to search...',
  debounce: 300,
}
```

**URL**: `?filter[tags_search]=javascript`

---

## Best Practices

### Column Configuration

1. **Keep Headers Concise**: Max 2-3 words
2. **Enable Sorting Strategically**: Only for fields that benefit from sorting (dates, names, numbers)
3. **Use Custom Renderers**: Format dates, numbers, status badges consistently
4. **Set Column Widths**: Prevent layout shifts for important columns

```tsx
{
  key: 'status',
  header: 'Status',
  width: '120px',
  render: (item) => (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs",
      item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    )}>
      {item.status}
    </span>
  ),
}
```

### Filter Configuration

1. **Limit Filter Count**: Max 3-4 filters to avoid clutter
2. **Most Used First**: Place frequently used filters first
3. **Clear Labels**: Use descriptive labels ("Created Date" not "Date")
4. **Provide Defaults**: Consider default filter values for common use cases

### Performance

1. **Search Debouncing**: Keep default 300ms delay
2. **Pagination Limits**: Use 10/20/50/100 options
3. **Lazy Loading**: Load filter options dynamically if large datasets
4. **Memoize Renders**: Use `memo()` for expensive cell renders

```tsx
const ExpensiveCell = memo(({ item }: { item: Item }) => {
  // Complex rendering logic
  return <div>...</div>;
});
```

### Accessibility

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **ARIA Labels**: Screen reader support built-in
3. **Focus Management**: Proper focus states on sort/filter interactions
4. **Semantic HTML**: Uses proper `<table>`, `<thead>`, `<tbody>` structure

---

## Migration Guide

### Step-by-Step Migration

#### Before (Old Pattern)

```tsx
// 280 lines of code
export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useRoles({
    page: currentPage,
    query: searchQuery,
  });

  return (
    <>
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((role) => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <RolePagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </>
  );
}
```

#### After (DataTable Pattern)

```tsx
// ~100 lines of code (64% reduction!)
export default function RolesPage() {
  const { params } = useTableParams();

  const { data, isLoading } = useRoles(params);

  return (
    <DataTable
      columns={rolesColumns}
      data={data?.data ?? []}
      meta={data?.meta ?? null}
      isLoading={isLoading}
      searchable
      filters={rolesFilters}
      actions={(role) => <Actions role={role} />}
    />
  );
}
```

### Checklist

- [ ] Create `*-table-config.tsx` with columns and filters
- [ ] Replace `useState` for search/page with `useTableParams()`
- [ ] Pass `params` to query hook
- [ ] Replace manual table HTML with `<DataTable>`
- [ ] Remove custom pagination component
- [ ] Remove manual search input
- [ ] Test sorting, filtering, pagination
- [ ] Verify URL state updates correctly
- [ ] Test browser back/forward buttons
- [ ] Test page refresh (state persistence)

---

## Examples

### Example 1: Users Table with Multiple Filters

```tsx
const usersColumns: ColumnDef<User>[] = [
  {
    key: "avatar",
    header: "User",
    render: (user) => (
      <div className="flex items-center gap-3">
        <img src={user.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    render: (user) => (
      <span
        className={
          user.status === "active" ? "text-green-600" : "text-gray-600"
        }>
        {user.status}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Joined",
    sortable: true,
    render: (user) => new Date(user.created_at).toLocaleDateString(),
  },
];

const usersFilters: FilterDef[] = [
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "joined_date",
    label: "Joined Date",
    type: "date-range",
  },
  {
    key: "is_verified",
    label: "Verified Only",
    type: "boolean",
  },
];
```

### Example 2: Products Table with Number Range

```tsx
const productsColumns: ColumnDef<Product>[] = [
  {
    key: "name",
    header: "Product",
    sortable: true,
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
  },
  {
    key: "price",
    header: "Price",
    sortable: true,
    render: (product) => `$${product.price.toFixed(2)}`,
  },
  {
    key: "stock",
    header: "Stock",
    sortable: true,
    render: (product) => (
      <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
        {product.stock}
      </span>
    ),
  },
];

const productsFilters: FilterDef[] = [
  {
    key: "category",
    label: "Category",
    type: "multi-select",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Food", value: "food" },
    ],
  },
  {
    key: "price",
    label: "Price Range",
    type: "number-range",
    min: 0,
    max: 1000,
    step: 10,
  },
  {
    key: "stock",
    label: "Stock Level",
    type: "number-range",
    min: 0,
    max: 100,
  },
];
```

### Example 3: Events Table with Date Range

```tsx
const eventsColumns: ColumnDef<Event>[] = [
  {
    key: "title",
    header: "Event",
    sortable: true,
    render: (event) => (
      <div>
        <div className="font-medium">{event.title}</div>
        <div className="text-sm text-gray-500">{event.location}</div>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (event) => new Date(event.date).toLocaleString(),
  },
  {
    key: "attendees",
    header: "Attendees",
    sortable: true,
    render: (event) => `${event.attendees}/${event.capacity}`,
  },
];

const eventsFilters: FilterDef[] = [
  {
    key: "event_date",
    label: "Event Date",
    type: "date-range",
  },
  {
    key: "type",
    label: "Event Type",
    type: "select",
    options: [
      { label: "Workshop", value: "workshop" },
      { label: "Conference", value: "conference" },
      { label: "Meetup", value: "meetup" },
    ],
  },
  {
    key: "is_full",
    label: "Available Only",
    type: "boolean",
  },
];
```

---

## Troubleshooting

### Issue: TypeScript errors on imports

**Solution**: Files may need TypeScript to re-index. Run:

```bash
npm run build
```

### Issue: URL params not syncing

**Solution**: Ensure `useTableParams()` is called in client component (`"use client"`)

### Issue: Filters not working

**Solution**: Verify backend API supports `filter[key]` query parameters

### Issue: Search too slow

**Solution**: Adjust debounce delay:

```tsx
config={{ searchDebounce: 500 }}
```

### Issue: Pagination not resetting on search

**Solution**: Already handled automatically by `useTableParams()`

---

## Summary

### Key Takeaways

1. **64% Code Reduction**: Less boilerplate, more features
2. **URL-Based State**: Shareable, bookmarkable, persistent
3. **Type-Safe**: Full TypeScript support with generics
4. **Consistent UX**: Same patterns across all tables
5. **Performance**: Optimized with debouncing and memoization
6. **Accessible**: Keyboard navigation and screen reader support

### Next Steps

1. Migrate existing tables to DataTable pattern
2. Add filter configurations based on backend capabilities
3. Customize column renderers for better UX
4. Test across different screen sizes
5. Monitor performance with large datasets

---

**Questions?** Check the code examples in `src/app/dashboard/roles/` for a complete implementation.
