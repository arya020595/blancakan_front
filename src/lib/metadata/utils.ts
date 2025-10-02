/**
 * Metadata Generation Utilities
 * Reusable functions for generating Next.js metadata
 */

import { Metadata } from "next";
import { siteConfig } from "./config";
import { MetadataOptions, PageMetadata, SiteMetadata } from "./types";

/**
 * Generate complete Next.js metadata from page configuration
 * 
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   page: {
 *     title: "Dashboard",
 *     description: "View your dashboard",
 *     keywords: ["dashboard", "overview"]
 *   }
 * });
 * ```
 */
export function generateMetadata(options: MetadataOptions): Metadata {
  const site = { ...siteConfig, ...options.site };
  const { page } = options;

  // Combine site and page keywords
  const keywords = [
    ...(site.defaultKeywords || []),
    ...(page.keywords || []),
  ];

  // Generate full title
  const title = `${page.title} | ${site.siteName}`;

  // Generate URLs
  const url = page.canonicalUrl || site.baseUrl;
  const ogImage = page.ogImage || site.defaultOgImage;
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${site.baseUrl}${ogImage}`;

  // Build robots directive
  const robots: Metadata["robots"] = {
    index: !page.noIndex,
    follow: !page.noFollow,
  };

  return {
    title,
    description: page.description,
    keywords: keywords.join(", "),
    authors: [{ name: site.siteName }],
    creator: site.siteName,
    publisher: site.siteName,
    robots,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.siteName,
      title: page.title,
      description: page.description,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: page.twitterCard || "summary_large_image",
      site: site.twitterHandle,
      creator: site.twitterHandle,
      title: page.title,
      description: page.description,
      images: [absoluteOgImage],
    },
    ...(site.themeColor && {
      themeColor: site.themeColor,
    }),
  };
}

/**
 * Quick metadata generator using predefined page configuration
 * 
 * @example
 * ```ts
 * export const metadata = createPageMetadata("dashboard");
 * ```
 */
export function createPageMetadata(
  pageKey: string,
  overrides?: Partial<PageMetadata>
): Metadata {
  // This is a simplified version - you can enhance it to pull from config
  return generateMetadata({
    page: {
      title: pageKey,
      description: `${pageKey} page`,
      ...overrides,
    },
  });
}

/**
 * Helper to merge custom metadata with site defaults
 */
export function mergeMetadata(
  baseMetadata: Metadata,
  customMetadata: Partial<Metadata>
): Metadata {
  return {
    ...baseMetadata,
    ...customMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      ...customMetadata.openGraph,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...customMetadata.twitter,
    },
  };
}

/**
 * Generate metadata for dynamic routes
 * 
 * @example
 * ```ts
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const item = await fetchItem(params.id);
 *   return generateDynamicMetadata({
 *     title: item.name,
 *     description: item.description,
 *   });
 * }
 * ```
 */
export function generateDynamicMetadata(
  page: PageMetadata,
  siteOverrides?: Partial<SiteMetadata>
): Metadata {
  return generateMetadata({
    page,
    site: siteOverrides,
  });
}
