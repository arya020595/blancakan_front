/**
 * Dashboard Components - Barrel Exports
 * Centralized exports for all dashboard components
 */

export { DashboardHeader } from "./dashboard-header";
export { DashboardMainContent } from "./dashboard-main-content";
export { DashboardSidebar } from "./dashboard-sidebar";

// Re-export loading components for convenience
export {
  MainContentSkeleton,
  SidebarSkeleton,
} from "../loading/dashboard-loading";
