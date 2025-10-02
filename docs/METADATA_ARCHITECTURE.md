# Metadata System Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Metadata System                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │     src/lib/metadata/                   │
        ├─────────────────────────────────────────┤
        │  • types.ts      (TypeScript Interfaces)│
        │  • config.ts     (Configuration)        │
        │  • utils.ts      (Generators)           │
        │  • index.ts      (Exports)              │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Server Pages  │    │Client Pages  │    │Dynamic Pages │
│(page.tsx)    │    │(layout.tsx)  │    │(generateMeta)│
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │  Generated HTML  │
                    │  • <title>       │
                    │  • <meta>        │
                    │  • Open Graph    │
                    │  • Twitter Card  │
                    └──────────────────┘
```

## 📂 File Structure Flow

```
Application
│
├── src/lib/metadata/
│   ├── index.ts ──────────────┐
│   │   (Main exports)         │
│   │                          │
│   ├── types.ts               │
│   │   - PageMetadata         │ Exports All
│   │   - SiteMetadata         ├────────────►
│   │   - MetadataOptions      │
│   │                          │
│   ├── config.ts              │
│   │   - siteConfig           │
│   │   - pageMetadata         │
│   │                          │
│   └── utils.ts               │
│       - generateMetadata ────┘
│       - generateDynamicMetadata
│       - mergeMetadata
│
├── src/app/
│   ├── dashboard/
│   │   ├── page.tsx ──────────────► Server Component
│   │   │   export const metadata     (Direct export)
│   │   │
│   │   ├── categories/
│   │   │   ├── layout.tsx ────────► Server Wrapper
│   │   │   │   export const metadata
│   │   │   └── page.tsx ──────────► Client Component
│   │   │       "use client"
│   │   │
│   │   ├── event-types/
│   │   │   ├── layout.tsx ────────► Server Wrapper
│   │   │   └── page.tsx ──────────► Client Component
│   │   │
│   │   └── roles/
│   │       ├── layout.tsx ────────► Server Wrapper
│   │       └── page.tsx ──────────► Client Component
│   │
│   └── (auth)/
│       ├── login/
│       │   ├── layout.tsx ────────► Server Wrapper
│       │   └── page.tsx ──────────► Client Component
│       │
│       └── register/
│           ├── layout.tsx ────────► Server Wrapper
│           └── page.tsx ──────────► Client Component
│
└── docs/
    ├── METADATA_BLUEPRINT.md ─────► Complete Guide
    ├── METADATA_QUICK_REFERENCE.md ► Templates
    └── METADATA_EXAMPLES.md ──────► Real Examples
```

## 🔄 Data Flow

### Pattern 1: Server Component

```
┌──────────────────┐
│   page.tsx       │
│   (Server)       │
└────────┬─────────┘
         │
         │ import { generateMetadata, pageMetadata }
         │
         ▼
┌──────────────────┐
│ metadata/config  │
│ pageMetadata.X   │
└────────┬─────────┘
         │
         │ Pass to generator
         │
         ▼
┌──────────────────┐
│ metadata/utils   │
│ generateMetadata │
└────────┬─────────┘
         │
         │ Combine with siteConfig
         │
         ▼
┌──────────────────┐
│  Next.js         │
│  Metadata        │
│  Object          │
└──────────────────┘
```

### Pattern 2: Client Component (Layout Wrapper)

```
┌──────────────────┐
│   layout.tsx     │
│   (Server)       │
└────────┬─────────┘
         │
         │ export const metadata
         │
         ▼
┌──────────────────┐
│   page.tsx       │
│   (Client)       │
│   "use client"   │
└──────────────────┘
         │
         │ Rendered within layout
         │
         ▼
┌──────────────────┐
│  Browser HTML    │
│  with metadata   │
└──────────────────┘
```

## 🎯 Configuration Layer

```
siteConfig (Global)
├── siteName: "Cari Acara"
├── description: "..."
├── baseUrl: "https://..."
├── defaultOgImage: "/images/..."
├── twitterHandle: "@..."
├── defaultKeywords: [...]
├── themeColor: "#..."
└── locale: "en_US"
         │
         │ Combined with
         ▼
pageMetadata (Page-specific)
├── dashboard
│   ├── title: "Dashboard"
│   ├── description: "..."
│   └── keywords: [...]
│
├── categories
│   ├── title: "Categories"
│   ├── description: "..."
│   └── keywords: [...]
│
└── ... (other pages)
         │
         │ Results in
         ▼
