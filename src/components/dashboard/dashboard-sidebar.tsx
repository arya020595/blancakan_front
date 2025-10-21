/**
 * Dashboard Sidebar Component
 * Navigation sidebar for dashboard pages
 */

"use client";

import { NavLink } from "@/components/nav/nav-link";
import { createLogger } from "@/lib/utils/logger";
import React from "react";

const logger = createLogger("DASHBOARD_SIDEBAR");

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
  icon?: React.ReactNode;
}

interface DashboardSidebarProps {
  /** Custom nav items to override defaults */
  navItems?: NavItem[];
  /** Site title/logo */
  title?: string;
  /** Additional className for styling */
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/categories", label: "Categories" },
  { href: "/dashboard/event-types", label: "Event Types" },
  { href: "/dashboard/events", label: "Events" },
  { href: "/dashboard/roles", label: "Roles" },
  { href: "/dashboard/permissions", label: "Permissions" },
];

function SidebarComponent({
  navItems = defaultNavItems,
  title = "Cari Acara",
  className = "",
}: DashboardSidebarProps) {
  React.useEffect(() => {
    logger.info("Sidebar rendered", { navItemsCount: navItems.length });
  }, [navItems.length]);

  return (
    <div className={`w-64 bg-white shadow-sm ${className}`}>
      {/* Logo/Title Section */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-6" role="navigation" aria-label="Dashboard navigation">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              exact={item.exact}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
              activeClassName="bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500">
              {item.icon && (
                <span className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Section (optional) */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Cari Acara
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized Sidebar export
 */
export const DashboardSidebar = React.memo(SidebarComponent);
