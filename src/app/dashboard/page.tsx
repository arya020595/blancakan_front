/**
 * Dashboard Page (Protected Server Component)
 * Shows how to use server-side data fetching with authentication protection
 * Follows SOLID principles with proper separation of concerns
 */

import { ServerAuthService } from "@/lib/auth/server-auth-guard";

export default async function DashboardPage() {
  // Require authentication before proceeding
  // This will automatically redirect to login if not authenticated
  await ServerAuthService.requireAuthentication();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">Welcome to your e-commerce dashboard</p>
      </div>
    </div>
  );
}
