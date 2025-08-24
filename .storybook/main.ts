import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
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
    // Add support for local fonts
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib': '/src/lib',
        '@/components': '/src/components',
        '@/svgs': '/src/svgs',
      };
    }
    return config;
  },
};

export default config;