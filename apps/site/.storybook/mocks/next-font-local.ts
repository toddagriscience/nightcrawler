interface LocalFontOptions {
  /** CSS variable name emitted by the Next font loader. */
  variable?: string;
}

interface LocalFontResult {
  /** Stable class name used by components that consume Next local fonts. */
  className: string;
  /** Optional CSS variable class name used by the app font setup. */
  variable: string;
  /** Inline style object returned by the real Next font loader. */
  style: Record<string, string>;
}

/**
 * Mocks Next's local font loader for Storybook's React Vite builder.
 */
const localFont = (options: LocalFontOptions = {}): LocalFontResult => ({
  className: 'storybook-local-font',
  variable: options.variable ?? '',
  style: {},
});

export default localFont;
