/**
 * Logout Button Component
 * Reusable logout button with proper state management and loading indicators
 * Follows SOLID principles and provides excellent UX
 */

"use client";

import { useLogout } from "@/hooks/auth-hooks";
import { createLogger } from "@/lib/utils/logger";
import React from "react";

const logger = createLogger("LOGOUT BUTTON");

// Component props interface
interface LogoutButtonProps {
  /** Button text when not loading */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Show loading spinner */
  showSpinner?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Button variant */
  variant?: "default" | "header" | "sidebar" | "danger";
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Callback after successful logout */
  onLogoutComplete?: () => void;
  /** Callback when logout starts */
  onLogoutStart?: () => void;
}

// Variant styles
const variantStyles = {
  default:
    "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
  header: "text-gray-500 hover:text-gray-700 bg-transparent",
  sidebar: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
  danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
};

// Size styles
const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2 text-base",
};

const LogoutButton: React.FC<LogoutButtonProps> = ({
  children = "Logout",
  className = "",
  showSpinner = true,
  loadingText = "Logging out...",
  variant = "default",
  size = "md",
  onLogoutComplete,
  onLogoutStart,
}) => {
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    try {
      logger.info("Logout button clicked");

      if (onLogoutStart) {
        onLogoutStart();
      }

      await logout();

      if (onLogoutComplete) {
        onLogoutComplete();
      }
    } catch (error) {
      logger.error("Logout button error", error);
    }
  };

  const baseClasses = `
    inline-flex items-center space-x-2 font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `
    .replace(/\s+/g, " ")
    .trim();

  const buttonClasses = `
    ${baseClasses}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={buttonClasses}
      type="button"
      aria-label={isLoading ? loadingText : "Logout"}>
      {isLoading && showSpinner && (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
      )}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
};

// Preset logout buttons for common use cases
export const HeaderLogoutButton: React.FC<
  Omit<LogoutButtonProps, "variant" | "size">
> = (props) => <LogoutButton {...props} variant="header" size="sm" />;

export const SidebarLogoutButton: React.FC<
  Omit<LogoutButtonProps, "variant">
> = (props) => <LogoutButton {...props} variant="sidebar" />;

export const DangerLogoutButton: React.FC<
  Omit<LogoutButtonProps, "variant">
> = (props) => <LogoutButton {...props} variant="danger" />;

// Logout menu item component for dropdowns
interface LogoutMenuItemProps {
  onClick?: () => void;
  className?: string;
}

export const LogoutMenuItem: React.FC<LogoutMenuItemProps> = ({
  onClick,
  className = "",
}) => {
  const { logout, isLoading } = useLogout();

  const handleClick = async () => {
    if (onClick) {
      onClick();
    }
    await logout();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}>
      {isLoading && (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-500"></div>
      )}
      <span>{isLoading ? "Logging out..." : "Sign out"}</span>
    </button>
  );
};

export default LogoutButton;