Complete Metadata Output
├── title: "Dashboard | Cari Acara"
├── description: "Dashboard overview..."
├── keywords: "events,dashboard,..."
├── openGraph: {...}
└── twitter: {...}
```

## 🔧 Component Type Decision Tree

```
Need to add metadata to a page?
         │
         ▼
    Is it a Server
    Component?
         │
    ┌────┴────┐
    │         │
   YES       NO (Client Component)
    │         │
    │         ▼
    │    Create layout.tsx
    │    (Server Wrapper)
    │         │
    └────┬────┘
         │
         ▼
    Export metadata
    in page.tsx/layout.tsx
         │
         ▼
    import { generateMetadata,
             pageMetadata }
         │
         ▼
    export const metadata =
      generateMetadata({
        page: pageMetadata.X
      });
         │
         ▼
       DONE ✓
```

## 📊 Generated Output Structure

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Title -->
    <title>Dashboard | Cari Acara</title>
    
    <!-- Basic Meta -->
    <meta name="description" content="Dashboard overview..." />
    <meta name="keywords" content="events,dashboard,overview..." />
    
    <!-- Open Graph Meta -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="https://..." />
    <meta property="og:site_name" content="Cari Acara" />
    <meta property="og:title" content="Dashboard" />
    <meta property="og:description" content="Dashboard overview..." />
    <meta property="og:image" content="https://.../og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card Meta -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@cariacara" />
    <meta name="twitter:creator" content="@cariacara" />
    <meta name="twitter:title" content="Dashboard" />
    <meta name="twitter:description" content="Dashboard overview..." />
    <meta name="twitter:image" content="https://.../og-image.jpg" />
    
    <!-- Additional Meta -->
    <meta name="theme-color" content="#4F46E5" />
    <link rel="canonical" href="https://..." />
    <meta name="robots" content="index,follow" />
</head>
<body>
    <!-- Page content -->
</body>
</html>
```

## 🎨 Type System Flow

```typescript
// 1. Types defined
interface PageMetadata {
  title: string;
  description: string;
  keywords?: readonly string[];
  // ... other fields
}

interface SiteMetadata {
  siteName: string;
  baseUrl: string;
  // ... other fields
}

// 2. Configuration uses types
export const siteConfig: SiteMetadata = { /* ... */ };

export const pageMetadata = {
  dashboard: { /* ... */ },
  // ... other pages
} as const;

// 3. Generator uses types
export function generateMetadata(
  options: MetadataOptions
): Metadata {
  // Type-safe generation
}

// 4. Pages use typed exports
export const metadata = generateMetadata({
  page: pageMetadata.dashboard, // Type-checked
});
```

## 🚀 Adding New Page Flow

```
1. Edit Config
   ↓
   src/lib/metadata/config.ts
   Add to pageMetadata object
   
2. Choose Pattern
   ↓
   Server Component → Direct export in page.tsx
   Client Component → Export in layout.tsx
   
3. Import & Export
   ↓
   import { generateMetadata, pageMetadata }
   export const metadata = generateMetadata({
     page: pageMetadata.newPage
   });
   
4. Verify
   ↓
   • Check browser title
   • Inspect meta tags
   • Test social sharing
   
5. Done! ✓
```

## 📦 Module Dependencies

```
metadata/index.ts
    │
    ├─► types.ts (No dependencies)
    │
    ├─► config.ts
    │   └─► types.ts
    │
    └─► utils.ts
        ├─► types.ts
        ├─► config.ts
        └─► next (Metadata type)
```

## 🎯 Benefits Visualization

```
Before                       After
┌──────────────┐           ┌──────────────┐
│ No metadata  │    →      │ Full SEO     │
│ Poor SEO     │           │ Social cards │
│ Scattered    │           │ Centralized  │
│ Inconsistent │           │ Maintainable │
└──────────────┘           └──────────────┘
```

---

## 📚 Quick Access

- **Configuration**: `src/lib/metadata/config.ts`
- **Usage Guide**: `docs/METADATA_BLUEPRINT.md`
- **Quick Reference**: `docs/METADATA_QUICK_REFERENCE.md`
- **Examples**: `docs/METADATA_EXAMPLES.md`

---

**Visual Guide Version**: 1.0.0  
**Last Updated**: October 2, 2025
