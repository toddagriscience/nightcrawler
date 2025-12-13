// Copyright © Todd Agriscience, Inc. All rights reserved.

import { messageFiles } from './src/i18n/message-files';

// Load all separated message files synchronously for Jest - mirrors request.ts
const loadMessagesSync = (locale) => {
  const messages = {};

  messageFiles.forEach((file) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
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

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace) => {
    return jest.fn((key) => {
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
  useLocale: jest.fn(() => 'en'),
  NextIntlClientProvider: ({ children }) => children,
}));

jest.mock('next-intl/server', () => ({
  getMessages: jest.fn().mockResolvedValue(enMessages),
  getTranslations: jest.fn().mockImplementation(({ namespace } = {}) => {
    return jest.fn((key) => {
      const nestedGet = (obj, path) => {
        return path.split('.').reduce((current, segment) => {
          return current?.[segment];
        }, obj);
      };

      const translation = nestedGet(enMessages[namespace], key);
      return translation || `[${namespace}.${key}]`;
    });
  }),
  getRequestConfig: jest.fn((fn) => fn),
}));

// Mock next-intl/routing
jest.mock('next-intl/routing', () => ({
  defineRouting: jest.fn(() => ({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: false,
  })),
  createNavigation: jest.fn(() => ({
    Link: jest.fn(({ children, href, ...props }) => {
      const React = jest.requireActual('react');
      return React.createElement('a', { href, ...props }, children);
    }),
    redirect: jest.fn(),
    usePathname: jest.fn(() => '/'),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    })),
  })),
}));

// Mock our i18n config
jest.mock('./src/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: false,
  },
  Link: jest.fn(({ children, href, ...props }) => {
    const React = jest.requireActual('react');
    return React.createElement('a', { href, ...props }, children);
  }),
  redirect: jest.fn(),
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
}));

// Mock our environment configuration
jest.mock('./src/lib/env', () => ({
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
