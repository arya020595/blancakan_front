/**
 * Dashboard Page (Protected Server Component)
 * Shows how to use server-side data fetching with authentication protection
 * Follows SOLID principles with proper separation of concerns
 */

import DashboardClient from "@/app/dashboard/dashboard-client";
import { DashboardStats } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Mock data for now (not calling any APIs)
  const mockStats: DashboardStats = {
    total_categories: 0,
    total_event_types: 0,
    active_categories: 0,
    active_event_types: 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Pass mock data to client component */}
      <DashboardClient initialStats={mockStats} />
    </div>
  );
}
