/**
 * Dashboard Event Types Loading UI
 * Shown instantly when navigating to event types page
 */

import { DashboardPageLoading } from "@/components/loading";

export default function Loading() {
  return (
    <DashboardPageLoading title="Event Types" tableRows={10} tableColumns={6} />
  );
}
