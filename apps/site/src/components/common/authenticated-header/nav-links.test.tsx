// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NavLinks } from './nav-links';

const {
  mockGetAuthenticatedInfo,
  mockHasCompletedPlatformOnboarding,
  mockHasAcceptedAccountAgreement,
} = vi.hoisted(() => ({
  mockGetAuthenticatedInfo: vi.fn(),
  mockHasCompletedPlatformOnboarding: vi.fn(),
  mockHasAcceptedAccountAgreement: vi.fn(),
}));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mockGetAuthenticatedInfo,
}));

vi.mock('@/lib/utils/platform-onboarding', () => ({
  hasCompletedPlatformOnboarding: mockHasCompletedPlatformOnboarding,
}));

vi.mock('@/lib/utils/account-agreement', () => ({
  hasAcceptedAccountAgreement: mockHasAcceptedAccountAgreement,
}));

describe('NavLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthenticatedInfo.mockResolvedValue({ id: 1, approved: false });
    mockHasAcceptedAccountAgreement.mockResolvedValue(true);
  });

  test('renders the Account link once onboarding is complete', async () => {
    mockHasCompletedPlatformOnboarding.mockResolvedValue(true);

    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/support/contact'
    );
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
  });

  test('hides the Account link while onboarding is incomplete', async () => {
    mockHasCompletedPlatformOnboarding.mockResolvedValue(false);

    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    );
    expect(
      screen.queryByRole('link', { name: 'Account' })
    ).not.toBeInTheDocument();
  });

  test('keeps the public contact link for an approved viewer awaiting their agreement', async () => {
    mockGetAuthenticatedInfo.mockResolvedValue({
      id: 1,
      approved: true,
      role: 'Viewer',
    });
    mockHasCompletedPlatformOnboarding.mockResolvedValue(true);
    mockHasAcceptedAccountAgreement.mockResolvedValue(false);

    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    );
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
  });

  test('uses the authenticated contact link once a viewer accepts their agreement', async () => {
    mockGetAuthenticatedInfo.mockResolvedValue({
      id: 1,
      approved: true,
      role: 'Viewer',
    });
    mockHasCompletedPlatformOnboarding.mockResolvedValue(true);

    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/support/contact'
    );
  });
});
