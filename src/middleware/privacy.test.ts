// Copyright Todd Agriscience, Inc. All rights reserved.

import './middleware.setup';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { applyPrivacyControls, hasGPCEnabled } from './privacy';

// Mock logger
import { logger } from '@/lib/logger';

vi.mock('@/lib/logger', () => ({
  logger: {
    log: vi.fn(),
  },
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({
      headers: {
        set: vi.fn(),
      },
      cookies: {
        delete: vi.fn(),
      },
    })),
  },
}));

describe('Privacy Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasGPCEnabled', () => {
    it('should return true when Sec-GPC header is "1"', () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockReturnValue('1'),
        },
      } as unknown as NextRequest;

      const result = hasGPCEnabled(mockRequest);
      expect(result).toBe(true);
      expect(mockRequest.headers.get).toHaveBeenCalledWith('Sec-GPC');
    });

    it('should return false when Sec-GPC header is not "1"', () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockReturnValue('0'),
        },
      } as unknown as NextRequest;

      const result = hasGPCEnabled(mockRequest);
      expect(result).toBe(false);
    });

    it('should return false when Sec-GPC header is not present', () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockReturnValue(null),
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
          get: vi.fn((header) => {
            if (header === 'x-forwarded-for') return '192.168.1.1';
            return null;
          }),
        },
        cookies: {
          has: vi.fn().mockReturnValue(false),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        headers: {
          set: vi.fn(),
        },
        cookies: {
          delete: vi.fn(),
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
          get: vi.fn().mockReturnValue(null),
        },
        cookies: {
          has: vi.fn().mockReturnValue(false),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        headers: {
          set: vi.fn(),
        },
        cookies: {
          delete: vi.fn(),
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
          get: vi.fn().mockReturnValue(null),
        },
        cookies: {
          has: vi.fn((cookieName) => {
            return ['analytics', 'tracking', 'marketing'].includes(cookieName);
          }),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        headers: {
          set: vi.fn(),
        },
        cookies: {
          delete: vi.fn(),
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
