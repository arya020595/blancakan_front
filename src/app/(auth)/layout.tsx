/**
 * Auth Layout
 * Layout for authentication pages (login, register)
 * Redirects authenticated users to dashboard
 */

"use client";

import { AuthRouteGuard } from "@/components/auth-route-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRouteGuard>{children}</AuthRouteGuard>;
}
