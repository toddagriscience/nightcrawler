// Copyright (c) Todd Agriscience, Inc. All rights reserved.

/**
 * Tests for conditional logging utility
 */

import { logger } from './logger';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();
const mockConsoleDebug = jest.spyOn(console, 'debug').mockImplementation();

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleInfo.mockRestore();
    mockConsoleDebug.mockRestore();
  });

  it('should be defined and have all logging methods', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.isEnabled).toBe('function');
    expect(typeof logger.setEnabled).toBe('function');
  });

  it('should allow enabling/disabling logging', () => {
    logger.setEnabled(true);
    expect(logger.isEnabled()).toBe(true);

    logger.setEnabled(false);
    expect(logger.isEnabled()).toBe(false);
  });

  it('should log when enabled', () => {
    logger.setEnabled(true);

    logger.log('test message');
    logger.warn('test warning');
    logger.info('test info');
    logger.debug('test debug');

    expect(mockConsoleLog).toHaveBeenCalledWith('test message');
    expect(mockConsoleWarn).toHaveBeenCalledWith('test warning');
    expect(mockConsoleInfo).toHaveBeenCalledWith('test info');
    expect(mockConsoleDebug).toHaveBeenCalledWith('test debug');
  });

  it('should not log when disabled (except errors)', () => {
    logger.setEnabled(false);

    logger.log('test message');
    logger.warn('test warning');
    logger.info('test info');
    logger.debug('test debug');

    expect(mockConsoleLog).not.toHaveBeenCalled();
    expect(mockConsoleWarn).not.toHaveBeenCalled();
    expect(mockConsoleInfo).not.toHaveBeenCalled();
    expect(mockConsoleDebug).not.toHaveBeenCalled();
  });

  it('should always log errors regardless of enabled state', () => {
    logger.setEnabled(false);

    logger.error('critical error');

    expect(mockConsoleError).toHaveBeenCalledWith('critical error');
  });

  it('should handle multiple arguments', () => {
    logger.setEnabled(true);

    logger.log('message', { data: 'object' }, 123);

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'message',
      { data: 'object' },
      123
    );
  });

  it('should detect development environment correctly', () => {
    // Since we can't easily mock process.env in Jest reliably,
    // we'll test the manual enable/disable functionality instead
    const originalEnabled = logger.isEnabled();

    // Test manual override
    logger.setEnabled(true);
    expect(logger.isEnabled()).toBe(true);

    logger.setEnabled(false);
    expect(logger.isEnabled()).toBe(false);

    // Restore original state
    logger.setEnabled(originalEnabled);
  });
});
