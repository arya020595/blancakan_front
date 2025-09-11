/**
 * Auth Test Component
 * Simple component to test the authentication functionality
 */

"use client";

import { useLogin } from "@/hooks/auth-hooks";
import { useState } from "react";

export default function AuthTest() {
  const [credentials, setCredentials] = useState({
    email: "superadmin@example.com",
    password: "password123",
  });

  const { login, isLoading, error } = useLogin();

  const handleTest = async () => {
    console.log("Testing authentication with:", credentials);
    const success = await login(credentials);
    console.log("Login result:", success);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Auth Test</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleTest}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? "Testing..." : "Test Authentication"}
        </button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            <p className="font-medium">Error:</p>
            <p>{error.message}</p>
            {error.errors && (
              <pre className="mt-2 text-xs">
                {JSON.stringify(error.errors, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
