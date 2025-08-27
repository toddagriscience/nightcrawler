/**
 * Todd Agriscience Theme System
 *
 * Centralized theme configuration with TypeScript support.
 * This serves as the single source of truth for all design tokens.
 *
 * @copyright Copyright Todd LLC, All rights reserved.
 */

export const theme = {
  colors: {
    // Primary brand colors
    primary: '#2A2727', // Dark charcoal
    secondary: '#FDFDFB', // Off-white
    background: '#F8F5EE', // Cream background

    // Brand color palette
    chalk: '#FFFFFF',
    slate: {
      DEFAULT: '#333333',
      secondary: '#555555',
      tertiary: '#777777',
      quaternary: '#999999',
    },
    sage: '#AFB5AD',
    stone: {
      DEFAULT: '#8A8A8A',
      secondary: '#666666',
      tertiary: '#444444',
    },
    ash: '#DDDDDD',

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Card/section backgrounds
    card: {
      light: '#CCC5B5', // Light card background
      dark: '#2A2727', // Dark card background
    },

    // Text colors
    text: {
      primary: '#2A2727',
      secondary: '#555555',
      tertiary: '#777777',
      inverse: '#FDFDFB',
    },

    // Border colors
    border: {
      light: '#2A2727',
      dark: '#FDFDFB',
      subtle: 'rgba(42, 39, 39, 0.1)',
    },

    // Overlay colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.1)',
    },
  },

  spacing: {
    headerHeight: '80px',
  },

  fonts: {
    haas: 'var(--font-neue-haas), Arial, sans-serif',
    utah: 'var(--font-utah-wgl), "Arial Black", sans-serif',
    mono: 'var(--font-geist-mono)',
  },

  animation: {
    transition: {
      fast: '150ms',
      default: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Component-specific themes
  components: {
    header: {
      light: {
        background: 'rgba(0, 0, 0, 0.1)',
        text: '#2A2727',
        border: '#2A2727',
        hover: 'rgba(0, 0, 0, 0.05)',
      },
      dark: {
        background: 'rgba(255, 255, 255, 0.1)',
        text: '#FDFDFB',
        border: '#FDFDFB',
        hover: 'rgba(255, 255, 255, 0.05)',
      },
    },
    button: {
      light: {
        background: '#FDFDFB',
        text: '#2A2727',
        border: '#2A2727',
        hover: {
          background: '#2A2727',
          text: '#FDFDFB',
        },
      },
      dark: {
        background: '#2A2727',
        text: '#FDFDFB',
        border: '#FDFDFB',
        hover: {
          background: '#FDFDFB',
          text: '#2A2727',
        },
      },
    },
  },
} as const;

// Type exports for TypeScript support
export type Theme = typeof theme;
export type ThemeColors = Theme['colors'];
export type ComponentTheme = Theme['components'];

// Utility functions for theme manipulation
export const themeUtils = {
  /**
   * Get component theme based on dark mode state
   */
  getComponentTheme: <T extends keyof ComponentTheme>(
    component: T,
    isDark: boolean = false
  ): ComponentTheme[T]['light'] | ComponentTheme[T]['dark'] => {
    return isDark
      ? theme.components[component].dark
      : theme.components[component].light;
  },

  /**
   * Get contrasting text color
   */
  getContrastText: (isDark: boolean = false): string => {
    return isDark ? theme.colors.text.inverse : theme.colors.text.primary;
  },

  /**
   * Get background color for cards/sections
   */
  getCardBackground: (isDark: boolean = false): string => {
    return isDark ? theme.colors.card.dark : theme.colors.card.light;
  },

  /**
   * Generate CSS custom properties object
   */
  toCSSVariables: () => {
    const cssVars: Record<string, string> = {};

    // Convert flat color values
    const flattenColors = (
      obj: Record<string, string | Record<string, string>>,
      prefix: string = ''
    ): void => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string') {
          cssVars[`--color-${prefix}${key}`] = value;
        } else if (typeof value === 'object' && value !== null) {
          if ('DEFAULT' in value) {
            cssVars[`--color-${prefix}${key}`] = value.DEFAULT as string;
            flattenColors(value, `${prefix}${key}-`);
          } else {
            flattenColors(value, `${prefix}${key}-`);
          }
        }
      });
    };

    flattenColors(theme.colors);

    // Add other theme values
    cssVars['--header-height'] = theme.spacing.headerHeight;
    cssVars['--font-haas'] = theme.fonts.haas;
    cssVars['--font-utah'] = theme.fonts.utah;
    cssVars['--font-mono'] = theme.fonts.mono;

    return cssVars;
  },
};

export default theme;
