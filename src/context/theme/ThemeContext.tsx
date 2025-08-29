// Copyright Todd LLC, All rights reserved.

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ThemeContextType, ThemeProviderProps } from './types/ThemeContext';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * useTheme hook
 * @returns {ThemeContextType} - The theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider
 * @param {ThemeProviderProps} props - The component props
 * @returns {JSX.Element} - The theme provider
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  // Debounced setter for smoother transitions
  const setIsDarkSmooth = useCallback(
    (newIsDark: boolean) => {
      if (newIsDark === isDark) return;

      if (!isTransitioning) {
        setIsTransitioning(true);

        // Add a longer delay for smoother transitions
        setTimeout(() => {
          setIsDark(newIsDark);
          setIsTransitioning(false);
        }, 300);
      }
    },
    [isDark, isTransitioning]
  );

  // Apply dark class to document for CSS variables
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const value = {
    isDark,
    setIsDark,
    setIsDarkSmooth,
    toggleDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
