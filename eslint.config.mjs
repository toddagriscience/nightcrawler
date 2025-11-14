// Copyright Todd Agriscience, Inc. All rights reserved.

import licenseHeader from 'eslint-plugin-license-header';
import storybook from 'eslint-plugin-storybook';

import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Some plugins export as `default`, some as the module itself.
// Normalize so we always pass the plugin object to ESLint.
const licenseHeaderPlugin =
  licenseHeader && licenseHeader.default
    ? licenseHeader.default
    : licenseHeader;

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '.storybook/**',
      'storybook-static/**',
      'jest.config.js',
      'playwright.config.ts',
      'vitest.config.ts',
      'vitest.shims.d.ts',
    ],

    // <-- plugins must be an object in flat config
    plugins: {
      'license-header': licenseHeaderPlugin,
    },

    rules: {
      'license-header/header': [2, './.license-header.txt'],
    },
  },

  // Storybook flat recommended config
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
