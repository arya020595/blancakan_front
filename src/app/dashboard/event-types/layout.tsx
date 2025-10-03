/**
 * Event Types Layout - Provides metadata for event types page
 */

import {
  generateMetadata as generateMeta,
  generateViewport,
  pageMetadata,
} from "@/lib/metadata";
import type { ReactNode } from "react";

/**
 * Generate metadata for Event Types page
 */
export const metadata = generateMeta({
  page: pageMetadata.eventTypes,
});

/**
 * Generate viewport configuration
 */
export const viewport = generateViewport();

export default function EventTypesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
