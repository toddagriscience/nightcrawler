// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TooltipProvider } from '@/components/ui/tooltip';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShareArticleButtons from './share-article';

const PAGE_URL = 'https://toddagriscience.com/index/why-i-started-todd';

vi.mock('@/lib/hooks/useCurrentUrl', () => ({
  default: () => PAGE_URL,
}));

const renderShare = (el: ReactElement) =>
  render(<TooltipProvider>{el}</TooltipProvider>);

/** The three share platforms open a new window; grab the URL each one opens. */
function openedUrls(mockOpen: ReturnType<typeof vi.fn>): string[] {
  return mockOpen.mock.calls.map((c) => String(c[0]));
}

describe('ShareArticleButtons', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('opens LinkedIn via the share-offsite endpoint with UTM tags', async () => {
    const open = vi.fn();
    vi.stubGlobal('open', open);
    const user = userEvent.setup();
    renderShare(<ShareArticleButtons title="Why I started Todd" />);

    // buttons render in order: X, LinkedIn, Facebook (copy), Email
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);

    const [url] = openedUrls(open);
    expect(url).toContain('linkedin.com/sharing/share-offsite/');
    expect(url).not.toContain('linkedin.com/feed'); // the old broken endpoint
    const inner = decodeURIComponent(url.split('url=')[1]);
    expect(inner).toContain('utm_source=linkedin');
    expect(inner).toContain('utm_medium=social');
    expect(inner).toContain(PAGE_URL);
  });

  it('opens X (Twitter) intent with title and UTM-tagged url', async () => {
    const open = vi.fn();
    vi.stubGlobal('open', open);
    const user = userEvent.setup();
    renderShare(<ShareArticleButtons title="Why I started Todd" />);

    await user.click(screen.getAllByRole('button')[0]);

    const [url] = openedUrls(open);
    expect(url).toContain('twitter.com/intent/tweet');
    expect(url).toContain('text=Why%20I%20started%20Todd');
    const inner = decodeURIComponent(url.split('url=')[1].split('&text=')[0]);
    expect(inner).toContain('utm_source=x');
  });

  it('opens a mailto with the UTM-tagged url in the body', async () => {
    const open = vi.fn();
    vi.stubGlobal('open', open);
    const user = userEvent.setup();
    renderShare(<ShareArticleButtons title="Why I started Todd" />);

    // Email is the last button
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 1]);

    const [url] = openedUrls(open);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('mailto:?subject=Why I started Todd');
    expect(decoded).toContain('utm_source=email'); // body carries the tagged url
  });

  it('copies the raw link to the clipboard for Facebook', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    renderShare(<ShareArticleButtons title="Why I started Todd" />);

    // fireEvent (not userEvent) so we don't fight userEvent's own clipboard shim
    fireEvent.click(screen.getAllByRole('button')[2]);

    expect(writeText).toHaveBeenCalledWith(PAGE_URL);
  });
});
