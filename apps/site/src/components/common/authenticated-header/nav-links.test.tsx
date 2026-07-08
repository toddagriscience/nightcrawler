// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NavLinks } from './nav-links';

const { mockGetAuthenticatedInfo, mockHasCompletedPlatformOnboarding } =
  vi.hoisted(() => ({
    mockGetAuthenticatedInfo: vi.fn(),
    mockHasCompletedPlatformOnboarding: vi.fn(),
  }));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mockGetAuthenticatedInfo,
}));

vi.mock('@/lib/utils/platform-onboarding', () => ({
  hasCompletedPlatformOnboarding: mockHasCompletedPlatformOnboarding,
}));

describe('NavLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthenticatedInfo.mockResolvedValue({ id: 1, approved: false });
  });

  test('renders the Account link once onboarding is complete', async () => {
    mockHasCompletedPlatformOnboarding.mockResolvedValue(true);

    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
  });

  test('hides the Account link while onboarding is incomplete', async () => {
    mockHasCompletedPlatformOnboarding.mockResolvedValue(false);

    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Account' })
    ).not.toBeInTheDocument();
  });
});
