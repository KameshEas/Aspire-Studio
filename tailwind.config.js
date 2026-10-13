/** @type {import('tailwindcss').Config} */
let formsPlugin = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  formsPlugin = require('@tailwindcss/forms');
} catch {
  formsPlugin = null;
}

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Neutral scale
        'neutral-50': 'var(--neutral-50)',
        'neutral-100': 'var(--neutral-100)',
        'neutral-200': 'var(--neutral-200)',
        'neutral-300': 'var(--neutral-300)',
        'neutral-400': 'var(--neutral-400)',
        'neutral-500': 'var(--neutral-500)',
        'neutral-600': 'var(--neutral-600)',
        'neutral-700': 'var(--neutral-700)',
        'neutral-800': 'var(--neutral-800)',
        'neutral-900': 'var(--neutral-900)',

        // Brand
        'brand-50': 'var(--brand-50)',
        'brand-100': 'var(--brand-100)',
        'brand-200': 'var(--brand-200)',
        'brand-400': 'var(--brand-400)',
        'brand-500': 'var(--brand-500)',
        'brand-600': 'var(--brand-600)',
        'brand-700': 'var(--brand-700)',
        'brand-900': 'var(--brand-900)',

        // Status
        'success': 'var(--success-500)',
        'success-100': 'var(--success-100)',
        'warning': 'var(--warning-500)',
        'warning-100': 'var(--warning-100)',
        'danger': 'var(--danger-500)',
        'error': 'var(--error-500)',
        'error-100': 'var(--error-100)',
        'info': 'var(--info-500)',
        'info-100': 'var(--info-100)',

        // Semantic
        'primary': 'var(--color-primary)',
        'primary-50': 'var(--primary-50)',
        'primary-100': 'var(--brand-100)',
        'primary-400': 'var(--color-primary-400)',
        'primary-600': 'var(--color-primary-600)',
        'primary-700': 'var(--brand-700)',
        'primary-900': 'var(--brand-900)',
        'surface': 'var(--surface-1)',
        'surface-1': 'var(--color-surface-1)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        'text': 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border': 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        'border-strong': 'var(--color-border-strong)',
      },
      textColor: {
        DEFAULT: 'var(--color-text)',
        primary: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      },
      backgroundColor: {
        DEFAULT: 'var(--color-bg)',
        primary: 'var(--color-primary)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        '5xl': 'var(--space-5xl)',
        '6xl': 'var(--space-6xl)',
        '8xl': 'var(--space-8xl)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        base: 'var(--shadow-base)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        short: 'var(--motion-duration-short)',
        medium: 'var(--motion-duration-medium)',
        slow: 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        smooth: 'var(--motion-easing)',
        'ease-in': 'var(--motion-easing-in)',
        'ease-out': 'var(--motion-easing-out)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
        bounce: 'bounce 1s infinite',
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 300ms ease-in-out',
        'fade-out': 'fade-out 300ms ease-in-out',
        'slide-in': 'slide-in 300ms ease-out',
        'slide-out': 'slide-out 300ms ease-in',
        'scale-in': 'scale-in 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'bounce-in 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
    }
  },
  plugins: [
    ...(formsPlugin ? [formsPlugin] : [])
  ]
};
