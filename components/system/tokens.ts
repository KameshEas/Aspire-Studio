/**
 * Design Tokens - Single source of truth for all UI constants
 * Prevents inconsistency and makes global changes easy
 */

// ─── Colors ────────────────────────────────────────────────

export const colors = {
  // Semantic colors
  text: {
    primary: "#1a1a1a",      // Main text (14:1 on white)
    secondary: "#4a5568",    // Secondary text (8:1 on white)
    muted: "#718096",        // Placeholder (5.5:1 on white)
    disabled: "#cbd5e0",     // Disabled (3.5:1 on white)
    inverse: "#ffffff",      // Text on dark backgrounds
  },

  background: {
    primary: "#ffffff",
    secondary: "#f7fafc",
    tertiary: "#edf2f7",
    surface: "#ffffff",
    surfaceHover: "#f7fafc",
    surfaceActive: "#edf2f7",
  },

  border: {
    light: "#e2e8f0",
    default: "#cbd5e0",
    strong: "#a0aec0",
  },

  status: {
    success: {
      light: "#dcfce7",
      main: "#22c55e",
      dark: "#16a34a",
      text: "#166534",
    },
    error: {
      light: "#fee2e2",
      main: "#ef4444",
      dark: "#dc2626",
      text: "#991b1b",
    },
    warning: {
      light: "#fef3c7",
      main: "#eab308",
      dark: "#ca8a04",
      text: "#78350f",
    },
    info: {
      light: "#dbeafe",
      main: "#3b82f6",
      dark: "#1d4ed8",
      text: "#0c2340",
    },
  },

  brand: {
    primary: "#4f46e5",      // Indigo
    primaryLight: "#e0e7ff",
    primaryDark: "#312e81",
    secondary: "#8b5cf6",    // Purple
  },
} as const;

// ─── Spacing ────────────────────────────────────────────────

export const spacing = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem",   // 48px
  "4xl": "4rem",   // 64px
} as const;

// ─── Typography ─────────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", Courier, monospace',
  },

  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ─── Sizing ─────────────────────────────────────────────────

export const sizing = {
  xs: "20px",
  sm: "32px",
  md: "40px",
  lg: "48px",
  xl: "56px",
  "2xl": "64px",
} as const;

// ─── Border Radius ──────────────────────────────────────────

export const radius = {
  none: "0",
  sm: "0.25rem",   // 4px
  md: "0.375rem",  // 6px
  lg: "0.5rem",    // 8px
  xl: "0.75rem",   // 12px
  "2xl": "1rem",   // 16px
  full: "9999px",
} as const;

// ─── Motion ─────────────────────────────────────────────────

export const motion = {
  duration: {
    fast: "100ms",
    base: "150ms",
    slow: "200ms",
    slower: "300ms",
  },

  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// ─── Shadows ────────────────────────────────────────────────

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
} as const;

// ─── Breakpoints ────────────────────────────────────────────

export const breakpoints = {
  xs: "0px",      // Mobile
  sm: "640px",    // Tablet
  md: "768px",    // Small desktop
  lg: "1024px",   // Desktop
  xl: "1280px",   // Large desktop
  "2xl": "1536px", // Extra large
} as const;

// ─── Z-Index ────────────────────────────────────────────────

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  backdrop: 1300,
  modal: 1400,
  tooltip: 1500,
  notification: 1600,
} as const;

// ─── Status Configuration ────────────────────────────────────

export const statusConfig = {
  pending: {
    color: colors.status.warning,
    label: "Pending",
    icon: "clock",
  },
  processing: {
    color: colors.status.info,
    label: "Processing",
    icon: "loader",
  },
  succeeded: {
    color: colors.status.success,
    label: "Completed",
    icon: "check-circle",
  },
  completed: {
    color: colors.status.success,
    label: "Completed",
    icon: "check-circle",
  },
  failed: {
    color: colors.status.error,
    label: "Failed",
    icon: "alert-circle",
  },
  draft: {
    color: colors.status.info,
    label: "Draft",
    icon: "file",
  },
  approved: {
    color: colors.status.success,
    label: "Approved",
    icon: "check",
  },
  archived: {
    color: { light: "#e5e7eb", main: "#9ca3af", dark: "#6b7280" },
    label: "Archived",
    icon: "archive",
  },
} as const;
