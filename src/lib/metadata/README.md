# Metadata System

A comprehensive, type-safe, and maintainable metadata management system for SEO-optimized Next.js applications.

## 🎯 Features

- ✅ **Type-Safe**: Full TypeScript support with strict typing
- ✅ **Centralized Configuration**: Single source of truth for all metadata
- ✅ **SEO-Optimized**: Complete Open Graph and Twitter Card support
- ✅ **Maintainable**: Easy to update and extend
- ✅ **Reusable**: Blueprint pattern for future pages
- ✅ **Flexible**: Supports both server and client components

## 📦 Installation

The metadata system is already set up in your project. No installation needed!

## 🚀 Quick Start

### 1. Add Page Configuration

```typescript
// src/lib/metadata/config.ts
export const pageMetadata = {
  myPage: {
    title: "My Page",
    description: "Description of my page",
    keywords: ["keyword1", "keyword2"],
  },
} as const;
```

### 2. Use in Your Page

**Server Component:**
```tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";

export const metadata = generateMeta({
  page: pageMetadata.myPage,
});

export default function MyPage() {
  return <div>Content</div>;
}
```

**Client Component:**
```tsx
// layout.tsx
import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";

export const metadata = generateMeta({
  page: pageMetadata.myPage,
});

export default function Layout({ children }) {
  return <>{children}</>;
}
```

## 📚 Documentation

### Complete Guides

- 📘 **[Metadata Blueprint](../docs/METADATA_BLUEPRINT.md)** - Complete implementation guide
- 📙 **[Quick Reference](../docs/METADATA_QUICK_REFERENCE.md)** - Copy-paste templates
- 📕 **[Examples](../docs/METADATA_EXAMPLES.md)** - Real-world implementations

### Module Structure

```
src/lib/metadata/
├── index.ts          # Main exports
├── types.ts          # TypeScript interfaces
├── config.ts         # Centralized configuration
└── utils.ts          # Generation utilities
```

## 🎨 Generated Metadata

The system automatically generates:

- Page titles with site name
- SEO-friendly descriptions
- Combined keyword lists
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs
- Robots directives (index/noindex)
- Theme colors
- And more!

## 📊 Current Implementation

### Pages with Metadata

- ✅ Dashboard (`/dashboard`)
- ✅ Categories (`/dashboard/categories`)
- ✅ Event Types (`/dashboard/event-types`)
- ✅ Roles (`/dashboard/roles`)
- ✅ Login (`/login`)
- ✅ Register (`/register`)

## 🔧 Configuration

### Site-Wide Settings

Edit `config.ts` to change global settings:

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

### Page-Specific Settings

Add pages to `pageMetadata` object in `config.ts`:

```typescript
export const pageMetadata = {
  dashboard: {
    title: "Dashboard",
    description: "Dashboard overview with statistics",
    keywords: ["dashboard", "overview", "statistics"],
  },
  // Add your pages here
} as const;
```

## 💡 Usage Examples

### Basic Usage

```tsx
import { generateMetadata, pageMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  page: pageMetadata.dashboard,
});
```

### Custom Metadata

```tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  page: {
    title: "Custom Page",
    description: "Custom description",
    keywords: ["custom"],
    noIndex: true, // Don't index this page
  },
});
```

### Dynamic Routes

```tsx
import { generateDynamicMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const data = await fetchData(params.id);
  return generateDynamicMetadata({
    title: data.name,
    description: data.description,
  });
}
```

## 🧪 Testing

Test your metadata implementation:

1. **Browser**: Check `<title>` and meta tags in DevTools
2. **Facebook**: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. **Twitter**: [Card Validator](https://cards-dev.twitter.com/validator)
4. **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

## 📋 Adding New Pages Checklist

- [ ] Add configuration to `src/lib/metadata/config.ts`
- [ ] Add metadata export to page/layout
- [ ] Verify title in browser tab
- [ ] Check meta tags in DevTools
- [ ] Test social sharing preview
- [ ] Update documentation

## 🎯 Best Practices

1. **Always use centralized config** for consistency
2. **Keep titles concise** (50-60 characters)
3. **Write compelling descriptions** (under 160 characters)
4. **Use 3-7 relevant keywords** per page
5. **Set `noIndex: true`** for admin/internal pages
6. **Test social sharing** before deploying

## 🚀 Future Enhancements

Consider adding:
- [ ] JSON-LD structured data
- [ ] Multilingual support (i18n)
- [ ] Dynamic OG image generation
- [ ] Automatic sitemap generation
- [ ] Metadata analytics tracking

## 🤝 Contributing

When adding new pages:

1. Follow the blueprint pattern
2. Add to centralized config
3. Test thoroughly
4. Update documentation

## 📞 Support

- **Issues**: Check existing pages for examples
- **Documentation**: See `/docs` folder
- **Questions**: Review the blueprint guide

## 📄 License

Part of the Cari Acara project.

---

**Version**: 1.0.0  
**Last Updated**: October 2, 2025  
**Maintainer**: Development Team

For detailed implementation guides, see the documentation in `/docs`.
