// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Conditional logging utility that only outputs logs in development environments.
 * Prevents console noise in production while maintaining debug capabilities.
 */

/** Supported log levels */
type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

/**
 * Determines if logging should be enabled based on environment
 * @returns True if in development or local environment
 */
const shouldLog = (): boolean => {
  if (process.env.NODE_ENV === 'development') return true;
  if (typeof window !== 'undefined') {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }
  if (process.env.PORT === '3100' || process.env.HOSTNAME === 'localhost')
    return true;
  return false;
};

/** Conditional logger that respects environment settings */
class ConditionalLogger {
  private enabled: boolean;

  constructor() {
    this.enabled = shouldLog();
  }

  /**
   * Log a message (only in dev/local environments)
   * @param args - Arguments to log
   */
  log(...args: unknown[]): void {
    if (this.enabled) console.log(...args);
  }

  /**
   * Log a warning (only in dev/local environments)
   * @param args - Arguments to warn
   */
  warn(...args: unknown[]): void {
    if (this.enabled) console.warn(...args);
  }

  /**
   * Log an error (always shown for critical issues)
   * @param args - Arguments to error
   */
  error(...args: unknown[]): void {
    console.error(...args);
  }

  /**
   * Log info (only in dev/local environments)
   * @param args - Arguments to info
   */
  info(...args: unknown[]): void {
    if (this.enabled) console.info(...args);
  }

  /**
   * Log debug information (only in dev/local environments)
   * @param args - Arguments to debug
   */
  debug(...args: unknown[]): void {
    if (this.enabled) console.debug(...args);
  }
}

/** Singleton logger instance */
export const logger = new ConditionalLogger();
export default logger;
export type { LogLevel };
