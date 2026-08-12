// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Vite permits `resolve.alias` as an object or as `{find, replacement}[]`. */
type ViteAlias =
  | Record<string, string>
  | readonly { find: string | RegExp; replacement: string }[]
  | undefined;

/**
 * Flattens either alias form into the object form this config merges into.
 * Regex `find` entries have no object equivalent and are dropped rather than
 * silently mangled; nothing in this project uses them.
 *
 * @param alias - Whatever Vite handed us
 */
function normalizeAlias(alias: ViteAlias): Record<string, string> {
  if (!alias) return {};
  if (Array.isArray(alias)) {
    return Object.fromEntries(
      alias
        .filter((entry) => typeof entry.find === 'string')
        .map((entry) => [entry.find as string, entry.replacement])
    );
  }
  // `Array.isArray` narrows out `T[]` but not `readonly T[]`, so the object
  // form has to be asserted rather than inferred.
  return alias as Record<string, string>;
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  // `../public` is served at the root, so `public/fonts` is already available
  // at `/fonts`. Listing `../public/fonts` separately overlaps that copy and
  // makes node:fs/cp race on mkdir (intermittent EEXIST on icons/fonts during
  // build-storybook), so only the parent dir is listed.
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    const rootDir = path.resolve(__dirname, '..');
    // Storybook already copies `../public` via `staticDirs`. Vite ALSO copies
    // its `publicDir` (defaults to `public`) into the build output, so the same
    // directory is copied twice concurrently and node:fs/cp races on mkdir
    // (intermittent `EEXIST` on storybook-static/fonts during build-storybook).
    // Disable Vite's copy so only the staticDirs copy runs.
    config.publicDir = false;
    // Add path aliases matching tsconfig, plus stand-ins for the Next.js
    // modules the React Vite builder cannot resolve on its own. Each mock
    // explains in its own header what breaks without it.
    config.resolve ??= {};
    config.resolve.alias = {
      // Vite also accepts `alias` as an array of `{ find, replacement }`, and
      // spreading that into an object literal would turn every inherited entry
      // into numeric junk keys. Normalize before merging.
      ...normalizeAlias(config.resolve.alias),
      // Order matters: Vite matches object aliases in insertion order by
      // prefix, so the broader '@' must come last or it swallows '@/storybook'
      // and resolves it to a src path that does not exist.
      '@/storybook': path.resolve(rootDir, '.storybook'),
      '@public': path.resolve(rootDir, 'public'),
      '@': path.resolve(rootDir, 'src'),
      'next/font/local': path.resolve(
        rootDir,
        '.storybook/mocks/next-font-local.ts'
      ),
      'next/image': path.resolve(rootDir, '.storybook/mocks/next-image.tsx'),
      'next/link': path.resolve(rootDir, '.storybook/mocks/next-link.tsx'),
      'next/navigation': path.resolve(
        rootDir,
        '.storybook/mocks/next-navigation.ts'
      ),
    };
    return config;
  },
};

export default config;
