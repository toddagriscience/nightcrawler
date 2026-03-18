// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlatformTabs from './tabs';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('@/components/common/wordmark/todd-wordmark', () => ({
  default: () => <div>Todd</div>,
}));

vi.mock(
  '@/components/common/authenticated-header/components/search-nav-form',
  () => ({
    SearchNavForm: () => <div>Search</div>,
  })
);

vi.mock('./new-tab-dropdown', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('./actions', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue({ error: null }),
  createTab: vi.fn(),
  deleteTab: vi.fn(),
}));

describe('PlatformTabs', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    (useRouter as any).mockReturnValue({
      push: vi.fn(),
      replace: mockReplace,
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
    });
    document.title = 'Initial Title';
    mockReplace.mockReset();
  });

  it('sets the document title from the selected tab name', () => {
    render(
      <PlatformTabs
        currentTabs={[
          { id: 1, managementZone: 11, name: 'North Field', user: 7 },
          { id: 2, managementZone: 12, name: 'South Field', user: 7 },
        ]}
        currentUser={
          {
            id: 7,
            role: 'Admin',
            approved: true,
            farmId: 10,
          } as any
        }
        managementZones={[]}
        selectedTabHash="2"
        header={null}
        addWidgetDropdown={null}
      >
        <div>Content</div>
      </PlatformTabs>
    );

    expect(document.title).toBe('South Field | Todd');
  });

  it('updates the document title when the user switches tabs', () => {
    render(
      <PlatformTabs
        currentTabs={[
          { id: 1, managementZone: 11, name: 'North Field', user: 7 },
          { id: 2, managementZone: 12, name: 'South Field', user: 7 },
        ]}
        currentUser={
          {
            id: 7,
            role: 'Admin',
            approved: true,
            farmId: 10,
          } as any
        }
        managementZones={[]}
        selectedTabHash="1"
        header={null}
        addWidgetDropdown={null}
      >
        <div>Content</div>
      </PlatformTabs>
    );

    fireEvent.click(screen.getAllByRole('tab')[1]);

    expect(document.title).toBe('South Field | Todd');
    expect(mockReplace).toHaveBeenCalledWith('/?tab=2', { scroll: false });
  });
});
