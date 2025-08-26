import React from 'react';
import { Decorator } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { env, SupportedLocale } from '../../src/lib/env';

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

export const withStorybookProvider: Decorator = (Story, context) => {
  const { args, parameters, globals } = context;
  
  // Use global controls for locale, fallback to args, then defaults
  const locale = globals?.locale ?? args?.locale ?? parameters?.storybook?.locale ?? env.defaultLocale;
  const isDark = args?.isDark ?? parameters?.storybook?.isDark ?? false;

  // Validate locale
  const validLocale = env.supportedLocales.includes(locale as SupportedLocale) ? locale : env.defaultLocale;

  return (
    <NextIntlClientProvider 
      messages={getMessages(validLocale)}
      locale={validLocale}
    >
      <ThemeProvider>
        <div 
          className={isDark ? 'dark' : ''}
          style={{ 
            minHeight: '100vh',
            background: isDark ? '#2A2727' : '#f8f5ee',
            color: isDark ? 'white' : 'black'
          }}
        >
          <div style={{ padding: '1rem' }}>
            <div style={{ 
              position: 'fixed', 
              top: '10px', 
              right: '10px', 
              zIndex: 1000,
              fontSize: '12px',
              background: 'rgba(0,0,0,0.1)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              Locale: {validLocale}
            </div>
            <Story />
          </div>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};