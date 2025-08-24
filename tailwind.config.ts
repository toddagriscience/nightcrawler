import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        chalk: 'var(--chalk)',
        slate: {
          DEFAULT: 'var(--slate)',
          secondary: 'var(--slate-secondary)',
          tertiary: 'var(--slate-tertiary)',
          quaternary: 'var(--slate-quaternary)',
        },
        sage: 'var(--sage)',
        stone: {
          DEFAULT: 'var(--stone)',
          secondary: 'var(--stone-secondary)',
          tertiary: 'var(--stone-tertiary)',
        },
        ash: 'var(--ash)',
        chalk20: 'var(--chalk20)',
      },
      fontFamily: {
        'neue-haas': ['var(--font-neue-haas)', 'Arial', 'sans-serif'],
        'utah-wgl': ['var(--font-utah-wgl)', 'Arial Black', 'sans-serif'],
        haas: ['var(--font-haas)', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)'],
      },
      height: {
        '0.25': '1px',
        '13': '3.25rem',
        header: 'var(--headerHeight)',
        '100dvh': 'var(--100dvh)',
      },
      spacing: {
        '18': '4.5rem',
        header: 'var(--headerHeight)',
      },
      letterSpacing: {
        wordmark: '0.03em',
      },
    },
  },
  plugins: [],
};

export default config;
