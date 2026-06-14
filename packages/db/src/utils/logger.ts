// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Server-side logger for database package utilities.
 * Errors are always emitted; other levels only in development.
 */
class DbLogger {
  /**
   * Logs an error (always shown).
   *
   * @param args - Values to log
   */
  error(...args: unknown[]): void {
    console.error(...args);
  }

  /**
   * Logs a warning in development only.
   *
   * @param args - Values to log
   */
  warn(...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  }

  /**
   * Logs info in development only.
   *
   * @param args - Values to log
   */
  info(...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  }
}

/** Shared logger instance for `@nightcrawler/db`. */
export const logger = new DbLogger();
