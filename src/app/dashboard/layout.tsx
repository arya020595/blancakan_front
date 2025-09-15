/**
 * Dashboard Layout
 * Protected layout for dashboard pages
 */

"use client";

import { HeaderLogoutButton } from "@/components/logout-button";
import { NavLink } from "@/components/nav/nav-link";
import { ProtectedLayout } from "@/components/protected-layout";
import { useProfile } from "@/hooks/auth-hooks";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useEffect } from "react";

const logger = createLogger("DASHBOARD");

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout redirectTo="/login" enableLogging={true}>
      <DashboardContent>{children}</DashboardContent>
    </ProtectedLayout>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  // User profile management (only runs when authenticated)
  const { setUser } = useAuthStore();
  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    // Fetch user profile when component mounts (user is guaranteed to be authenticated)
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile, setUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-900">
              E-commerce Dashboard
            </h1>
          </div>
          <nav className="mt-8">
            <div className="px-3 space-y-1">
              <NavLink
                href="/dashboard"
                exact
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Dashboard
              </NavLink>

              <NavLink
                href="/dashboard/categories"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Categories
              </NavLink>

              <NavLink
                href="/dashboard/event-types"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Event Types
              </NavLink>

              <NavLink
                href="/dashboard/roles"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Roles
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Dashboard
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  {profile && (
                    <div className="text-sm text-gray-700">
                      Welcome, {profile.name}
                    </div>
                  )}
                  <HeaderLogoutButton
                    className="ml-4"
                    onLogoutStart={() => logger.info("User initiated logout")}
                    onLogoutComplete={() => logger.info("Logout completed")}
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
