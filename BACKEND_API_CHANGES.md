# Backend API Changes - Event Management

## Overview

This document outlines the changes made to the frontend codebase to align with the new backend API structure for event management.

## Key Changes

### 1. DateTime Format

**Old Structure:**

- Separate fields: `start_date`, `start_time`, `end_date`, `end_time`
- Example: `start_date: "2025-10-20"`, `start_time: "19:00"`

**New Structure:**

- Combined datetime fields: `starts_at_local`, `ends_at_local`
- ISO 8601 format: `"2025-10-20T19:00:00"`
- Additional UTC fields: `starts_at_utc`, `ends_at_utc`

**Implementation:**

- Form still uses separate date/time inputs for better UX
- Combined into ISO 8601 format before API submission
- Split when populating edit form from API response

### 2. Location Structure

**Old Structure:**

```typescript
location: {
  venue_name?: string;
  address?: string;
  city?: string;
  meeting_url?: string;
}
```

**New Structure:**

```typescript
location: {
  // For online events
  platform?: string;  // e.g., "Zoom", "Google Meet"
  link?: string;      // Meeting URL

  // For offline events
  address?: string;
  city?: string;
  state?: string;
}
```

**Validation Rules:**

- Online/Hybrid events: `platform` and `link` required
- Offline/Hybrid events: `address`, `city`, and `state` required

### 3. Request Payload Example

```json
{
  "event": {
    "title": "Remote Developer Meetup",
    "description": "Join fellow developers...",
    "starts_at_local": "2025-10-20T19:00:00",
    "ends_at_local": "2025-10-20T21:00:00",
    "location_type": "online",
    "location": {
      "platform": "Zoom",
      "link": "https://zoom.us/j/123456789?pwd=example"
    },
    "timezone": "Asia/Jakarta",
    "organizer_id": "{{USER_ID}}",
    "event_type_id": "{{EVENT_TYPE_ID}}",
    "category_ids": ["{{CATEGORY_ID}}"],
    "status": "draft",
    "is_paid": false
  }
}
```

### 4. Response Payload Example

```json
{
  "status": "success",
  "message": "Events fetched successfully",
  "data": [
    {
      "_id": "68ea18c6eefe3decc4013295",
      "title": "Startup Meetup",
      "description": "A meetup for startup enthusiasts.",
      "starts_at_local": "2026-01-11T18:00:00.000+00:00",
      "ends_at_local": "2026-01-12T21:00:00.000+00:00",
      "starts_at_utc": "2026-01-11T18:00:00.000+00:00",
      "ends_at_utc": "2026-01-12T21:00:00.000+00:00",
      "location_type": "offline",
      "location": {
        "city": "Los Angeles",
        "state": "CA",
        "address": "789 Startup Blvd."
      },
      "timezone": "America/Los_Angeles",
      "status": "draft",
      "is_paid": false,
      ...
    }
  ]
}
```

## Files Modified

### TypeScript Types

- **File:** `src/lib/api/types.ts`
- **Changes:**
  - Updated `Event` interface with `starts_at_local`, `ends_at_local`, `starts_at_utc`, `ends_at_utc`
  - Updated location structure (platform/link for online, address/city/state for offline)
  - Updated `CreateEventRequest` and `UpdateEventRequest` interfaces

### Zod Schema

- **File:** `src/lib/schemas/event-schema.ts`
- **Changes:**
  - Updated location schema with new fields
  - Added validation refinements for online events (platform, link)
  - Added validation refinements for offline events (address, city, state)
  - Form schema still uses separate date/time fields (for UX)

### Event Form Component

- **File:** `src/components/events/forms/event-form.tsx`
- **Changes:**
  - Replaced venue-based location fields with platform/link for online events
  - Updated offline event fields to include state (required)
  - Improved conditional rendering based on location_type

### Events Service

- **File:** `src/lib/api/services/events-service.ts`
- **Changes:**
  - Updated `createEventFormData()` to send `starts_at_local` and `ends_at_local`
  - Updated location field mapping based on event type
  - Removed old date/time field submissions

### Events Page

- **File:** `src/app/dashboard/events/page.tsx`
- **Changes:**
  - `handleCreate()`: Combines form date+time into ISO 8601 datetime
  - `handleUpdate()`: Combines form date+time into ISO 8601 datetime
  - Edit modal: Splits `starts_at_local`/`ends_at_local` into separate date/time fields
  - Updated default values for location structure

### Table Configuration

- **File:** `src/app/dashboard/events/events-table-config.tsx`
- **Changes:**
  - Updated date column to parse `starts_at_local` instead of separate fields
  - Updated location column to display platform for online events
  - Updated location column to display city for offline events

## DateTime Conversion Logic

### Form to API (Create/Update)

```typescript
// In page.tsx handleCreate/handleUpdate
const starts_at_local = `${start_date}T${start_time}:00`;
const ends_at_local = `${end_date}T${end_time}:00`;
```

### API to Form (Edit)

```typescript
// In page.tsx edit modal defaultValues
start_date: editingEvent?.starts_at_local
  ? editingEvent.starts_at_local.split("T")[0]
  : "",
start_time: editingEvent?.starts_at_local
  ? editingEvent.starts_at_local.split("T")[1]?.substring(0, 5)
  : "",
```

### Display in Table

```typescript
// In events-table-config.tsx
const startDate = new Date(event.starts_at_local);
startDate.toLocaleDateString(); // Display date
startDate.toLocaleTimeString(); // Display time
```

## Testing Checklist

- [x] ✅ TypeScript compilation successful
- [x] ✅ Build successful with no errors
- [ ] Create event with online location (platform + link)
- [ ] Create event with offline location (address + city + state)
- [ ] Create event with hybrid location (both online and offline fields)
- [ ] Edit event and verify datetime splitting works
- [ ] Verify table displays datetime correctly
- [ ] Verify table displays location based on type
- [ ] Verify validation for required location fields

## Migration Notes

1. **Backward Compatibility:** The form still uses separate date/time inputs for better UX, but combines them before API submission.

2. **Timezone Handling:** The backend now handles timezone conversion. Frontend sends `starts_at_local` with timezone, backend calculates `starts_at_utc`.

3. **Location Validation:** Validation is now conditional based on `location_type`:

   - Online: requires platform and link
   - Offline: requires address, city, and state
   - Hybrid: requires all of the above

4. **Status Field:** Added status to request payload (defaults to "draft").

## Next Steps

1. Test complete event creation flow with new API
2. Verify edit functionality with datetime conversion
3. Test all three location types (online, offline, hybrid)
4. Verify table sorting with new datetime fields
5. Monitor API responses for correct datetime format
