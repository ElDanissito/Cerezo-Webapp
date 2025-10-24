// components/ui/Spinner.tsx
import * as React from "react";

type SpinnerProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Texto accesible para screen readers (no se muestra visualmente) */
  label?: string;
};

const SIZE = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export default function Spinner({ size = "md", className = "", label }: SpinnerProps) {
  const s = SIZE[size] ?? SIZE.md;

  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <svg
        className={`animate-spin ${s} text-gray-400 ${className}`}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
