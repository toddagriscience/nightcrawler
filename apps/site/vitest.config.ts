// Copyright © Todd Agriscience, Inc. All rights reserved.

import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

// Add any custom config to be passed to Vitest
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    server: { deps: { inline: ['next-intl'] } },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          setupFiles: [
            path.resolve(__dirname, './vitest.setup.intl.js'),
            path.resolve(__dirname, './vitest.setup.ts'),
          ],
          exclude: [
            ...configDefaults.exclude,
            'src/proxy/i18n.test.ts',
            'src/proxy/*.integration.test.ts',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'routing',
          environment: 'node',
          include: [
            'src/proxy/i18n.test.ts',
            'src/proxy/*.integration.test.ts',
          ],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' to the './src' directory
      '@public': path.resolve(__dirname, './public'), // Alias '@' to the './src' directory
      '@assets': path.resolve(__dirname, './src/assets'), // Example of another alias
    },
  },
});
