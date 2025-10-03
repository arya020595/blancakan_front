/**
 * Categories Layout - Provides metadata for categories page
 */

import {
  generateMetadata as generateMeta,
  generateViewport,
  pageMetadata,
} from "@/lib/metadata";
import type { ReactNode } from "react";

/**
 * Generate metadata for Categories page
 */
export const metadata = generateMeta({
  page: pageMetadata.categories,
});

/**
 * Generate viewport configuration
 */
export const viewport = generateViewport();

export default function CategoriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
