// Copyright Todd LLC, All rights reserved.

/**
 * @jest-environment node
 */

// Import setup first
import './middleware.setup';

import { NextRequest, NextResponse } from 'next/server';
import { applyPrivacyControls, hasGPCEnabled } from './privacy';

// Mock logger
import { logger } from '@/lib/logger';

jest.mock('@/lib/logger', () => ({
  logger: {
    log: jest.fn(),
  },
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({
      headers: {
        set: jest.fn(),
      },
      cookies: {
        delete: jest.fn(),
      },
    })),
  },
}));

describe('Privacy Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hasGPCEnabled', () => {
    it('should return true when Sec-GPC header is "1"', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('1'),
        },
      } as unknown as NextRequest;

      const result = hasGPCEnabled(mockRequest);
      expect(result).toBe(true);
      expect(mockRequest.headers.get).toHaveBeenCalledWith('Sec-GPC');
    });

    it('should return false when Sec-GPC header is not "1"', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('0'),
        },
      } as unknown as NextRequest;

      const result = hasGPCEnabled(mockRequest);
      expect(result).toBe(false);
    });

    it('should return false when Sec-GPC header is not present', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest;

      const result = hasGPCEnabled(mockRequest);
      expect(result).toBe(false);
    });
  });

  describe('applyPrivacyControls', () => {
    it('should apply GPC headers when GPC is enabled', () => {
      const mockRequest = {
        headers: {
          get: jest.fn((header) => {
            if (header === 'x-forwarded-for') return '192.168.1.1';
            return null;
          }),
        },
        cookies: {
          has: jest.fn().mockReturnValue(false),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
        cookies: {
          delete: jest.fn(),
        },
      } as unknown as NextResponse;

      const result = applyPrivacyControls(mockRequest, mockResponse, true);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'x-gpc-detected',
        '1'
      );
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'x-privacy-mode',
        'strict'
      );
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Privacy-Control',
        'gpc-enabled'
      );
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Data-Processing',
        'minimal'
      );
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining(
          '[GPC] Privacy signal detected from 192.168.1.1'
        )
      );
      expect(result).toBe(mockResponse);
    });

    it('should apply standard headers when GPC is disabled', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        cookies: {
          has: jest.fn().mockReturnValue(false),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
        cookies: {
          delete: jest.fn(),
        },
      } as unknown as NextResponse;

      const result = applyPrivacyControls(mockRequest, mockResponse, false);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'x-privacy-mode',
        'standard'
      );
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Privacy-Control',
        'standard'
      );
      expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
        'x-gpc-detected',
        '1'
      );
      expect(result).toBe(mockResponse);
    });

    it('should remove non-essential cookies when GPC is enabled', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        cookies: {
          has: jest.fn((cookieName) => {
            return ['analytics', 'tracking', 'marketing'].includes(cookieName);
          }),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
        cookies: {
          delete: jest.fn(),
        },
      } as unknown as NextResponse;

      applyPrivacyControls(mockRequest, mockResponse, true);

      expect(mockResponse.cookies.delete).toHaveBeenCalledWith('analytics');
      expect(mockResponse.cookies.delete).toHaveBeenCalledWith('tracking');
      expect(mockResponse.cookies.delete).toHaveBeenCalledWith('marketing');
      expect(logger.log).toHaveBeenCalledWith(
        '[GPC] Removed non-essential cookie: analytics'
      );
      expect(logger.log).toHaveBeenCalledWith(
        '[GPC] Removed non-essential cookie: tracking'
      );
      expect(logger.log).toHaveBeenCalledWith(
        '[GPC] Removed non-essential cookie: marketing'
      );
    });
  });
});
