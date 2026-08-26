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

// Use actual message structure from loaded messages
const nestedGet = (obj, path) =>
  path.split('.').reduce((current, segment) => current?.[segment], obj);

/**
 * Builds a translator shaped closely enough to the real one for component
 * tests: callable for plain messages, with `.rich` for a message that wraps
 * part of its text in a tag, e.g. `<link>here</link>`.
 */
const createTranslator = (namespace) => {
  const lookup = (key) => {
    if (enMessages[namespace]) {
      const translation = nestedGet(enMessages[namespace], key);
      if (translation) return translation;
    }

    return `[${namespace}.${key}]`;
  };

  const translate = vitest.fn(lookup);

  translate.rich = vitest.fn((key, values = {}) => {
    const message = lookup(key);
    const parts = [];
    const tag = /<(\w+)>([\s\S]*?)<\/\1>/g;
    let cursor = 0;
    let match;
    let index = 0;

    while ((match = tag.exec(message)) !== null) {
      if (match.index > cursor) parts.push(message.slice(cursor, match.index));

      const render = values[match[1]];
      parts.push(
        render
          ? React.createElement(
              React.Fragment,
              { key: index++ },
              render(match[2])
            )
          : match[2]
      );
      cursor = tag.lastIndex;
    }

    if (cursor < message.length) parts.push(message.slice(cursor));

    return parts;
  });

  return translate;
};

vitest.mock('next-intl', () => ({
  useTranslations: vitest.fn(createTranslator),
  useLocale: vitest.fn(() => 'en'),
  NextIntlClientProvider: ({ children }) => children,
}));

vitest.mock('next-intl/server', () => ({
  getMessages: vitest.fn().mockResolvedValue(enMessages),
  getTranslations: vitest.fn().mockImplementation((opts) => {
    const namespace = typeof opts === 'string' ? opts : opts?.namespace;
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

// Mock our environment configuration. Only `env` is stubbed: helpers such as
// `getAuthRedirectBaseUrl` read `process.env` at call time, so tests drive them
// through the real implementation.
vitest.mock('./src/lib/env', async (importActual) => {
  const actual = await importActual();

  return {
    ...actual,
    env: {
      productionDomain: 'toddagriscience.com',
      developmentDomain: 'localhost',
      isDevelopment: true,
      isProduction: false,
      defaultLocale: 'en',
      supportedLocales: ['en', 'es'],
      baseUrl: 'http://localhost:3000',
    },
  };
});
