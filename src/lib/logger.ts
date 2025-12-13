// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Conditional logging utility that only outputs logs in development and local environments
 * Prevents console noise in production while maintaining debug capabilities
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

/**
 * Determines if logging should be enabled based on environment
 * @returns {boolean} True if in development or local environment
 */
const shouldLog = (): boolean => {
  // Check for Next.js development mode
  if (process.env.NODE_ENV === 'development') return true;

  // Check for local development indicators
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') return true;
  if (process.env.VERCEL_ENV === 'development') return true;

  // Check for localhost in URL (for local development)
  if (typeof window !== 'undefined') {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local')
    );
  }

  // Server-side: check for common local development ports and hosts
  if (process.env.PORT === '3000' || process.env.HOSTNAME === 'localhost')
    return true;

  return false;
};

/**
 * Conditional logger that respects environment settings
 */
class ConditionalLogger {
  private enabled: boolean;

  constructor() {
    this.enabled = shouldLog();
  }

  /**
   * Log a message (only in dev/local environments)
   * @param {...any} args - Arguments to log
   */
  log(...args: unknown[]): void {
    if (this.enabled) {
      console.log(...args);
    }
  }

  /**
   * Log a warning (only in dev/local environments)
   * @param {...any} args - Arguments to warn
   */
  warn(...args: unknown[]): void {
    if (this.enabled) {
      console.warn(...args);
    }
  }

  /**
   * Log an error (always shown, regardless of environment for critical issues)
   * @param {...any} args - Arguments to error
   */
  error(...args: unknown[]): void {
    console.error(...args);
  }

  /**
   * Log info (only in dev/local environments)
   * @param {...any} args - Arguments to info
   */
  info(...args: unknown[]): void {
    if (this.enabled) {
      console.info(...args);
    }
  }

  /**
   * Log debug information (only in dev/local environments)
   * @param {...any} args - Arguments to debug
   */
  debug(...args: unknown[]): void {
    if (this.enabled) {
      console.debug(...args);
    }
  }

  /**
   * Check if logging is currently enabled
   * @returns {boolean} Current logging state
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Force enable/disable logging (useful for testing)
   * @param {boolean} enabled - Whether to enable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const logger = new ConditionalLogger();

// Export default for convenience
export default logger;

// Export type for extensions
export type { LogLevel };
