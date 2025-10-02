# Metadata Quick Reference Card

## 🎯 TL;DR - Copy & Paste Templates

### Server Component Template

```tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";

export const metadata = generateMeta({
  page: pageMetadata.yourPageName,
});

export default async function YourPage() {
  return <div>Content</div>;
}
```

### Client Component Template

**layout.tsx:**
```tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMeta({
  page: pageMetadata.yourPageName,
});

export default function YourLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

**page.tsx:**
```tsx
"use client";

export default function YourPage() {
  return <div>Content</div>;
}
```

### Add to Config Template

**src/lib/metadata/config.ts:**
```typescript
export const pageMetadata = {
  // ... existing pages
  yourPageName: {
    title: "Your Page Title",
    description: "Clear, concise description of your page (under 160 chars)",
    keywords: ["keyword1", "keyword2", "keyword3"],
  },
} as const;
```

## 📋 Checklist for New Pages

- [ ] Add page config to `src/lib/metadata/config.ts`
- [ ] Add metadata export (page.tsx or layout.tsx)
- [ ] Check browser title appears correctly
- [ ] Verify meta description in HTML
- [ ] Test social sharing preview

## 🔗 Quick Links

- **Config File**: `src/lib/metadata/config.ts`
- **Types**: `src/lib/metadata/types.ts`
- **Utils**: `src/lib/metadata/utils.ts`
- **Full Guide**: `docs/METADATA_BLUEPRINT.md`

## 💡 Common Patterns

### Dynamic Route Metadata

```tsx
export async function generateMetadata({ params }) {
  const data = await fetchData(params.id);
  return generateDynamicMetadata({
    title: data.name,
    description: data.description,
  });
}
```

### Custom Metadata (No Config)

```tsx
export const metadata = generateMetadata({
  page: {
    title: "Custom",
    description: "Custom description",
    keywords: ["custom"],
  },
});
```

### No Index Page

```tsx
export const metadata = generateMetadata({
  page: {
    ...pageMetadata.yourPage,
    noIndex: true,
  },
});
```

## ⚠️ Common Mistakes

❌ **Don't** export metadata from client components directly  
✅ **Do** use layout.tsx wrapper

❌ **Don't** hardcode metadata values  
✅ **Do** use centralized config

❌ **Don't** forget to add keywords  
✅ **Do** include 3-7 relevant keywords

## 🎨 Generated Output Example

```html
<title>Dashboard | Cari Acara</title>
<meta name="description" content="Dashboard overview with statistics..." />
<meta name="keywords" content="events,dashboard,overview,statistics" />
<meta property="og:title" content="Dashboard" />
<meta property="og:description" content="Dashboard overview..." />
<meta property="og:image" content="https://yourdomain.com/images/og.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

## 📞 Need Help?

1. Read full guide: `docs/METADATA_BLUEPRINT.md`
2. Check existing examples in `/app` directory
3. Review types in `src/lib/metadata/types.ts`

---

**Quick Start**: Copy template → Add to config → Export metadata → Done! ✨
