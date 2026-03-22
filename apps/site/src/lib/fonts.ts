// Copyright © Todd Agriscience, Inc. All rights reserved.

import localFont from 'next/font/local';

/**
 * Neue Haas Unica - Main text font
 * @returns {LocalFont} - The Neue Haas Unica font
 */
export const neueHaasUnica = localFont({
  src: [
    {
      path: '../../public/fonts/NeueHaasUnica/NeueHaasUnicaLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasUnica/NeueHaasUnicaRegular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-neue-haas',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif'],
});

/**
 * Utah WGL Condensed - Wordmark font
 * @returns {LocalFont} - The Utah WGL Condensed font
 */
export const utahWGLCondensed = localFont({
  src: '../../public/fonts/UtahWGLCondensed/UtahWGLCondensedBold.ttf',
  variable: '--font-utah-wgl',
  display: 'swap',
  preload: false, // Only used for wordmark, so don't preload
  fallback: ['Arial Black', 'sans-serif'],
});

/**
 * Font class names for easy usage
 * @returns {const} - The font class names
 */
export const fontClassNames = {
  neueHaas: neueHaasUnica.className,
  utahWGL: utahWGLCondensed.className,
} as const;

/**
 * CSS variables for use in Tailwind
 * @returns {string} - The font variables
 */
export const fontVariables = `${neueHaasUnica.variable} ${utahWGLCondensed.variable}`;
