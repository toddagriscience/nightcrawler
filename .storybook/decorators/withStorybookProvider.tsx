import React from 'react';
import { Decorator } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '../../src/context/theme/ThemeContext';
import { routing } from '../../src/i18n/config';
import '../../src/app/globals.css';

// Import actual message files
import enMessages from '../../src/messages/en.json';
import esMessages from '../../src/messages/es.json';

// Get messages for Storybook
const getMessages = (locale: string = 'en') => {
  const messageMap: Record<string, any> = {
    en: enMessages,
    es: esMessages,
  };

  const messages = messageMap[locale];
  
  if (!messages) {
    return enMessages;
  }
  
  return messages;
};

// Simple wrapper that only applies the dark class for CSS variables
const StorybookThemeWrapper: React.FC<{
  children: React.ReactNode;
  isDark: boolean;
  locale: string;
}> = ({ children, isDark, locale }) => {
  return (
    <div 
      className={isDark ? 'dark' : ''}
      style={{ 
        minHeight: '100vh',
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          zIndex: 1000,
          fontSize: '12px',
          background: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Locale: {locale} | Theme: {isDark ? 'Dark' : 'Light'}
        </div>
        {children}
      </div>
    </div>
  );
};

export const withStorybookProvider: Decorator = (Story, context) => {
  const { args, parameters, globals } = context;
  
  // Use global controls for locale, fallback to args, then defaults
  const locale = globals?.locale ?? args?.locale ?? parameters?.storybook?.locale ?? routing.defaultLocale;
  const isDark = args?.isDark ?? parameters?.storybook?.isDark ?? false;

  // Validate locale
  const validLocale = routing.locales.includes(locale) ? locale : routing.defaultLocale;

  return (
    <NextIntlClientProvider 
      messages={getMessages(validLocale)}
      locale={validLocale}
    >
      <ThemeProvider>
        <StorybookThemeWrapper isDark={isDark} locale={validLocale}>
          <Story />
        </StorybookThemeWrapper>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};