/**
 * Button Component - Production-ready with accessibility and all states
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { colors, spacing, radius, motion, sizing } from "./tokens";

// ─── Variants ──────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles
  `
    inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-150 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
    dark:focus:ring-offset-gray-900
    active:scale-95 hover:scale-105
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800
          focus:ring-indigo-500 disabled:bg-indigo-400
          dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700
        `,
        secondary: `
          bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400
          focus:ring-gray-500 disabled:bg-gray-100
          dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600
          dark:active:bg-gray-500 dark:disabled:bg-gray-800
        `,
        ghost: `
          bg-transparent text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100
          focus:ring-indigo-500 disabled:text-gray-400
          dark:text-indigo-400 dark:hover:bg-indigo-950 dark:active:bg-indigo-900
        `,
        danger: `
          bg-red-600 text-white hover:bg-red-700 active:bg-red-800
          focus:ring-red-500 disabled:bg-red-400
          dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700
        `,
        success: `
          bg-green-600 text-white hover:bg-green-700 active:bg-green-800
          focus:ring-green-500 disabled:bg-green-400
          dark:bg-green-500 dark:hover:bg-green-600 dark:active:bg-green-700
        `,
      },

      size: {
        xs: "px-2 py-1 text-xs h-6 rounded-md",
        sm: "px-3 py-1.5 text-sm h-8 rounded-md",
        md: "px-4 py-2 text-sm h-10 rounded-lg",
        lg: "px-6 py-3 text-base h-12 rounded-lg",
        xl: "px-8 py-4 text-lg h-14 rounded-lg",
      },

      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },

      loading: {
        true: "cursor-wait",
        false: "",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      loading: false,
    },
  }
);

// ─── Component ────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  tooltip?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      disabled,
      loading,
      icon,
      iconPosition = "left",
      tooltip,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({
          variant,
          size,
          fullWidth,
          loading,
          className,
        })}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={props["aria-label"] || (typeof children === "string" ? children : undefined)}
        title={tooltip}
        {...props}
      >
        {/* Loading spinner */}
        {loading && <Spinner size={size} />}

        {/* Icon (left) */}
        {icon && iconPosition === "left" && (
          <span className="flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label */}
        {children}

        {/* Icon (right) */}
        {icon && iconPosition === "right" && (
          <span className="flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ─── Spinner ──────────────────────────────────────────────

function Spinner({ size }: { size?: VariantProps<typeof buttonVariants>["size"] }) {
  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  };

  return (
    <svg
      width={sizeMap[size || "md"]}
      height={sizeMap[size || "md"]}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

// ─── Button Group ────────────────────────────────────────

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, orientation = "horizontal" }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex gap-1 ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        }`}
        role="group"
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className={`
              first:rounded-l-lg last:rounded-r-lg
              ${orientation === "vertical" ? `
                first:rounded-t-lg first:rounded-b-none
                last:rounded-b-lg last:rounded-t-none
              ` : ""}
            `}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// ─── Toggle Button ────────────────────────────────────────

export interface ToggleButtonProps extends ButtonProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ isActive, onToggle, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={isActive ? "primary" : "secondary"}
        aria-pressed={isActive}
        onClick={(e) => {
          onToggle?.(!isActive);
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);

ToggleButton.displayName = "ToggleButton";
