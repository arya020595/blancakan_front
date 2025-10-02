# Metadata Implementation Examples

This document provides complete, real-world examples of metadata implementation across different page types.

## 📄 Table of Contents

1. [Simple Server Component](#simple-server-component)
2. [Client Component with Layout](#client-component-with-layout)
3. [Dynamic Route](#dynamic-route)
4. [Custom Metadata](#custom-metadata)
5. [Protected Page](#protected-page)

---

## Simple Server Component

### File: `src/app/about/page.tsx`

```tsx
/**
 * About Page - Server Component with Metadata
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";

// Export metadata for this page
export const metadata = generateMeta({
  page: pageMetadata.about,
});

export default async function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-gray-600">
        Learn more about our event management platform.
      </p>
    </div>
  );
}
```

### Configuration Addition

```typescript
// src/lib/metadata/config.ts
export const pageMetadata = {
  // ... other pages
  about: {
    title: "About Us",
    description: "Learn about Cari Acara - your trusted event management platform for discovering and organizing events",
    keywords: ["about", "company", "team", "mission"],
  },
} as const;
```

---

## Client Component with Layout

### File: `src/app/dashboard/settings/layout.tsx`

```tsx
/**
 * Settings Layout - Provides metadata for client component
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMeta({
  page: pageMetadata.settings,
});

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

### File: `src/app/dashboard/settings/page.tsx`

```tsx
/**
 * Settings Page - Client Component
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          <span>Enable notifications</span>
        </label>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
```

### Configuration Addition

```typescript
// src/lib/metadata/config.ts
export const pageMetadata = {
  // ... other pages
  settings: {
    title: "Settings",
    description: "Manage your account settings, preferences, and notifications",
    keywords: ["settings", "preferences", "account", "configuration"],
  },
} as const;
```

---

## Dynamic Route

### File: `src/app/events/[id]/page.tsx`

```tsx
/**
 * Event Detail Page - Dynamic Route with Metadata
 */

import { generateDynamicMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Mock fetch function
async function getEvent(id: string): Promise<Event | null> {
  // In real app, fetch from API
  return {
    id,
    name: "Summer Music Festival",
    description: "The biggest music festival of the summer",
    category: "Music",
  };
}

// Generate dynamic metadata based on event data
export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return generateDynamicMetadata({
    title: event.name,
    description: event.description,
    keywords: [event.category, "event", event.name.toLowerCase()],
    ogImage: `/api/og?event=${event.id}`, // Custom OG image
  });
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
        {event.category}
      </span>
    </div>
  );
}
```

---

## Custom Metadata (Without Config)

### File: `src/app/admin/debug/page.tsx`

```tsx
/**
 * Debug Page - Custom metadata without config
 * Not indexed by search engines
 */

import { generateMetadata } from "@/lib/metadata";

// Custom metadata for this specific page
export const metadata = generateMetadata({
  page: {
    title: "Debug Console",
    description: "Internal debugging tools and system diagnostics",
    keywords: ["debug", "admin", "internal"],
    noIndex: true, // Don't index this page
    noFollow: true, // Don't follow links
  },
});

export default function DebugPage() {
  return (
    <div className="p-6 bg-gray-900 text-green-400 font-mono">
      <h1 className="text-xl mb-4">🔧 Debug Console</h1>
      <pre className="text-sm">
        {JSON.stringify(
          {
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
```

---

## Protected Page

### File: `src/app/dashboard/analytics/layout.tsx`

```tsx
/**
 * Analytics Layout - Metadata for protected page
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMeta({
  page: pageMetadata.analytics,
});

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

### File: `src/app/dashboard/analytics/page.tsx`

```tsx
/**
 * Analytics Page - Protected Client Component
 */

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AnalyticsData {
  views: number;
  clicks: number;
  conversions: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Fetch analytics data
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    // Mock implementation
    setData({
      views: 1234,
      clicks: 567,
      conversions: 89,
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Total Views</h3>
          <p className="text-3xl font-bold">{data?.views || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Total Clicks</h3>
          <p className="text-3xl font-bold">{data?.clicks || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Conversions</h3>
          <p className="text-3xl font-bold">{data?.conversions || 0}</p>
        </Card>
      </div>
    </div>
  );
}
```

### Configuration Addition

```typescript
// src/lib/metadata/config.ts
export const pageMetadata = {
  // ... other pages
  analytics: {
    title: "Analytics",
    description: "View detailed analytics and insights about your events and user engagement",
    keywords: ["analytics", "insights", "statistics", "reports"],
    noIndex: true, // Protected pages shouldn't be indexed
  },
} as const;
```

---

## Complex Example: Multi-Tab Page

### File: `src/app/dashboard/reports/layout.tsx`

```tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMeta({
  page: pageMetadata.reports,
});

export default function ReportsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

### File: `src/app/dashboard/reports/page.tsx`

```tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Overview Report</h2>
            <p>Summary of all activities...</p>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Events Report</h2>
            <p>Detailed event statistics...</p>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Users Report</h2>
            <p>User activity and engagement...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Configuration Addition

```typescript
// src/lib/metadata/config.ts
export const pageMetadata = {
  // ... other pages
  reports: {
    title: "Reports",
    description: "Generate and view comprehensive reports on events, users, and system activity",
    keywords: ["reports", "analytics", "data", "insights", "export"],
  },
} as const;
```

---

## Best Practices Summary

### ✅ DO

- Use centralized configuration for consistency
- Add descriptive keywords (3-7 relevant terms)
- Keep descriptions under 160 characters
- Use `noIndex: true` for admin/internal pages
- Test social sharing previews

### ❌ DON'T

- Export metadata from client components directly
- Hardcode metadata values
- Stuff keywords unnaturally
- Forget to update config when adding pages
- Use generic descriptions

---

## Testing Your Metadata

### Browser DevTools

```javascript
// Check title
document.title

// Check meta description
document.querySelector('meta[name="description"]').content

// Check OG tags
document.querySelector('meta[property="og:title"]').content
```

### Preview Tools

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

---

**Pro Tip**: Always test your metadata in production-like environments to ensure proper rendering and social sharing previews! 🚀
