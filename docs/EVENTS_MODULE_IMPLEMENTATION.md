# Events Module Implementation - Summary

## ✅ Completed So Far

### 1. **API Types** (`src/lib/api/types.ts`)
- ✅ Added `Event` interface with all fields from API response
- ✅ Added `CreateEventRequest` interface
- ✅ Added `UpdateEventRequest` interface  
- ✅ Added `EventsQueryParams` interface
- ✅ Support for location types (online, offline, hybrid)
- ✅ Support for event statuses (draft, published, canceled)
- ✅ Support for cover image upload

### 2. **Event Schema** (`src/lib/schemas/event-schema.ts`)
- ✅ Created Zod validation schema
- ✅ Validates all event fields
- ✅ Handles nested location object
- ✅ Handles category_ids array
- ✅ Support for file uploads

### 3. **Events Service** (`src/lib/api/services/events-service.ts`)
- ✅ Follows BaseApiService pattern
- ✅ `getEvents()` - Fetch paginated events
- ✅ `getEvent()` - Fetch single event
- ✅ `createEvent()` - Create new event
- ✅ `updateEvent()` - Update event
- ✅ `deleteEvent()` - Delete event
- ✅ `publishEvent()` - Publish event
- ✅ `cancelEvent()` - Cancel event
- ✅ Proper logging and error handling

### 4. **Events Hooks** (`src/hooks/events-hooks.ts`)
- ✅ `useEvents()` - Fetch paginated events
- ✅ `useEvent()` - Fetch single event
- ✅ `useCreateEvent()` - Create mutation
- ✅ `useUpdateEvent()` - Update mutation
- ✅ `useDeleteEvent()` - Delete mutation
- ✅ `usePublishEvent()` - Publish mutation
- ✅ `useCancelEvent()` - Cancel mutation
- ✅ Automatic cache invalidation

##  🚧 Next Steps

### Step 1: Update hooks/index.ts
Add export for events hooks:
```typescript
export * from "./events-hooks";
```

### Step 2: Create Table Config
Create `src/app/dashboard/events/events-table-config.tsx`:
- Column definitions (title, description, dates, location, status, etc.)
- Filter definitions (status, location_type, is_paid, event_type, categories)
- Sortable columns
- Custom renderers for status badges, dates, location

### Step 3: Create Events Page
Create `src/app/dashboard/events/page.tsx`:
- Follow Roles/EventTypes/Categories pattern
- Use DataTable component
- URL-based state management
- Icons for actions
- Form modals for create/edit
- Delete confirmation

### Step 4: Create Events Layout
Create `src/app/dashboard/events/layout.tsx`:
- Metadata configuration
- Similar to other module layouts

## 📋 File Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── services/
│   │   │   └── events-service.ts ✅
│   │   └── types.ts ✅ (updated)
│   └── schemas/
│       └── event-schema.ts ✅
├── hooks/
│   ├── events-hooks.ts ✅
│   └── index.ts (needs update)
└── app/
    └── dashboard/
        └── events/
            ├── events-table-config.tsx (TODO)
            ├── page.tsx (TODO)
            └── layout.tsx (TODO)
```

## 🎯 Expected Features

When complete, Events module will have:
- 🔍 **Search** events by title/description
- ⬆️⬇️ **Sort** by title, dates, status
- 🎛️ **Filter** by status, location type, paid/free, event type, categories
- 📄 **Pagination** with URL state
- ✏️ **Edit/Delete** actions with icons
- ➕ **Create** with form modal
- 📊 **Status badges** (draft/published/canceled)
- 📅 **Date formatting**
- 📍 **Location display** (venue/online/hybrid)
- 🚀 **Publish/Cancel** actions

## 🔗 API Endpoint
```
GET    /api/v1/admin/events
GET    /api/v1/admin/events/:id
POST   /api/v1/admin/events
PUT    /api/v1/admin/events/:id
DELETE /api/v1/admin/events/:id
POST   /api/v1/admin/events/:id/publish
POST   /api/v1/admin/events/:id/cancel
```

## 📝 Notes

- File uploads handled via FormData
- Location object supports venue (offline), meeting_url (online), or both (hybrid)
- Category IDs sent as array
- Cover image optional but recommended
- Timezone support for international events
- Status workflow: draft → published → canceled

Would you like me to continue with the remaining files (table config, page component, and layout)?
