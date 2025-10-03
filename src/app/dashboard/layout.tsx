/**
 * Dashboard Layout
 * Protected layout for dashboard pages with separated components
 */

"use client";

import {
  DashboardMainContent,
  DashboardSidebar,
  MainContentSkeleton,
  SidebarSkeleton,
} from "@/components/dashboard";
import { ProtectedLayout } from "@/components/protected-layout";
import { createLogger } from "@/lib/utils/logger";
import React from "react";

const logger = createLogger("DASHBOARD");

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout redirectTo="/login" enableLogging={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar with Suspense */}
          <React.Suspense fallback={<SidebarSkeleton />}>
            <DashboardSidebar />
          </React.Suspense>

          {/* Main content with Suspense */}
          <React.Suspense fallback={<MainContentSkeleton />}>
            <DashboardMainContent>{children}</DashboardMainContent>
          </React.Suspense>
        </div>
      </div>
    </ProtectedLayout>
  );
}
