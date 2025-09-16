/**
 * Dashboard Categories Loading UI
 * Shown instantly when navigating to categories page
 */

import { DashboardPageLoading } from "@/components/loading";

export default function Loading() {
  return (
    <DashboardPageLoading title="Categories" tableRows={10} tableColumns={5} />
  );
}
