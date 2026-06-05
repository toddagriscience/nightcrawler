// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import ResearchIndexPage from './page';

describe('ResearchIndexPage', () => {
  it('renders the page heading and default listings', async () => {
    const node = await ResearchIndexPage({
      searchParams: Promise.resolve({}),
    });
    renderWithNextIntl(node);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Research' })
    ).toBeInTheDocument();
    expect(screen.getByText('Iris System Card')).toBeInTheDocument();
    expect(
      screen.getByText('Introducing Todd Regenerative Celery')
    ).toBeInTheDocument();
  });

  it('renders category filter tabs', async () => {
    const node = await ResearchIndexPage({
      searchParams: Promise.resolve({}),
    });
    renderWithNextIntl(node);

    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Publication' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Milestone' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Release' })).toBeInTheDocument();
  });

  it('shows View more and hides the tenth listing by default', async () => {
    const node = await ResearchIndexPage({
      searchParams: Promise.resolve({}),
    });
    renderWithNextIntl(node);

    expect(screen.getByRole('link', { name: 'View more' })).toBeInTheDocument();
    expect(
      screen.queryByText('Lorem ipsum dolor sit amet consectetur adipiscing')
    ).not.toBeInTheDocument();
  });

  it('shows all listings when count reveals the remainder', async () => {
    const node = await ResearchIndexPage({
      searchParams: Promise.resolve({ count: '10' }),
    });
    renderWithNextIntl(node);

    expect(
      screen.getByText('Lorem ipsum dolor sit amet consectetur adipiscing')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'View more' })
    ).not.toBeInTheDocument();
  });

  it('shows empty-state copy for Conclusion when there are no rows', async () => {
    const node = await ResearchIndexPage({
      searchParams: Promise.resolve({ category: 'conclusion' }),
    });
    renderWithNextIntl(node);

    expect(screen.getByText('No conclusion entries yet.')).toBeInTheDocument();
  });
});
