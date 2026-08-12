// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Stands in for `next/font/local` under the React Vite builder, which has no
 * Next.js font pipeline of its own.
 *
 * The contract that matters is `variable`: the real loader returns a generated
 * *class name* whose rule declares the custom property, not the property name
 * itself. Returning the property name leaves `var(--font-neue-haas)` undefined
 * and silently drops every story to the fallback face — invisible in CI, and a
 * whole-suite diff in Chromatic.
 *
 * So this mock does what the loader does: emit `@font-face` rules for the real
 * files under `public/` (served at `/fonts` via `staticDirs`) and a class that
 * binds the custom property to them.
 */

/** One `src` entry, matching the real loader's array form. */
interface LocalFontSource {
  path: string;
  weight?: string;
  style?: string;
}

interface LocalFontOptions {
  src: string | LocalFontSource[];
  /** Custom property the app expects this font to be reachable through. */
  variable?: string;
  display?: string;
  fallback?: string[];
  preload?: boolean;
  weight?: string;
  style?: string;
}

interface LocalFontResult {
  /** Class that applies the family directly. */
  className: string;
  /** Class that declares `options.variable`, exactly as Next returns it. */
  variable: string;
  style: { fontFamily: string };
}

/** Distinguishes families when a page loads more than one. */
let familyCount = 0;

/** `src` paths are relative to the importing module; the files are served from `public`. */
function toServedUrl(srcPath: string): string {
  const fromPublic = srcPath.split(/\/?public\//).pop() ?? srcPath;
  return `/${fromPublic.replace(/^\/+/, '')}`;
}

function formatFor(url: string): string {
  if (url.endsWith('.woff2')) return 'woff2';
  if (url.endsWith('.woff')) return 'woff';
  if (url.endsWith('.otf')) return 'opentype';
  return 'truetype';
}

function injectCss(css: string): void {
  // The preview runs in a browser, but portable stories run under vitest's
  // node environment, where there is no document to attach a stylesheet to.
  if (typeof document === 'undefined') {
    return;
  }
  const style = document.createElement('style');
  style.setAttribute('data-storybook-local-font', '');
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Mocks Next's local font loader for Storybook's React Vite builder.
 *
 * @param options - The same options object the real loader takes
 * @returns Class names and inline style mirroring the real loader's result
 */
const localFont = (options: LocalFontOptions): LocalFontResult => {
  familyCount += 1;
  const family = `sb-local-font-${familyCount}`;
  const className = `${family}-class`;
  const variableClass = `${family}-variable`;

  const sources: LocalFontSource[] =
    typeof options.src === 'string'
      ? [{ path: options.src, weight: options.weight, style: options.style }]
      : options.src;

  const faces = sources
    .map((source) => {
      const url = toServedUrl(source.path);
      return [
        '@font-face {',
        `  font-family: '${family}';`,
        `  src: url('${url}') format('${formatFor(url)}');`,
        source.weight ? `  font-weight: ${source.weight};` : '',
        source.style ? `  font-style: ${source.style};` : '',
        `  font-display: ${options.display ?? 'swap'};`,
        '}',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const stack = [`'${family}'`, ...(options.fallback ?? [])].join(', ');

  injectCss(
    [
      faces,
      `.${className} { font-family: ${stack}; }`,
      options.variable
        ? `.${variableClass} { ${options.variable}: ${stack}; }`
        : '',
    ]
      .filter(Boolean)
      .join('\n')
  );

  return {
    className,
    // Next returns a class here, not the property name — see the file comment.
    variable: options.variable ? variableClass : '',
    style: { fontFamily: stack },
  };
};

export default localFont;
