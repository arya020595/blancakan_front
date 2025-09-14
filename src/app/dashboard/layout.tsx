/**
 * Dashboard Layout
 * Protected layout for dashboard pages
 */

"use client";

import { HeaderLogoutButton } from "@/components/logout-button";
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
  const { isAuthenticated, checkAuth, setUser } = useAuthStore();
  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    // Check authentication status
    checkAuth();

    // Fetch user profile if authenticated
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, checkAuth, fetchProfile]);

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
              <a
                href="/dashboard"
                className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Dashboard
              </a>
              <a
                href="/dashboard/products"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Products
              </a>
              <a
                href="/dashboard/orders"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Orders
              </a>
              <a
                href="/dashboard/customers"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Customers
              </a>
              <a
                href="/dashboard/categories"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Categories
              </a>
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
