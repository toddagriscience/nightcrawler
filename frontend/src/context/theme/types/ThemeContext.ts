// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ReactNode } from 'react';

/**
 * Theme context type
 * @property {boolean} isDark - Whether the theme is dark
 * @property {function} setIsDark - Function to set the theme
 * @property {function} setIsDarkSmooth - Function to set the theme smoothly
 * @property {function} toggleDark - Function to toggle the theme
 */
export interface ThemeContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  setIsDarkSmooth: (isDark: boolean) => void;
  toggleDark: () => void;
}

/**
 * Theme provider props
 * @property {ReactNode} children - The children to be wrapped
 */
export interface ThemeProviderProps {
  children: ReactNode;
}
