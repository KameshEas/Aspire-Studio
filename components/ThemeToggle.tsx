"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const {theme, toggleTheme} = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      style={{
        padding: '6px 10px',
        borderRadius: 6,
        border: '1px solid var(--color-border, rgba(0,0,0,0.08))',
        background: 'var(--color-surface-1, #fff)',
        color: 'var(--color-text, inherit)'
      }}
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
