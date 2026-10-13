/**
 * Aspire Studio - Premium Design System
 * Complete design tokens for world-class SaaS product
 * Comparable to Linear, Stripe, Notion, Figma
 */

// ============================================================================
// COLOR PALETTE - Premium & Accessible
// ============================================================================

export const colors = {
  // Primary: Modern Indigo with full tonal scale
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Base
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Secondary: Premium Slate for neutral surfaces
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Accent: Vibrant Emerald for success & CTAs
  emerald: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#134e4a',
  },

  // Semantic: Status and context colors
  semantic: {
    success: '#22c55e',
    successLight: '#dcfce7',
    successDark: '#15803d',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#92400e',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    dangerDark: '#7f1d1d',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    infoDark: '#1e40af',
    pending: '#8b5cf6',
    processing: '#06b6d4',
  },

  // Surfaces: Carefully chosen for depth without harshness
  surfaces: {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f9fafb',
      bgTertiary: '#f3f4f6',
      card: '#ffffff',
      input: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.05)',
    },
    dark: {
      bg: '#0a0e1a',
      bgSecondary: '#0f1724',
      bgTertiary: '#141b2a',
      card: '#1a232f',
      input: '#0f1724',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
  },

  // Borders: Subtle and refined
  border: {
    light: '#e5e7eb',
    lightStrong: '#d1d5db',
    dark: '#1e293b',
    darkStrong: '#334155',
  },

  // Chart colors: Professional data visualization
  chart: {
    blue: '#3b82f6',
    indigo: '#6366f1',
    purple: '#a855f7',
    pink: '#ec4899',
    rose: '#f43f5e',
    orange: '#f97316',
    amber: '#f59e0b',
    lime: '#84cc16',
    green: '#22c55e',
    cyan: '#06b6d4',
  },
};

// ============================================================================
// TYPOGRAPHY - Elegant & Readable
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Type scale
  fontSize: {
    display: {
      size: '48px',
      lineHeight: '56px',
      weight: 700,
    },
    h1: {
      size: '32px',
      lineHeight: '40px',
      weight: 700,
    },
    h2: {
      size: '24px',
      lineHeight: '32px',
      weight: 700,
    },
    h3: {
      size: '20px',
      lineHeight: '28px',
      weight: 700,
    },
    h4: {
      size: '16px',
      lineHeight: '24px',
      weight: 700,
    },
    bodyLarge: {
      size: '16px',
      lineHeight: '24px',
      weight: 400,
    },
    body: {
      size: '14px',
      lineHeight: '20px',
      weight: 400,
    },
    small: {
      size: '12px',
      lineHeight: '16px',
      weight: 400,
    },
    caption: {
      size: '11px',
      lineHeight: '14px',
      weight: 400,
    },
    mono: {
      size: '13px',
      lineHeight: '18px',
      weight: 400,
    },
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
};

// ============================================================================
// SPACING - 4px base unit system
// ============================================================================

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

// ============================================================================
// ELEVATION & SHADOWS - Layered depth
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Dark mode shadows (more prominent)
  darkMd: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  darkLg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
  darkXl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
};

// ============================================================================
// BORDER RADIUS - Professional & Consistent
// ============================================================================

export const borderRadius = {
  none: '0px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// ============================================================================
// MOTION - Smooth & Purposeful
// ============================================================================

export const motion = {
  duration: {
    fast: '100ms',
    base: '150ms',
    medium: '250ms',
    slow: '350ms',
  },

  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// ============================================================================
// STATES - Interactive feedback
// ============================================================================

export const states = {
  hover: {
    opacity: 0.9,
    shadowLift: 'lg',
  },
  active: {
    opacity: 0.85,
    scale: 0.98,
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  focus: {
    outline: '2px solid',
    outlineOffset: '2px',
  },
  loading: {
    opacity: 0.6,
  },
  error: {
    borderColor: 'var(--color-danger)',
    backgroundColor: 'var(--color-danger-light)',
  },
  success: {
    borderColor: 'var(--color-success)',
    backgroundColor: 'var(--color-success-light)',
  },
};

// ============================================================================
// BREAKPOINTS - Responsive design
// ============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX - Layering hierarchy
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const componentTokens = {
  // Button sizing
  button: {
    xs: { height: '24px', padding: '0 8px', fontSize: '12px' },
    sm: { height: '32px', padding: '0 12px', fontSize: '14px' },
    md: { height: '40px', padding: '0 16px', fontSize: '14px' },
    lg: { height: '48px', padding: '0 20px', fontSize: '16px' },
    xl: { height: '56px', padding: '0 24px', fontSize: '16px' },
  },

  // Input sizing
  input: {
    sm: { height: '32px', padding: '8px 12px', fontSize: '14px' },
    md: { height: '40px', padding: '10px 14px', fontSize: '14px' },
    lg: { height: '48px', padding: '12px 16px', fontSize: '16px' },
  },

  // Avatar sizing
  avatar: {
    xs: { size: '24px', fontSize: '12px' },
    sm: { size: '32px', fontSize: '14px' },
    md: { size: '40px', fontSize: '16px' },
    lg: { size: '48px', fontSize: '18px' },
    xl: { size: '64px', fontSize: '20px' },
  },

  // Card sizing
  card: {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    shadow: 'sm',
  },

  // Modal sizing
  modal: {
    borderRadius: '16px',
    shadow: 'xl',
    maxWidth: '600px',
    padding: '24px',
  },
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export const designSystem = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  motion,
  states,
  breakpoints,
  zIndex,
  componentTokens,
};

export default designSystem;
