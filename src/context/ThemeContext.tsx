'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  setIsDarkSmooth: (isDark: boolean) => void;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

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

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // You can also update CSS custom properties here if needed
    if (isDark) {
      root.style.setProperty('--current-bg', 'var(--header-bg-dark)');
      root.style.setProperty('--current-text', 'var(--header-text-dark)');
      root.style.setProperty('--current-border', 'var(--header-border-dark)');
      root.style.setProperty('--current-hover', 'var(--header-hover-dark)');
    } else {
      root.style.setProperty('--current-bg', 'var(--header-bg-light)');
      root.style.setProperty('--current-text', 'var(--header-text-light)');
      root.style.setProperty('--current-border', 'var(--header-border-light)');
      root.style.setProperty('--current-hover', 'var(--header-hover-light)');
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
