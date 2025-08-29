// Copyright Todd LLC, All rights reserved.

/**
 * Header theme
 * @property {Object} header - The header theme
 * @property {Object} header.light - The light theme
 * @property {Object} header.dark - The dark theme
 */
export const headerTheme = {
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
};

/**
 * Header props
 * @property {boolean} alwaysGlassy - Whether to always show the glassy effect
 * @property {boolean} isDark - Whether to use the dark theme
 */
export interface HeaderProps {
  alwaysGlassy?: boolean;
  isDark?: boolean;
}
