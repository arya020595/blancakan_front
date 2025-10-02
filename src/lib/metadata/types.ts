/**
 * Metadata Types
 * Type definitions for Next.js metadata generation
 */


/**
 * Page-specific metadata configuration
 */
export interface PageMetadata {
  /** Page title (will be appended with site name) */
  title: string;
  /** Page description */
  description: string;
  /** Keywords for SEO */
  keywords?: readonly string[] | string[];
  /** Open Graph image URL */
  ogImage?: string;
  /** Twitter card type */
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  /** Canonical URL override */
  canonicalUrl?: string;
  /** Whether to index this page */
  noIndex?: boolean;
  /** Whether to follow links on this page */
  noFollow?: boolean;
}

/**
 * Site-wide metadata configuration
 */
export interface SiteMetadata {
  /** Site name */
  siteName: string;
  /** Default site description */
  description: string;
  /** Base URL */
  baseUrl: string;
  /** Default OG image */
  defaultOgImage: string;
  /** Twitter handle */
  twitterHandle?: string;
  /** Default keywords */
  defaultKeywords: readonly string[] | string[];
  /** Theme color */
  themeColor?: string;
  /** Site locale */
  locale?: string;
}

/**
 * Metadata generation options
 */
export interface MetadataOptions {
  /** Page-specific metadata */
  page: PageMetadata;
  /** Site-wide metadata (optional override) */
  site?: Partial<SiteMetadata>;
}
