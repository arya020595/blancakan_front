/**
 * Authentication Loading Screens
 * Components for displaying loading and redirect states during authentication
 */

"use client";

/**
 * Loading component for authentication states
 */
export function AuthLoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

/**
 * Redirecting component for unauthenticated users
 */
export function AuthRedirectScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
