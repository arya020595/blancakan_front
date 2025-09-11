/**
 * Logout Demo Page
 * Demonstrates various logout implementations and options
 */

"use client";

import LogoutButton, {
  DangerLogoutButton,
  HeaderLogoutButton,
  LogoutMenuItem,
  SidebarLogoutButton,
} from "@/components/logout-button";
import { useLogoutService } from "@/lib/auth/logout-service";

export default function LogoutDemoPage() {
  const {
    performLogout,
    emergencyLogout,
    logoutWithConfirmation,
    checkInactivityLogout,
  } = useLogoutService();

  const handleProgrammaticLogout = async () => {
    await performLogout({
      redirectTo: "/login?demo=programmatic",
      clearLocalStorage: true,
      showLoading: true,
    });
  };

  const handleEmergencyLogout = () => {
    emergencyLogout();
  };

  const handleConfirmationLogout = async () => {
    await logoutWithConfirmation(
      "Are you sure you want to logout from the demo?"
    );
  };

  const simulateInactivityCheck = () => {
    // Simulate user was last active 45 minutes ago
    const lastActivity = new Date(Date.now() - 45 * 60 * 1000);
    checkInactivityLogout(lastActivity, 30); // 30 minute timeout
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Logout Implementation Demo
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive logout functionality with multiple variants and
            methods
          </p>
        </div>

        {/* Button Variants Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Button Variants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Default</h3>
              <LogoutButton>Logout</LogoutButton>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Header Style
              </h3>
              <HeaderLogoutButton />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Sidebar Style
              </h3>
              <SidebarLogoutButton />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Danger Style
              </h3>
              <DangerLogoutButton />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Menu Item
            </h3>
            <div className="border border-gray-200 rounded-md w-48">
              <LogoutMenuItem />
            </div>
          </div>
        </div>

        {/* Programmatic Methods Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Programmatic Methods
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleProgrammaticLogout}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Programmatic Logout</h3>
              <p className="text-sm text-gray-600 mt-1">
                Full logout with custom options and redirect
              </p>
            </button>

            <button
              onClick={handleConfirmationLogout}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Confirmation Logout</h3>
              <p className="text-sm text-gray-600 mt-1">
                Logout with user confirmation dialog
              </p>
            </button>

            <button
              onClick={handleEmergencyLogout}
              className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-left">
              <h3 className="font-medium text-red-900">Emergency Logout</h3>
              <p className="text-sm text-red-600 mt-1">
                Immediate logout clearing all data
              </p>
            </button>

            <button
              onClick={simulateInactivityCheck}
              className="p-4 border border-yellow-300 rounded-lg hover:bg-yellow-50 text-left">
              <h3 className="font-medium text-yellow-900">Inactivity Check</h3>
              <p className="text-sm text-yellow-600 mt-1">
                Simulate inactivity timeout logout
              </p>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Features Implemented
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Security Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Server-side token invalidation</li>
                <li>✅ Local storage cleanup</li>
                <li>✅ Authentication state clearing</li>
                <li>✅ Emergency logout for security issues</li>
                <li>✅ Inactivity timeout detection</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">UX Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Loading states and spinners</li>
                <li>✅ Multiple button variants</li>
                <li>✅ Confirmation dialogs</li>
                <li>✅ Custom redirect URLs</li>
                <li>✅ Error handling and fallbacks</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Implementation Benefits
            </h3>
            <p className="text-sm text-blue-700">
              Following SOLID principles, this logout system is reusable,
              maintainable, and provides comprehensive security while
              maintaining excellent user experience. All components are properly
              typed and include comprehensive error handling.
            </p>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
