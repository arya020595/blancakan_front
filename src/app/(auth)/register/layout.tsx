/**
 * Register Layout - Provides metadata for register page
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

/**
 * Generate metadata for Register page
 */
export const metadata = generateMeta({
  page: pageMetadata.register,
});

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
