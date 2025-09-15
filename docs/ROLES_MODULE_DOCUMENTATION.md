# Roles Management Module

This document provides a comprehensive overview of the newly implemented Roles management module, following the same architectural patterns as the Categories module.

## 📁 File Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── config.ts                    # ✅ Updated with ROLES endpoints
│   │   ├── types.ts                     # ✅ Added Role interfaces
│   │   └── services/
│   │       └── roles-service.ts         # ✅ Complete CRUD service
├── hooks/
│   ├── roles-hooks.ts                   # ✅ Custom hooks for role management
│   └── index.ts                         # ✅ Export roles hooks
├── components/
│   └── roles/
│       ├── role-table-row.tsx           # ✅ Individual role row component
│       ├── roles-table.tsx              # ✅ Table wrapper with suspense
│       ├── role-modals.tsx              # ✅ Create/Edit/Delete modals
│       └── role-pagination.tsx          # ✅ Pagination component
├── app/
│   └── dashboard/
│       ├── layout.tsx                   # ✅ Updated navigation
│       └── roles/
│           └── page.tsx                 # ✅ Main roles page
```

## 🔧 API Integration

### Endpoints Added to Config

```typescript
ROLES: {
  LIST: "/api/v1/admin/roles",
  DETAIL: "/api/v1/admin/roles/:id",
  CREATE: "/api/v1/admin/roles",
  UPDATE: "/api/v1/admin/roles/:id",
  DELETE: "/api/v1/admin/roles/:id",
}
```

### Type Definitions

```typescript
interface Role {
  _id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface CreateRoleRequest {
  role: {
    name: string;
    description?: string;
  };
}

interface UpdateRoleRequest {
  role: {
    name: string;
    description?: string;
  };
}
```

## 🎣 Custom Hooks

### Available Hooks

- `useRoles()` - Fetch and manage roles list with pagination
- `useCreateRole()` - Create new roles with optimistic updates
- `useUpdateRole()` - Update existing roles with optimistic updates
- `useDeleteRole()` - Delete roles with optimistic updates
- `useRole()` - Fetch single role by ID
- `useOptimisticRoles()` - Manage optimistic update states

### Usage Example

```typescript
const { roles, meta, isLoading, error, fetchRoles } = useRoles();

const { createRole, isLoading: isCreating } = useCreateRole();
```

## 🧩 Components

### RoleTableRow

Displays individual role data with:

- Name and description
- Created/updated timestamps
- Edit and delete actions
- Optimistic update visual feedback
- Accessibility support

### RolesTable

Main table wrapper with:

- Loading state handling
- Error state display
- Semantic table structure
- Suspense boundary integration

### Role Modals

Three modal components:

- `CreateRoleModal` - Create new roles
- `EditRoleModal` - Edit existing roles
- `DeleteRoleModal` - Confirm role deletion

### RolePagination

Pagination with:

- Accessible navigation
- Keyboard support
- Page info display
- Loading states

## 📄 Main Page Features

The `/dashboard/roles` page includes:

### ✅ Complete CRUD Operations

- ✅ Create new roles with form validation
- ✅ Read/List roles with pagination and search
- ✅ Update existing roles with inline editing
- ✅ Delete roles with confirmation dialog

### ✅ Advanced Features

- ✅ Optimistic updates for better UX
- ✅ Search functionality
- ✅ Pagination with metadata
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Accessibility compliance

### ✅ Performance Optimizations

- ✅ Memoized components and callbacks
- ✅ Suspense boundaries for streaming UI
- ✅ Error boundary integration
- ✅ Optimistic updates to reduce perceived latency

## 🔌 API Service

### RolesApiService Methods

```typescript
// CRUD Operations
async getRoles(params?: RolesQueryParams): Promise<PaginatedResponse<Role>>
async getRole(id: string): Promise<Role>
async createRole(roleData: CreateRoleRequest): Promise<Role>
async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role>
async deleteRole(id: string): Promise<Role>

// Bulk Operations
async bulkUpdateRoles(updates: Array<{id: string, data: Partial<UpdateRoleRequest["role"]>}>): Promise<Role[]>
```

## 🎯 API Testing

You can test the API endpoints using the provided curl commands:

### Get All Roles

```bash
curl --location 'http://127.0.0.1:3000/api/v1/admin/roles?page=1&per_page=10&query=*' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

### Create Role

```bash
curl --location 'http://127.0.0.1:3000/api/v1/admin/roles' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--data '{
  "role": {
    "name": "Custom Role",
    "description": "Description for custom role"
  }
}'
```

### Update Role

```bash
curl --location --request PUT 'http://127.0.0.1:3000/api/v1/admin/roles/ROLE_ID' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--data '{
  "role": {
    "name": "Updated Role",
    "description": "Updated description"
  }
}'
```

### Delete Role

```bash
curl --location --request DELETE 'http://127.0.0.1:3000/api/v1/admin/roles/ROLE_ID' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

## 🎨 UI/UX Features

### Consistent Design

- Follows existing design system
- Tailwind CSS for styling
- Consistent spacing and typography
- Responsive design

### Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management in modals

### Loading States

- Skeleton loaders during data fetching
- Button loading indicators
- Optimistic updates with visual feedback

## 🚀 Getting Started

1. **Navigate to Roles**: Visit `/dashboard/roles` in your application
2. **View Roles**: See the list of existing roles with pagination
3. **Search**: Use the search bar to filter roles
4. **Create**: Click "Add Role" to create a new role
5. **Edit**: Click "Edit" on any role to modify it
6. **Delete**: Click "Delete" to remove a role (with confirmation)

## 🔮 Future Enhancements

Potential improvements that can be added:

- Role permissions management
- User assignment to roles
- Bulk operations (bulk delete, bulk edit)
- Export functionality
- Advanced filtering options
- Role hierarchy support
- Audit log for role changes

## 📝 Development Notes

- Follows the same patterns as Categories module for consistency
- Uses TypeScript for type safety
- Implements proper error handling and logging
- Includes comprehensive JSDoc documentation
- Uses enterprise-grade component architecture
- Follows React best practices and performance optimizations

## 🎯 Success Metrics

The implementation successfully provides:

- ✅ Complete CRUD functionality
- ✅ Real-time UI updates
- ✅ Proper error handling
- ✅ Accessibility compliance
- ✅ Performance optimization
- ✅ Type safety
- ✅ Consistent architecture
