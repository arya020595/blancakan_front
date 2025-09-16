/**
 * Dashboard Roles Loading UI
 * Shown instantly when navigating to roles page
 */

import { DashboardPageLoading } from "@/components/loading";

export default function Loading() {
  return <DashboardPageLoading title="Roles" tableRows={10} tableColumns={5} />;
}
