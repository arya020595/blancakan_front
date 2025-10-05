"use client";

import * as React from "react";

export interface SpinnerProps {
  size?: number; // px
  className?: string;
  ariaLabel?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 16,
  className = "",
  ariaLabel = "Loading",
}) => {
  const stroke = Math.max(2, Math.floor(size / 8));
  return (
    <svg
      className={`${className} animate-spin`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="status"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default Spinner;
