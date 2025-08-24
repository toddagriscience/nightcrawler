import React, { useState, useEffect } from 'react';
import { LocaleProvider, useLocale } from '../../src/context/LocaleContext';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';
import { type Locale, locales } from '../../src/lib/i18n/config';

interface StorybookProviderProps {
  children: React.ReactNode;
  locale?: Locale;
  isDark?: boolean;
  showLanguageSwitcher?: boolean;
  showThemeSwitcher?: boolean;
}

// Inner component that can access locale context
const StorybookInner: React.FC<{
  children: React.ReactNode;
  locale: Locale;
  isDark: boolean;
  showLanguageSwitcher: boolean;
  showThemeSwitcher: boolean;
}> = ({ children, locale: propLocale, isDark: propIsDark, showLanguageSwitcher, showThemeSwitcher }) => {
  const { setLocale } = useLocale();
  const { setIsDark } = useTheme();
  const [currentLocale, setCurrentLocale] = useState<Locale>(propLocale);
  const [currentIsDark, setCurrentIsDark] = useState<boolean>(propIsDark);

  // Update locale when props change (from Storybook controls)
  useEffect(() => {
    setCurrentLocale(propLocale);
    setLocale(propLocale);
  }, [propLocale, setLocale]);

  // Update theme when props change (from Storybook controls)
  useEffect(() => {
    setCurrentIsDark(propIsDark);
    setIsDark(propIsDark);
    
    // Apply theme changes to document
    if (typeof document !== 'undefined') {
      document.documentElement.className = propIsDark ? 'dark' : '';
      document.documentElement.setAttribute('data-theme', propIsDark ? 'dark' : 'light');
    }
  }, [propIsDark, setIsDark]);

  return (
    <div 
      className={currentIsDark ? 'dark' : ''}
      style={{ 
        minHeight: '100vh',
        background: currentIsDark ? '#2A2727' : '#f8f5ee',
        color: currentIsDark ? 'white' : 'black'
      }}
    >
      {children}
    </div>
  );
};

export const StorybookProvider: React.FC<StorybookProviderProps> = ({
  children,
  locale = 'en',
  isDark = false,
  showLanguageSwitcher = true,
  showThemeSwitcher = true,
}) => {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <StorybookInner
          locale={locale}
          isDark={isDark}
          showLanguageSwitcher={showLanguageSwitcher}
          showThemeSwitcher={showThemeSwitcher}
        >
          {children}
        </StorybookInner>
      </LocaleProvider>
    </ThemeProvider>
  );
};