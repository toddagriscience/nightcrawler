// Copyright © Todd Agriscience, Inc. All rights reserved.

import { defineConfig } from 'vitest/config';
import path from 'path';

// Add any custom config to be passed to Vitest
export default defineConfig({
  test: {
    setupFiles: [
      path.resolve(__dirname, './vitest.setup.intl.js'),
      path.resolve(__dirname, './vitest.setup.ts'),
    ],
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' to the './src' directory
      '@assets': path.resolve(__dirname, './src/assets'), // Example of another alias
    },
  },
});
