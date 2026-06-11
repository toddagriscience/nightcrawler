// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NewZoneButton from './new-zone-button';

vi.mock(
  '@/app/(authenticated)/(accounts)/account/(with-shell)/management-zones/[zone]/actions',
  () => ({
    createManagementZone: vi.fn(async () => ({})),
  })
);

vi.mock('@/components/common/portal', () => ({
  Portal: vi.fn(({ children }) => <>{children}</>),
}));

describe('NewZoneButton', () => {
  it('renders "New Zone" button', () => {
    render(<NewZoneButton />);
    expect(
      screen.getByRole('button', { name: 'New Zone' })
    ).toBeInTheDocument();
  });

  it('renders "New Zone" text as button label', () => {
    render(<NewZoneButton />);
    const btn = screen.getByRole('button', { name: 'New Zone' });
    expect(btn).toBeInTheDocument();
  });
});
