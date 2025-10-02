# Metadata Blueprint - Complete Guide

## 📋 Overview

This document provides a comprehensive guide for implementing SEO-friendly metadata across all pages in the application. The metadata system is designed to be **maintainable**, **scalable**, and **type-safe**.

## 🏗️ Architecture

### Directory Structure

```
src/lib/metadata/
├── index.ts           # Main export file
├── types.ts           # TypeScript type definitions
├── config.ts          # Centralized metadata configuration
└── utils.ts           # Utility functions for metadata generation
```

### Core Components

1. **Types** (`types.ts`): TypeScript interfaces for type safety
2. **Config** (`config.ts`): Centralized metadata values
3. **Utils** (`utils.ts`): Functions to generate Next.js metadata
4. **Index** (`index.ts`): Convenient exports

## 🚀 Quick Start

### For Server Components

**Example: Dashboard Page**

```tsx
// src/app/dashboard/page.tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";

// Export metadata
export const metadata = generateMeta({
  page: pageMetadata.dashboard,
});

export default async function DashboardPage() {
  return <div>Dashboard Content</div>;
}
```

### For Client Components

Since client components can't export metadata directly, use a layout wrapper:

**Example: Categories Page (Client Component)**

```tsx
// src/app/dashboard/categories/layout.tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMeta({
  page: pageMetadata.categories,
});

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// src/app/dashboard/categories/page.tsx
"use client";

export default function CategoriesPage() {
  return <div>Categories Content</div>;
}
```

## 📝 Step-by-Step Guide for New Pages

### Step 1: Add Page Configuration

Add your page metadata to `src/lib/metadata/config.ts`:

```typescript
export const pageMetadata = {
  // ... existing pages
  
  // Your new page
  myNewPage: {
    title: "My New Page",
    description: "Comprehensive description of what this page does",
    keywords: ["keyword1", "keyword2", "keyword3"],
  },
} as const;
```

### Step 2: Implement Metadata in Page

**Option A: Server Component** (Preferred)

```tsx
// src/app/my-new-page/page.tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";

export const metadata = generateMeta({
  page: pageMetadata.myNewPage,
});

export default async function MyNewPage() {
  return <div>Content</div>;
}
```

**Option B: Client Component** (Use Layout)

```tsx
// src/app/my-new-page/layout.tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMeta({
  page: pageMetadata.myNewPage,
});

export default function MyNewPageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// src/app/my-new-page/page.tsx
"use client";

export default function MyNewPage() {
  return <div>Content</div>;
}
```

## 🎨 Advanced Usage

### Custom Metadata (Without Config)

For one-off pages that don't need centralized config:

```tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  page: {
    title: "Custom Page",
    description: "Custom description",
    keywords: ["custom", "keywords"],
    noIndex: true, // Don't index this page
  },
});
```

### Dynamic Routes

For pages with dynamic parameters:

```tsx
import { generateDynamicMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await fetchItem(params.id);
  
  return generateDynamicMetadata({
    title: item.name,
    description: item.description,
    keywords: [item.category, "event"],
  });
}
```

### Override Site Configuration

Override site-wide defaults for specific pages:

```tsx
export const metadata = generateMetadata({
  page: pageMetadata.myPage,
  site: {
    siteName: "Custom Site Name",
    twitterHandle: "@customhandle",
  },
});
```

### Custom Open Graph Images

```tsx
export const metadata = generateMetadata({
  page: {
    title: "My Page",
    description: "Description",
    ogImage: "/images/custom-og-image.jpg", // Custom OG image
  },
});
```

## 🔧 Configuration Reference

### Page Metadata Options

```typescript
interface PageMetadata {
  title: string;                    // Required: Page title
  description: string;              // Required: Page description
  keywords?: string[];              // Optional: SEO keywords
  ogImage?: string;                 // Optional: Open Graph image
  twitterCard?: string;             // Optional: Twitter card type
  canonicalUrl?: string;            // Optional: Canonical URL
  noIndex?: boolean;                // Optional: Prevent indexing
  noFollow?: boolean;               // Optional: Prevent following links
}
```

### Site Metadata Options

Edit `src/lib/metadata/config.ts` to change site-wide defaults:

```typescript
export const siteConfig: SiteMetadata = {
  siteName: "Cari Acara",
  description: "Event management platform",
  baseUrl: "https://yourdomain.com",
  defaultOgImage: "/images/og-default.jpg",
  twitterHandle: "@cariacara",
  defaultKeywords: ["events", "management"],
  themeColor: "#4F46E5",
  locale: "en_US",
};
```

## 📊 What Gets Generated

The metadata generator creates complete Next.js metadata including:

- ✅ **Title**: `{Page Title} | {Site Name}`
- ✅ **Description**: SEO-friendly description
- ✅ **Keywords**: Combined site + page keywords
- ✅ **Open Graph**: Full OG tags for social sharing
- ✅ **Twitter Card**: Twitter-specific metadata
- ✅ **Canonical URL**: Proper URL canonicalization
- ✅ **Robots**: Indexing and following directives
- ✅ **Theme Color**: PWA theme color

## 🎯 Best Practices

### 1. **Always Use Centralized Config**

✅ **Good:**
```tsx
export const metadata = generateMetadata({
  page: pageMetadata.dashboard,
});
```

❌ **Avoid:**
```tsx
export const metadata = {
  title: "Dashboard",
  description: "...",
};
```

### 2. **Write Descriptive Metadata**

- **Title**: Keep it concise (50-60 characters)
- **Description**: Comprehensive but under 160 characters
- **Keywords**: 3-7 relevant keywords

### 3. **Use Semantic Keywords**

```typescript
keywords: ["event management", "dashboard", "analytics"] // Good
keywords: ["event", "dash", "page"] // Too generic
```

### 4. **Test Social Sharing**

Use these tools to test metadata:
- Facebook: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Twitter: [Card Validator](https://cards-dev.twitter.com/validator)
- LinkedIn: [Post Inspector](https://www.linkedin.com/post-inspector/)

## 📁 Current Pages with Metadata

### ✅ Implemented

- [x] Dashboard (`/dashboard`)
- [x] Categories (`/dashboard/categories`)
- [x] Event Types (`/dashboard/event-types`)
- [x] Roles (`/dashboard/roles`)
- [x] Login (`/login`)
- [x] Register (`/register`)

### 📝 Template for New Pages

When creating a new page:

1. Add to `config.ts`:
   ```typescript
   myPage: {
     title: "My Page",
     description: "What this page does",
     keywords: ["relevant", "keywords"],
   }
   ```

2. Add metadata export:
   - Server component: Direct export in `page.tsx`
   - Client component: Export in `layout.tsx`

3. Test the metadata:
   - Check browser tab title
   - Inspect meta tags in DevTools
   - Test social sharing preview

## 🔍 Troubleshooting

### Issue: Metadata Not Showing

**Solution**: Ensure you're using a Server Component or proper layout structure.

### Issue: TypeScript Errors

**Solution**: Check that keywords are typed as `readonly string[]` or `string[]`.

### Issue: Wrong Title Format

**Solution**: The system automatically appends site name. Just provide the page title.

## 🚀 Future Enhancements

Consider adding:
- JSON-LD structured data
- Multilingual metadata support
- A/B testing for titles/descriptions
- Automatic sitemap generation
- Metadata analytics tracking

## 📚 Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## 🤝 Contributing

When adding new pages:
1. Follow the blueprint pattern
2. Update this documentation
3. Test metadata with social tools
4. Keep descriptions SEO-optimized

---

**Last Updated**: October 2, 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
