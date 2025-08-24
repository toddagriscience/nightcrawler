import localFont from 'next/font/local';

// Neue Haas Unica - Main text font
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

// Utah WGL Condensed - Wordmark font
export const utahWGLCondensed = localFont({
  src: '../../public/fonts/UtahWGLCondensed/UtahWGLCondensedBold.ttf',
  variable: '--font-utah-wgl',
  display: 'swap',
  preload: false, // Only used for wordmark, so don't preload
  fallback: ['Arial Black', 'sans-serif'],
});

// Font class names for easy usage
export const fontClassNames = {
  neueHaas: neueHaasUnica.className,
  utahWGL: utahWGLCondensed.className,
} as const;

// CSS variables for use in Tailwind
export const fontVariables = `${neueHaasUnica.variable} ${utahWGLCondensed.variable}`;
