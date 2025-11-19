// Copyright Todd Agriscience, Inc. All rights reserved.
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
      '**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)', // Ignore all story files
    ],
  },
];

export default eslintConfig;
