/**
 * Site-wide Metadata Configuration
 * Central configuration for consistent metadata across all pages
 */

import { SiteMetadata } from "./types";

/**
 * Site-wide metadata defaults
 * Edit this configuration to change metadata across the entire site
 */
export const siteConfig: SiteMetadata = {
  siteName: "Cari Acara",
  description:
    "Event management platform for discovering and managing events, categories, and roles",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  defaultOgImage: "/images/og-default.jpg",
  twitterHandle: "@cariacara",
  defaultKeywords: [
    "events",
    "event management",
    "categories",
    "event types",
    "dashboard",
  ],
  themeColor: "#4F46E5",
  locale: "en_US",
};

/**
 * Page-specific metadata configurations
 * Add new pages here for consistent metadata management
 */
export const pageMetadata = {
  // Auth pages
  login: {
    title: "Login",
    description: "Sign in to your Cari Acara account to manage events",
    keywords: ["login", "sign in", "authentication"],
  },
  register: {
    title: "Register",
    description: "Create a new Cari Acara account to start managing events",
    keywords: ["register", "sign up", "create account"],
  },

  // Dashboard pages
  dashboard: {
    title: "Dashboard",
    description:
      "Dashboard overview with statistics and quick access to manage categories, event types, and roles",
    keywords: ["dashboard", "overview", "statistics", "analytics"],
  },
  categories: {
    title: "Categories",
    description:
      "Manage event categories with create, edit, and delete operations. Organize your events efficiently.",
    keywords: ["categories", "event categories", "manage categories"],
  },
  eventTypes: {
    title: "Event Types",
    description:
      "Manage event types with complete CRUD operations. Define and organize different types of events.",
    keywords: ["event types", "event management", "manage event types"],
  },
  roles: {
    title: "Roles",
    description:
      "Manage user roles and permissions. Control access and responsibilities within your organization.",
    keywords: ["roles", "permissions", "user management", "access control"],
  },
} as const;

/**
 * Type-safe page metadata keys
 */
export type PageMetadataKey = keyof typeof pageMetadata;
