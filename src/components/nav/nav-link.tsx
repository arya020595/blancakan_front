"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavLinkProps = {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
};

export function NavLink({
  href,
  exact = false,
  className = "",
  activeClassName = "bg-gray-100 text-gray-900",
  children,
}: NavLinkProps) {
  const pathname = usePathname();

  // Normalization: remove trailing slashes for consistent matching
  const normalize = (p: string | null) => {
    if (!p) return "";
    return p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
  };

  const current = normalize(pathname);
  const target = normalize(href);

  const active = exact
    ? current === target
    : current === target || current.startsWith(target + "/");

  const combined = `${className} ${
    active
      ? activeClassName
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }`.trim();

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={combined}>
      {children}
    </Link>
  );
}
