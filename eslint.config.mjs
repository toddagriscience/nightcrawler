// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FlatCompat } from '@eslint/eslintrc';
import licenseHeader from 'eslint-plugin-license-header';
import storybook from 'eslint-plugin-storybook';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Normalize plugin exports
const licenseHeaderPlugin = licenseHeader?.default ?? licenseHeader;

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '.storybook/**',
      'storybook-static/**',
      'vitest.config.js',
      'playwright.config.ts',
      'vitest.config.ts',
      'vitest.shims.d.ts',
    ],
  },

  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),

  {
    plugins: {
      'license-header': licenseHeaderPlugin,
    },
    rules: {
      'license-header/header': [2, './license-header.txt'],
    },
  },

  ...storybook.configs['flat/recommended'],
];
