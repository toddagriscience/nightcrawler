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

// Resolve a dotted key inside a message namespace object.
const nestedGet = (obj, path) => {
  return path.split('.').reduce((current, segment) => {
    return current?.[segment];
  }, obj);
};

// Minimal stand-in for next-intl's `t.rich`: replaces `<tag>text</tag>` pairs with the
// output of the matching tag function in `values`, so components that render links inside
// translations (e.g. `Disclaimer`) work under Vitest. Only non-nested tags are supported.
const renderRich = (message, values = {}) => {
  if (typeof message !== 'string') return message;

  const parts = [];
  const tagPattern = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let lastIndex = 0;
  let match;

  while ((match = tagPattern.exec(message)) !== null) {
    const [full, tag, inner] = match;
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index));
    }
    const renderTag = values[tag];
    parts.push(
      typeof renderTag === 'function'
        ? React.createElement(
            React.Fragment,
            { key: parts.length },
            renderTag(inner)
          )
        : full
    );
    lastIndex = match.index + full.length;
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex));
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
};

// Build a translator for `namespace` that mirrors the real next-intl `t`, including `.rich`.
// Like next-intl, `namespace` may be dotted (e.g. `careers.disclaimers`) or omitted for root.
const createTranslator = (namespace) => {
  const namespaceMessages = namespace
    ? nestedGet(enMessages, namespace)
    : enMessages;

  const lookup = (key) => {
    // Use actual message structure from loaded messages
    if (namespaceMessages && typeof namespaceMessages === 'object') {
      const translation = nestedGet(namespaceMessages, key);
      if (translation) return translation;
    }

    return `[${namespace}.${key}]`;
  };

  const t = vitest.fn((key) => lookup(key));
  t.rich = vitest.fn((key, values) => renderRich(lookup(key), values));
  return t;
};

vitest.mock('next-intl', () => ({
  useTranslations: vitest.fn((namespace) => createTranslator(namespace)),
  useLocale: vitest.fn(() => 'en'),
  NextIntlClientProvider: ({ children }) => children,
}));

vitest.mock('next-intl/server', () => ({
  getMessages: vitest.fn().mockResolvedValue(enMessages),
  getTranslations: vitest.fn().mockImplementation((opts) => {
    const namespace = typeof opts === 'string' ? opts : opts?.namespace;
    return createTranslator(namespace);
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
