/**
 * Login Layout - Provides metadata for login page
 */

import { generateMetadata as generateMeta, pageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";

/**
 * Generate metadata for Login page
 */
export const metadata = generateMeta({
  page: pageMetadata.login,
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
