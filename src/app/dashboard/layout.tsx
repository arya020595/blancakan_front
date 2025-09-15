/**
 * Dashboard Layout
 * Protected layout for dashboard pages
 */

"use client";

import { HeaderLogoutButton } from "@/components/logout-button";
import { NavLink } from "@/components/nav/nav-link";
import { useProfile } from "@/hooks/auth-hooks";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const logger = createLogger("DASHBOARD");

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NavLink handles active logic (exact vs prefix) centrally
  const { isAuthenticated, checkAuth, setUser, isLoading, hasHydrated } =
    useAuthStore();
  const { profile, fetchProfile } = useProfile();
  const router = useRouter();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only check auth after store has hydrated
    if (hasHydrated) {
      logger.info(
        "Dashboard layout mounted and store hydrated, checking authentication"
      );
      checkAuth();
      setHasInitialized(true);
    }
  }, [checkAuth, hasHydrated]);

  useEffect(() => {
    // Fetch user profile if authenticated
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile, setUser]);

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    logger.debug("Auth redirect check", {
      hasInitialized,
      isLoading,
      isAuthenticated,
      hasHydrated,
    });

    if (hasInitialized && !isLoading && !isAuthenticated) {
      logger.info("User not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, hasInitialized, router]);

  // Show loading while checking authentication or before initialization or hydration
  if (!hasHydrated || !hasInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!hasHydrated ? "Loading..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
                href="/dashboard/products"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Products
              </NavLink>

              <NavLink
                href="/dashboard/orders"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Orders
              </NavLink>

              <NavLink
                href="/dashboard/customers"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Customers
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
