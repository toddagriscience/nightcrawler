import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
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
    // Add support for local fonts and path aliases matching tsconfig
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib': path.resolve(rootDir, 'src/lib'),
        '@/components': path.resolve(rootDir, 'src/components'),
        '@/svgs': path.resolve(rootDir, 'src/svgs'),
        '@/storybook': path.resolve(rootDir, '.storybook'),
        '@public': path.resolve(rootDir, 'public'),
      };
    }
    return config;
  },
};

export default config;
