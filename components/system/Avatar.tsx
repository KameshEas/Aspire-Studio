/**
 * Avatar Component - User profile pictures with intelligent fallbacks
 * Features: image, initials, status badge, group display
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// ─── Avatar Variants ──────────────────────────────────────

const avatarVariants = cva(
  // Base avatar styles
  `
    inline-flex items-center justify-center
    bg-[color:var(--slate-200)] dark:bg-[color:var(--slate-700)]
    text-[color:var(--slate-900)] dark:text-[color:var(--slate-100)]
    font-semibold rounded-full overflow-hidden
    flex-shrink-0
    border-2 border-[color:var(--surface-1)] dark:border-[color:var(--surface-1)]
  `,
  {
    variants: {
      size: {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-2xl",
        "2xl": "w-20 h-20 text-3xl",
      },

      variant: {
        default: "bg-[color:var(--slate-200)] dark:bg-[color:var(--slate-700)]",
        primary: "bg-[color:var(--primary-100)] dark:bg-[color:var(--primary-900)] text-[color:var(--primary-900)] dark:text-[color:var(--primary-100)]",
        success: "bg-[color:var(--success-light)] dark:bg-[color:var(--emerald-900)] text-[color:var(--success-dark)] dark:text-[color:var(--emerald-100)]",
        warning: "bg-[color:var(--warning-light)] dark:bg-[color-mix(in_srgb,var(--warning)_20%,black)] text-[color:var(--warning-dark)] dark:text-[color:var(--warning)]",
        danger: "bg-[color:var(--danger-light)] dark:bg-[color-mix(in_srgb,var(--danger)_20%,black)] text-[color:var(--danger-dark)] dark:text-[color:var(--danger)]",
      },
    },

    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

// ─── Avatar Component ─────────────────────────────────────

export interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  name?: string;
  initials?: string;
  status?: "online" | "offline" | "away" | "busy";
  badge?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    { className, size, variant, src, alt, name, initials, status, badge, onError, ...props },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(!src);

    // Generate initials from name
    const getInitials = (): string => {
      if (initials) return initials;
      if (name) {
        return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      return "?";
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageError(true);
      onError?.(e);
    };

    return (
      <div className="relative inline-flex">
        {/* Image or Initials */}
        {src && !imageError ? (
          <img
            ref={ref}
            src={src}
            alt={alt || name || "User avatar"}
            className={avatarVariants({ size, variant, className })}
            onError={handleImageError}
            {...props}
          />
        ) : (
          <div className={avatarVariants({ size, variant, className })}>
            {getInitials()}
          </div>
        )}

        {/* Status Indicator */}
        {status && (
          <div
            className={`
              absolute bottom-0 right-0 rounded-full border-2 border-[color:var(--surface-1)]
              ${
                size === "xs"
                  ? "w-1.5 h-1.5"
                  : size === "sm"
                    ? "w-2 h-2"
                    : size === "md"
                      ? "w-2.5 h-2.5"
                      : "w-3 h-3"
              }
              ${
                status === "online"
                  ? "bg-[color:var(--success)]"
                  : status === "away"
                    ? "bg-[color:var(--warning)]"
                    : status === "busy"
                      ? "bg-[color:var(--danger)]"
                      : "bg-[color:var(--slate-500)]"
              }
            `}
            title={`Status: ${status}`}
          />
        )}

        {/* Badge */}
        {badge && <div className="absolute -top-1 -right-1">{badge}</div>}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// ─── Avatar Group Component ────────────────────────────────

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: VariantProps<typeof avatarVariants>["size"];
  max?: number;
  children: React.ReactElement<AvatarProps>[];
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, size = "md", max = 3, children, ...props }, ref) => {
    const displayedAvatars = Array.isArray(children) ? children.slice(0, max) : [children];
    const hiddenCount = Array.isArray(children) ? Math.max(0, children.length - max) : 0;

    const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
      xs: "w-6 h-6 -ml-2",
      sm: "w-8 h-8 -ml-2",
      md: "w-10 h-10 -ml-3",
      lg: "w-12 h-12 -ml-4",
      xl: "w-16 h-16 -ml-6",
      "2xl": "w-20 h-20 -ml-8",
    };

    return (
      <div
        ref={ref}
        className={`flex items-center ${className || ""}`}
        {...props}
      >
        {displayedAvatars.map((avatar, index) =>
          React.cloneElement(avatar, {
            key: avatar.key ?? index,
            size,
            className: sizeMap[size ?? "md"],
          } as AvatarProps)
        )}

        {hiddenCount > 0 && (
          <div className={`${sizeMap[size ?? "md"]} flex items-center justify-center rounded-full bg-[color:var(--slate-300)] dark:bg-[color:var(--slate-600)] text-xs font-semibold text-[color:var(--slate-900)] dark:text-[color:var(--slate-100)]`}>
            +{hiddenCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";
