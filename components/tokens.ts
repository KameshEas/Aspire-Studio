export const tokens = {
  light: {
    colors: {
      'bg': '#ffffff',
      'text': '#0f172a',
      'surface-1': '#ffffff',
      'surface-2': '#f8fafc',
      'border': '#e6eef6',
      'primary-600': '#0ea5a4',
      'primary-400': '#34d399',
      'danger': '#ef4444',
      'muted': '#64748b'
    },
  },
  dark: {
    colors: {
      'bg': '#0b1220',
      'text': '#e6eef6',
      'surface-1': '#0f1724',
      'surface-2': '#0b1320',
      'border': '#122031',
      'primary-600': '#06b6d4',
      'primary-400': '#2dd4bf',
      'danger': '#f87171',
      'muted': '#94a3b8'
    }
  },
  spacing: {
    '1': '4px',
    '2': '8px',
    '3': '16px',
    '4': '24px',
    '5': '32px'
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  motion: {
    durationShort: '160ms',
    durationMedium: '280ms',
    easing: 'cubic-bezier(.2,.8,.2,1)'
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
