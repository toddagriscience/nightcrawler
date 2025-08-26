// Mock next-intl for Jest tests
// eslint-disable-next-line @typescript-eslint/no-require-imports
const enMessages = require('./src/messages/en.json');

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace) => {
    return jest.fn((key) => {
      // Use actual message structure from en.json
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
