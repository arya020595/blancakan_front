/**
 * Dashboard Main Content Component
 * Main content area with header and content wrapper
 */

"use client";

import { createLogger } from "@/lib/utils/logger";
import React from "react";
import { DashboardHeader } from "./dashboard-header";

const logger = createLogger("DASHBOARD_MAIN");

interface DashboardMainContentProps {
  /** Page content to render */
  children: React.ReactNode;
  /** Page title for header */
  title?: string;
  /** Additional header actions */
  headerActions?: React.ReactNode;
  /** Custom header component */
  customHeader?: React.ReactNode;
  /** Additional className for main container */
  className?: string;
  /** Whether to show header */
  showHeader?: boolean;
}

export function DashboardMainContent({
  children,
  title = "Dashboard",
  headerActions,
  customHeader,
  className = "",
  showHeader = true,
}: DashboardMainContentProps) {
  React.useEffect(() => {
    logger.info("Main content rendered", { title, showHeader });
  }, [title, showHeader]);

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      {/* Header Section */}
      {showHeader &&
        (customHeader || (
          <DashboardHeader title={title} actions={headerActions} />
        ))}

      {/* Main Content Section */}
      <main className="flex-1 overflow-auto">
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
