/**
 * Layout Components - Responsive grid, flex, and container utilities
 */

import React from "react";

// ─── Container ────────────────────────────────────────────

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", padding = "md", ...props }, ref) => {
    const sizeMap = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "w-full",
    };

    const paddingMap = {
      none: "",
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
    };

    return (
      <div
        ref={ref}
        className={`
          mx-auto w-full
          ${sizeMap[size]}
          ${paddingMap[padding]}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

// ─── Grid ────────────────────────────────────────────────

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
  autoFit?: boolean;
  minWidth?: string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      columns = 3,
      gap = "md",
      responsive = true,
      autoFit = false,
      minWidth = "280px",
      ...props
    },
    ref
  ) => {
    const gapMap = {
      xs: "gap-2",
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    const columnMap = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    // Responsive grid
    let responsiveClasses = "";
    if (responsive) {
      responsiveClasses = `
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-${Math.ceil(columns / 2)}
        lg:grid-cols-${columns}
      `;
    }

    return (
      <div
        ref={ref}
        className={`
          grid
          ${autoFit ? `auto-fit` : responsiveClasses || columnMap[columns]}
          ${gapMap[gap]}
          ${className}
        `}
        style={{
          gridTemplateColumns: autoFit
            ? `repeat(auto-fit, minmax(${minWidth}, 1fr))`
            : undefined,
        }}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";

// ─── Flex ────────────────────────────────────────────────

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction = "row",
      align = "start",
      justify = "start",
      gap = "md",
      wrap = false,
      fullWidth = false,
      fullHeight = false,
      ...props
    },
    ref
  ) => {
    const directionMap = {
      row: "flex-row",
      col: "flex-col",
    };

    const alignMap = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifyMap = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    const gapMap = {
      xs: "gap-2",
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={`
          flex
          ${directionMap[direction]}
          ${alignMap[align]}
          ${justifyMap[justify]}
          ${gapMap[gap]}
          ${wrap ? "flex-wrap" : "flex-nowrap"}
          ${fullWidth ? "w-full" : ""}
          ${fullHeight ? "h-full" : ""}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Flex.displayName = "Flex";

// ─── Stack ────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "vertical",
      spacing = "md",
      ...props
    },
    ref
  ) => {
    const spacingMap = {
      xs: "space-y-2",
      sm: "space-y-3",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8",
    };

    const directionClass =
      direction === "horizontal"
        ? spacingMap[spacing].replace("space-y", "space-x")
        : spacingMap[spacing];

    return (
      <div
        ref={ref}
        className={`flex ${
          direction === "horizontal" ? "flex-row" : "flex-col"
        } ${directionClass} ${className}`}
        {...props}
      />
    );
  }
);

Stack.displayName = "Stack";

// ─── Section ──────────────────────────────────────────────

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  padding?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  noBorder?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      title,
      description,
      padding = "md",
      fullWidth = false,
      noBorder = false,
      children,
      ...props
    },
    ref
  ) => {
    const paddingMap = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <section
        ref={ref}
        className={`
          ${paddingMap[padding]}
          ${!noBorder ? "border-b border-gray-200" : ""}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        )}
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
