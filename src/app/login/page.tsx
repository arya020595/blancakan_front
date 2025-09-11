/**
 * Login Page
 * Example implementation showing API integration
 * Protected from authenticated users - redirects to dashboard if already logged in
 */

"use client";

import { useLogin } from "@/hooks/auth-hooks";
import { withRedirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define the component without default export first
function LoginPageComponent() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { login, isLoading, error } = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 [LOGIN PAGE] Form submitted with credentials:", {
      email: credentials.email,
      hasPassword: !!credentials.password,
    });

    const success = await login(credentials);
    if (success) {
      console.log("✅ [LOGIN PAGE] Login successful, handling redirect...");
      // Redirect to dashboard or the intended page
      const redirectUrl =
        new URLSearchParams(window.location.search).get("redirect") ||
        "/dashboard";
      console.log("🔄 [LOGIN PAGE] Redirecting to:", redirectUrl);
      router.push(redirectUrl);
    } else {
      console.log("❌ [LOGIN PAGE] Login failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error.message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Export the component wrapped with redirect protection
export default withRedirectIfAuthenticated(LoginPageComponent, {
  redirectTo: "/dashboard",
  loadingComponent: ({ message }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
        <p className="mt-2 text-sm text-gray-500">
          You will be redirected shortly...
        </p>
      </div>
    </div>
  ),
});
