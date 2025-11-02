/**
 * Dashboard Layout
 * Protected layout for dashboard pages with separated components
 */

import {
  DashboardMainContent,
  DashboardSidebar,
  MainContentSkeleton,
} from "@/components/dashboard";
import { ProtectedLayout } from "@/components/protected-layout";
import { createLogger } from "@/lib/utils/logger";
import React, { Suspense } from "react";

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
          {/* Sidebar with No Suspense */}
          {/* Don’t wrap in Suspense unless it actually waits for data. */}
          <DashboardSidebar />

          {/* Main content with Suspense */}
          <Suspense fallback={<MainContentSkeleton />}>
            <DashboardMainContent>{children}</DashboardMainContent>
          </Suspense>
        </div>
      </div>
    </ProtectedLayout>
  );
}
