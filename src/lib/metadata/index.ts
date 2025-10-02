/**
 * Metadata Module - Centralized metadata management
 * 
 * This module provides utilities for generating consistent,
 * SEO-friendly metadata across all pages in the application.
 * 
 * @example Quick usage with predefined config
 * ```ts
 * import { generateMetadata, pageMetadata } from "@/lib/metadata";
 * 
 * export const metadata = generateMetadata({
 *   page: pageMetadata.dashboard
 * });
 * ```
 * 
 * @example Custom metadata
 * ```ts
 * import { generateMetadata } from "@/lib/metadata";
 * 
 * export const metadata = generateMetadata({
 *   page: {
 *     title: "My Page",
 *     description: "Page description",
 *     keywords: ["keyword1", "keyword2"]
 *   }
 * });
 * ```
 */

export * from "./config";
export * from "./types";
export * from "./utils";

