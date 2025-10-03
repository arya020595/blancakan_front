/**
 * Dashboard Header Component
 * Header with user profile and logout functionality
 */

"use client";

import { HeaderLogoutButton } from "@/components/logout-button";
import { useProfile } from "@/hooks/auth-hooks";
import { createLogger } from "@/lib/utils/logger";
import { useAuthStore } from "@/store";
import React, { useEffect } from "react";

const logger = createLogger("DASHBOARD_HEADER");

interface DashboardHeaderProps {
  /** Page title to display in header */
  title?: string;
  /** Additional actions to display in header */
  actions?: React.ReactNode;
  /** Additional className for styling */
  className?: string;
}

export function DashboardHeader({
  title = "Dashboard",
  actions,
  className = "",
}: DashboardHeaderProps) {
  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Title */}
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {actions && (
              <div className="flex items-center space-x-2">{actions}</div>
            )}

            <React.Suspense fallback={<UserProfileSkeleton />}>
              <UserProfile />
            </React.Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * User Profile Section with Profile Management
 */
function UserProfile() {
  const { setUser } = useAuthStore();
  const { profile, fetchProfile, isLoading, error } = useProfile();

  useEffect(() => {
    // Fetch user profile when component mounts (user is guaranteed to be authenticated)
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setUser(profile);
      logger.info("User profile loaded", {
        userId: profile.id,
        name: profile.name,
      });
    }
  }, [profile, setUser]);

  if (error) {
    logger.error("Failed to load user profile", error);
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-red-600">Failed to load profile</div>
        <HeaderLogoutButton
          className="ml-4"
          onLogoutStart={() => logger.info("User initiated logout")}
          onLogoutComplete={() => logger.info("Logout completed")}
        />
      </div>
    );
  }

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="flex items-center space-x-4">
      {profile && (
        <div className="flex items-center space-x-3">
          {/* Profile Avatar */}
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Welcome Message */}
          <div className="text-sm text-gray-700">
            Welcome, <span className="font-medium">{profile.name}</span>
          </div>
        </div>
      )}

      <HeaderLogoutButton
        className="ml-4"
        onLogoutStart={() => logger.info("User initiated logout")}
        onLogoutComplete={() => logger.info("Logout completed")}
      />
    </div>
  );
}

/**
 * Loading skeleton for user profile section
 */
function UserProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  );
}
