/** @type {import('tailwindcss').Config} */
let formsPlugin = null;
try {
  // try to require the optional forms plugin; if it's not installed, skip it
  formsPlugin = require('@tailwindcss/forms');
} catch (e) {
  formsPlugin = null;
}

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'neutral-0': 'var(--neutral-0)',
        'neutral-50': 'var(--neutral-50)',
        'neutral-100': 'var(--neutral-100)',
        'neutral-200': 'var(--neutral-200)',
        'neutral-400': 'var(--neutral-400)',
        'neutral-600': 'var(--neutral-600)',
        'neutral-900': 'var(--neutral-900)',

        'brand-500': 'var(--brand-500)',
        'brand-400': 'var(--brand-400)',
        'brand-600': 'var(--brand-600)',

        primary: 'var(--brand-500)',
        surface: 'var(--surface-1)'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px'
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.06)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 8px 24px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: [
    ...(formsPlugin ? [formsPlugin] : [])
  ]
};
