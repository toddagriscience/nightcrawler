// Copyright Todd LLC, All rights reserved.

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // In Tailwind CSS v4, theme configuration is handled via @theme in CSS files
  plugins: [],
};

export default config;
