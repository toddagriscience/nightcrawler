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
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: [
    { from: '../public/fonts', to: '/fonts' },
    '../public'
  ],
  viteFinal: async (config) => {
    const rootDir = path.resolve(__dirname, '..');
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