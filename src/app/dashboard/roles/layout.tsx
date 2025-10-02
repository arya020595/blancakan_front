/**
 * Roles Layout - Provides metadata for roles page
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

/**
 * Generate metadata for Roles page
 */
export const metadata = generateMeta({
  page: pageMetadata.roles,
});

export default function RolesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
