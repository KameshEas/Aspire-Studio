/**
 * Badge & Status Component - Display status, tags, states
 * Used for: generation status, tags, labels, state indicators
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// ─── Badge Variants ───────────────────────────────────────

const badgeVariants = cva(
  // Base badge styles
  `
    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
    font-medium text-xs transition-all duration-[var(--duration-base)]
    whitespace-nowrap
  `,
  {
    variants: {
      variant: {
        default: "bg-[color:var(--slate-100)] text-[color:var(--slate-900)] dark:bg-[color:var(--slate-800)] dark:text-[color:var(--slate-50)]",
        primary: "bg-[color:var(--primary-100)] text-[color:var(--primary-900)] dark:bg-[color:var(--primary-900)] dark:text-[color:var(--primary-100)]",
        success: "bg-[color:var(--success-light)] text-[color:var(--success-dark)] dark:bg-[color:var(--emerald-900)] dark:text-[color:var(--emerald-100)]",
        warning: "bg-[color:var(--warning-light)] text-[color:var(--warning-dark)] dark:bg-[color-mix(in_srgb,var(--warning)_20%,black)] dark:text-[color:var(--warning)]",
        danger: "bg-[color:var(--danger-light)] text-[color:var(--danger-dark)] dark:bg-[color-mix(in_srgb,var(--danger)_20%,black)] dark:text-[color:var(--danger)]",
        info: "bg-[color:var(--info-light)] text-[color:var(--info-dark)] dark:bg-[color-mix(in_srgb,var(--info)_20%,black)] dark:text-[color:var(--info)]",
        pending: "bg-[color-mix(in_srgb,var(--pending)_15%,white)] text-[color:var(--pending)] dark:bg-[color-mix(in_srgb,var(--pending)_20%,black)]",
        processing: "bg-[color-mix(in_srgb,var(--processing)_15%,white)] text-[color:var(--processing)] dark:bg-[color-mix(in_srgb,var(--processing)_20%,black)]",
      },

      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },

      removable: {
        true: "pr-1",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
      removable: false,
    },
  }
);

// ─── Badge Component ──────────────────────────────────────

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  onRemove?: () => void;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      onRemove,
      dot,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={badgeVariants({
          variant,
          size,
          removable: !!onRemove,
          className,
        })}
        {...props}
      >
        {/* Status dot */}
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-current opacity-60"
            aria-hidden="true"
          />
        )}

        {/* Icon */}
        {icon && <span className="inline-flex flex-shrink-0">{icon}</span>}

        {/* Label */}
        <span>{children}</span>

        {/* Remove button */}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 inline-flex items-center justify-center rounded hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 dark:focus:ring-offset-[color:var(--bg)]"
            aria-label={`Remove ${children}`}
            tabIndex={-1}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// ─── Status Badge Component ────────────────────────────────

export type StatusType = "pending" | "processing" | "succeeded" | "failed" | "queued" | "archived";

const statusConfig: Record<StatusType, { variant: VariantProps<typeof badgeVariants>["variant"]; label: string; icon?: string }> = {
  pending: { variant: "pending", label: "Pending" },
  processing: { variant: "processing", label: "Processing" },
  succeeded: { variant: "success", label: "Succeeded" },
  failed: { variant: "danger", label: "Failed" },
  queued: { variant: "info", label: "Queued" },
  archived: { variant: "default", label: "Archived" },
};

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: StatusType;
  showLabel?: boolean;
  animated?: boolean;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, showLabel = true, animated, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        dot={animated && (status === "processing" || status === "pending")}
        className={animated && (status === "processing" || status === "pending") ? "animate-pulse" : ""}
        {...props}
      >
        {showLabel ? config.label : props.children}
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

// ─── Tag Component ────────────────────────────────────────

export interface TagProps extends Omit<BadgeProps, "dot"> {
  onClick?: () => void;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant = "default",
      size = "sm",
      icon,
      onRemove,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Component = onClick ? "button" : "span";

    return (
      <Component
        ref={ref as any}
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`
          ${badgeVariants({
            variant,
            size,
            removable: !!onRemove,
            className,
          })}
          ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        `}
        {...(props as any)}
      >
        {icon && <span className="inline-flex flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 inline-flex items-center justify-center hover:opacity-70"
            aria-label={`Remove ${children}`}
            tabIndex={-1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </Component>
    );
  }
);

Tag.displayName = "Tag";
