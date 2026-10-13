/**
 * Card Component - Versatile container for content
 * Variants: default, elevated, bordered, interactive, ghost
 * Perfect for dashboards, lists, galleries
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// ─── Card Variants ────────────────────────────────────────

const cardVariants = cva(
  // Base card styles
  `
    rounded-lg border transition-all duration-[var(--duration-base)] ease-[var(--easing-standard)]
    focus-within:ring-2 focus-within:ring-[color:var(--primary-500)] focus-within:ring-offset-2
    dark:focus-within:ring-offset-[color:var(--bg)]
  `,
  {
    variants: {
      variant: {
        default: `
          bg-[color:var(--surface-1)] border-[color:var(--border)]
          hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-sm)]
        `,
        elevated: `
          bg-[color:var(--surface-1)] border-[color:var(--border)]
          shadow-[var(--shadow-base)]
          hover:shadow-[var(--shadow-md)] hover:border-[color:var(--border-strong)]
        `,
        bordered: `
          bg-[color:var(--surface-1)] border-2 border-[color:var(--border-light)]
          hover:border-[color:var(--primary-500)] hover:bg-[color:var(--surface-2)]
        `,
        interactive: `
          bg-[color:var(--surface-1)] border-[color:var(--border)]
          cursor-pointer hover:bg-[color:var(--surface-2)] hover:shadow-[var(--shadow-md)] hover:border-[color:var(--primary-600)]
          active:bg-[color:var(--surface-active)]
        `,
        ghost: `
          bg-transparent border border-dashed border-[color:var(--border)]
          hover:border-[color:var(--primary-500)] hover:bg-[color:var(--surface-hover)]
        `,
      },

      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },

      interactive: {
        true: "cursor-pointer hover:shadow-[var(--shadow-md)]",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      padding: "md",
      interactive: false,
    },
  }
);

// ─── Card Component ───────────────────────────────────────

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      interactive,
      as: Component = "div",
      clickable,
      onClick,
      ...props
    },
    ref
  ) => {
    const isClickable = clickable || interactive || !!onClick;

    return (
      <Component
        ref={ref}
        className={cardVariants({
          variant: isClickable ? "interactive" : variant,
          padding,
          interactive: isClickable,
          className,
        })}
        onClick={onClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (isClickable && (e.key === "Enter" || e.key === " ")) {
            onClick?.(e as any);
          }
        }}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

// ─── Card Header ──────────────────────────────────────────

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-start justify-between pb-4 border-b border-[color:var(--border)] ${className || ""}`}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

// ─── Card Title ───────────────────────────────────────────

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-lg font-semibold text-[color:var(--text)] ${className || ""}`}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

// ─── Card Description ─────────────────────────────────────

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-[color:var(--text-secondary)] ${className || ""}`}
      {...props}
    />
  )
);

CardDescription.displayName = "CardDescription";

// ─── Card Content ─────────────────────────────────────────

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`pt-4 ${className || ""}`}
      {...props}
    />
  )
);

CardContent.displayName = "CardContent";

// ─── Card Footer ──────────────────────────────────────────

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center justify-end gap-2 pt-4 border-t border-[color:var(--border)] ${className || ""}`}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";

// ─── Card Badge (Status Indicator) ─────────────────────────

export interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export const CardBadge = forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    const variants = {
      default: "bg-[color:var(--slate-100)] text-[color:var(--slate-900)] dark:bg-[color:var(--slate-800)] dark:text-[color:var(--slate-50)]",
      primary: "bg-[color:var(--primary-100)] text-[color:var(--primary-900)] dark:bg-[color:var(--primary-900)] dark:text-[color:var(--primary-100)]",
      success: "bg-[color:var(--success-light)] text-[color:var(--success-dark)] dark:bg-[color:var(--emerald-900)] dark:text-[color:var(--emerald-100)]",
      warning: "bg-[color:var(--warning-light)] text-[color:var(--warning-dark)] dark:bg-[color-mix(in_srgb,var(--warning)_20%,black)] dark:text-[color:var(--warning)]",
      danger: "bg-[color:var(--danger-light)] text-[color:var(--danger-dark)] dark:bg-[color-mix(in_srgb,var(--danger)_20%,black)] dark:text-[color:var(--danger)]",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs font-medium rounded-md",
      md: "px-3 py-1 text-sm font-medium rounded-md",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center ${sizes[size]} ${variants[variant]} ${className || ""}`}
        {...props}
      />
    );
  }
);

CardBadge.displayName = "CardBadge";
