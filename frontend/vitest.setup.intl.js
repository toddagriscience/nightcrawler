// Copyright © Todd Agriscience, Inc. All rights reserved.

// This file is JS instead of TS because the types were being a pain.

import { messageFiles } from './src/i18n/message-files';
import { vitest } from 'vitest';

const React = await vitest.importActual('react');

// Load all separated message files synchronously for Vitest - mirrors request.ts
const loadMessagesSync = (locale) => {
  const messages = {};

  messageFiles.forEach((file) => {
    try {
      const fileMessages = require(`./src/messages/${file}/${locale}.json`);
      Object.assign(messages, fileMessages);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Warning: Could not load message file ${file}/${locale}.json`,
          error
        );
      } else {
        console.warn(
          `Warning: Could not load message file ${file}/${locale}.json`
        );
      }
    }
  });

  return messages;
};

const enMessages = loadMessagesSync('en');

vitest.mock('next-intl', () => ({
  useTranslations: vitest.fn((namespace) => {
    return vitest.fn((key) => {
      // Use actual message structure from loaded messages
      const nestedGet = (obj, path) => {
        return path.split('.').reduce((current, segment) => {
          return current?.[segment];
        }, obj);
      };

      if (enMessages[namespace]) {
        const translation = nestedGet(enMessages[namespace], key);
        if (translation) return translation;
      }

      return `[${namespace}.${key}]`;
    });
  }),
  useLocale: vitest.fn(() => 'en'),
  NextIntlClientProvider: ({ children }) => children,
}));

vitest.mock('next-intl/server', () => ({
  getMessages: vitest.fn().mockResolvedValue(enMessages),
  getTranslations: vitest.fn().mockImplementation(({ namespace } = {}) => {
    return vitest.fn((key) => {
      const nestedGet = (obj, path) => {
        return path.split('.').reduce((current, segment) => {
          return current?.[segment];
        }, obj);
      };

      const translation = nestedGet(enMessages[namespace], key);
      return translation || `[${namespace}.${key}]`;
    });
  }),
  getRequestConfig: vitest.fn((fn) => fn),
}));

// Mock next-intl/routing
vitest.mock('next-intl/routing', () => ({
  defineRouting: vitest.fn(() => ({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: false,
  })),
  createNavigation: vitest.fn(() => ({
    Link: ({ children, href, ...props }) => {
      return React.createElement('a', { href, ...props }, children);
    },
    redirect: vitest.fn(),
    usePathname: vitest.fn(() => '/'),
    useRouter: vitest.fn(() => ({
      push: vitest.fn(),
      replace: vitest.fn(),
      back: vitest.fn(),
      forward: vitest.fn(),
    })),
  })),
}));

// Mock our i18n config
vitest.mock('./src/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: false,
  },
  Link: ({ children, href, ...props }) => {
    return React.createElement('a', { href, ...props }, children);
  },
  redirect: vitest.fn(),
  usePathname: vitest.fn(() => '/'),
  useRouter: vitest.fn(() => ({
    push: vitest.fn(),
    replace: vitest.fn(),
    back: vitest.fn(),
    forward: vitest.fn(),
  })),
}));

// Mock our environment configuration
vitest.mock('./src/lib/env', () => ({
  env: {
    productionDomain: 'toddagriscience.com',
    developmentDomain: 'localhost',
    isDevelopment: true,
    isProduction: false,
    defaultLocale: 'en',
    supportedLocales: ['en', 'es'],
    baseUrl: 'http://localhost:3000',
  },
}));
