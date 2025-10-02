/**
 * Categories Layout - Provides metadata for categories page
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

/**
 * Generate metadata for Categories page
 */
export const metadata = generateMeta({
  page: pageMetadata.categories,
});

export default function CategoriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
