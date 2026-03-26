"use client";

import React, {createContext, useContext, useEffect, useState, useCallback} from 'react';
import {applyThemeVariables} from './tokens';

type Theme = 'light'|'dark';
const ThemeContext = createContext({
  theme: 'light' as Theme,
  toggleTheme: () => {}
});

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {}
  return 'light';
}

export const ThemeProvider: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(()=>{ applyThemeVariables(theme); }, [theme]);

  const toggleTheme = useCallback(()=>{
    setTheme(t=>{
      const next = t === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('theme', next);} catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
