/**
 * Button Component - World-Class Premium SaaS Design
 * Variants: primary, secondary, outline, ghost, danger, success
 * Sizes: xs, sm, md, lg, xl
 * All states: default, hover, active, disabled, loading, focus
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// ─── Refined Button Variants ───────────────────────────────

const buttonVariants = cva(
  // Base styles - applying design system tokens
  `
    inline-flex items-center justify-center gap-2 font-medium
    whitespace-nowrap rounded-md
    transition-all duration-[var(--duration-base)] ease-[var(--easing-standard)]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-var(--primary-500) focus-visible:ring-offset-2
    dark:focus-visible:ring-var(--primary-400) dark:focus-visible:ring-offset-var(--bg)
    relative group
  `,
  {
    variants: {
      variant: {
        // Primary - Bold, high emphasis
        primary: `
          bg-var(--primary-600) text-white
          hover:bg-var(--primary-700) hover:shadow-[var(--shadow-md)]
          active:bg-var(--primary-800) active:shadow-[var(--shadow-base)]
          dark:bg-var(--primary-600) dark:hover:bg-var(--primary-500) dark:active:bg-var(--primary-700)
        `,

        // Secondary - Medium emphasis with background
        secondary: `
          bg-var(--slate-100) text-var(--slate-900)
          hover:bg-var(--slate-200) hover:shadow-[var(--shadow-sm)]
          active:bg-var(--slate-300)
          dark:bg-var(--slate-800) dark:text-var(--slate-50)
          dark:hover:bg-var(--slate-700) dark:active:bg-var(--slate-600)
        `,

        // Outline - Bordered, lower emphasis
        outline: `
          border-2 border-var(--border) bg-transparent text-var(--text)
          hover:border-var(--primary-600) hover:text-var(--primary-600) hover:bg-var(--primary-50)
          active:border-var(--primary-700) active:bg-var(--primary-100)
          dark:hover:bg-var(--primary-950) dark:active:bg-var(--primary-900)
        `,

        // Ghost - Minimal, text only
        ghost: `
          bg-transparent text-var(--primary-600)
          hover:bg-var(--primary-50) hover:text-var(--primary-700)
          active:bg-var(--primary-100)
          dark:text-var(--primary-400) dark:hover:bg-var(--primary-950)
          dark:active:bg-var(--primary-900)
        `,

        // Danger - For destructive actions
        danger: `
          bg-var(--danger) text-white
          hover:bg-[#dc2626] hover:shadow-[var(--shadow-md)]
          active:bg-[#b91c1c]
          dark:bg-var(--danger) dark:hover:bg-[#f87171] dark:active:bg-[#dc2626]
        `,

        // Success - For positive actions
        success: `
          bg-var(--success) text-white
          hover:bg-[#16a34a] hover:shadow-[var(--shadow-md)]
          active:bg-[#15803d]
          dark:bg-var(--success) dark:hover:bg-[#4ade80] dark:active:bg-[#16a34a]
        `,
      },

      size: {
        xs: "h-6 px-2 text-xs gap-1",
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2",
        xl: "h-14 px-8 text-base gap-3",
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

// ─── Button Component ─────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
        {loading && <LoadingSpinner size={size} />}

        {/* Icon (left) */}
        {!loading && icon && iconPosition === "left" && (
          <span className="inline-flex items-center justify-center flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label */}
        <span className={loading ? "opacity-0" : ""}>{children}</span>

        {/* Icon (right) */}
        {!loading && icon && iconPosition === "right" && (
          <span className="inline-flex items-center justify-center flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ─── Loading Spinner ──────────────────────────────────────

function LoadingSpinner({ size }: { size?: VariantProps<typeof buttonVariants>["size"] }) {
  const sizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const sz = sizeMap[size || "md"];

  return (
    <svg
      width={sz}
      height={sz}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin absolute"
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
  size?: "sm" | "md" | "lg";
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, orientation = "horizontal", size = "md" }, ref) => {
    const gapMap = { sm: "gap-1", md: "gap-2", lg: "gap-3" };

    return (
      <div
        ref={ref}
        className={`flex ${gapMap[size]} ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        }`}
        role="group"
      >
        {React.Children.map(children, (child) => (
          <>{child}</>
        ))}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// ─── Toggle Button ────────────────────────────────────────

export interface ToggleButtonProps extends Omit<ButtonProps, "aria-pressed" | "onToggle"> {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ isActive, onToggle, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={isActive ? "primary" : "outline"}
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
