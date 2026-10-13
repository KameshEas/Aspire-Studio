export const tokens = {
  light: {
    colors: {
      // Base colors
      'bg': '#ffffff',
      'text': '#0f172a',
      'text-secondary': '#4a5568',
      'text-muted': '#718096',
      'text-disabled': '#cbd5e0',

      // Surfaces
      'surface-1': '#ffffff',
      'surface-2': '#f8fafc',
      'surface-3': '#edf2f7',
      'surface-hover': '#f7fafc',
      'surface-active': '#edf2f7',

      // Borders
      'border': '#e6eef6',
      'border-light': '#f0f4f8',
      'border-strong': '#d0d7e3',

      // Brand colors (Indigo)
      'primary-50': '#f0f4ff',
      'primary-100': '#e0e7ff',
      'primary-200': '#c7d2fe',
      'primary-400': '#34d399',
      'primary-500': '#6366f1',
      'primary-600': '#4f46e5',
      'primary-700': '#4338ca',
      'primary-900': '#312e81',

      // Status colors
      'success': '#22c55e',
      'success-light': '#dcfce7',
      'warning': '#eab308',
      'warning-light': '#fef3c7',
      'danger': '#ef4444',
      'error': '#ef4444',
      'error-light': '#fee2e2',
      'info': '#3b82f6',
      'info-light': '#dbeafe',

      // Semantic
      'muted': '#64748b',
      'overlay': 'rgba(15, 23, 42, 0.5)',
    },
  },
  dark: {
    colors: {
      // Base colors
      'bg': '#0a0e1a',
      'text': '#f5f5f5',
      'text-secondary': '#b4b4b4',
      'text-muted': '#808080',
      'text-disabled': '#4a4a4a',

      // Surfaces
      'surface-1': '#0f1724',
      'surface-2': '#0b1320',
      'surface-3': '#1a2332',
      'surface-hover': '#1a2332',
      'surface-active': '#2a3545',

      // Borders
      'border': '#122031',
      'border-light': '#1a2937',
      'border-strong': '#2d3f52',

      // Brand colors (Lighter for dark mode)
      'primary-50': '#1e1b4b',
      'primary-100': '#312e81',
      'primary-200': '#3730a3',
      'primary-400': '#818cf8',
      'primary-500': '#6366f1',
      'primary-600': '#4f46e5',
      'primary-700': '#4338ca',
      'primary-900': '#e0e7ff',

      // Status colors (adjusted for dark mode)
      'success': '#10b981',
      'success-light': '#064e3b',
      'warning': '#fbbf24',
      'warning-light': '#78350f',
      'danger': '#f87171',
      'error': '#f87171',
      'error-light': '#7f1d1d',
      'info': '#60a5fa',
      'info-light': '#0c2340',

      // Semantic
      'muted': '#94a3b8',
      'overlay': 'rgba(15, 23, 42, 0.7)',
    }
  },
  spacing: {
    '0': '0',
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '7': '28px',
    '8': '32px',
    '9': '36px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
  },
  radii: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px'
  },
  motion: {
    durationFast: '100ms',
    durationBase: '150ms',
    durationShort: '160ms',
    durationMedium: '280ms',
    durationSlow: '300ms',
    easing: 'cubic-bezier(.2,.8,.2,1)',
    easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
  }
};

export type Tokens = typeof tokens;

export function applyThemeVariables(theme: 'light' | 'dark' = 'light') {
  try {
    const root = (typeof document !== 'undefined' && document.documentElement) ? document.documentElement : null;
    if (!root) return;
    const themeData = tokens[theme];
    if (themeData && themeData.colors) {
      const colors: Record<string, string> = themeData.colors;
      Object.entries(colors).forEach(([k,v])=>{
        root.style.setProperty(`--color-${k}`, v);
      });
    }
    // spacing
    Object.entries(tokens.spacing).forEach(([k,v])=> root.style.setProperty(`--spacing-${k}`, String(v)));
    Object.entries(tokens.radii).forEach(([k,v])=> root.style.setProperty(`--radius-${k}`, String(v)));
    Object.entries(tokens.motion).forEach(([k,v])=> root.style.setProperty(`--motion-${k}`, String(v)));
  } catch (e) {
    // ignore in SSR
  }
}

export default tokens;
