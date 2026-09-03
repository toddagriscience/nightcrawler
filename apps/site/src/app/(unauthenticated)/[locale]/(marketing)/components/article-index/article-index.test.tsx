// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/article-index/en.json';
import {
  NEWS_TOPIC_TYPES,
  RESEARCH_CONTENT_TYPES,
  type SanityArticle,
} from '@/lib/sanity/article-types';
import { stubMatchMedia } from '@/test/stub-match-media';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ArticleIndex,
  type ArticleIndexProps,
  isArticleIndexTopic,
} from './article-index';

/** Translator over the real `articleIndex` English messages, with `{token}` interpolation. */
const t: ArticleIndexProps['t'] = (key, values) => {
  const raw = key
    .split('.')
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      enMessages.articleIndex
    );
  let text = typeof raw === 'string' ? raw : `[${key}]`;
  if (values) {
    for (const [name, value] of Object.entries(values)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
};

const ITEMS: SanityArticle[] = [
  {
    _id: 'r1',
    _type: 'news',
    title: 'Research Row',
    slug: { current: 'research-row' },
    contentType: 'research-publication',
    date: '2026-04-20',
    summary: 'Summary',
  },
];

function render(overrides: Partial<ArticleIndexProps> = {}) {
  return ArticleIndex({
    articles: ITEMS,
    topics: RESEARCH_CONTENT_TYPES,
    activeTopic: 'all',
    basePath: '/research/index',
    title: 'Research',
    t,
    ...overrides,
  });
}

describe('isArticleIndexTopic', () => {
  it('accepts research topics and rejects others', () => {
    expect(isArticleIndexTopic('research-publication')).toBe(true);
    expect(isArticleIndexTopic('research-release')).toBe(true);
    expect(isArticleIndexTopic('news-company')).toBe(false); // news taxonomy is not a research topic
    expect(isArticleIndexTopic('research')).toBe(false); // legacy value is not a valid topic id
    expect(isArticleIndexTopic('bogus')).toBe(false);
  });
});

describe('ArticleIndex', () => {
  it('renders the topic tab bar by default', async () => {
    renderWithNextIntl(await render());
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
    // research-publication → "Publication" tab.
    expect(
      screen.getByRole('link', { name: 'Publication' })
    ).toBeInTheDocument();
  });

  it('normalizes legacy contentType values onto the new taxonomy', async () => {
    renderWithNextIntl(
      await render({
        // Simulate a legacy stored value that predates the namespaced taxonomy.
        articles: [
          {
            ...ITEMS[0],
            contentType:
              'research' as unknown as (typeof ITEMS)[0]['contentType'],
          },
        ],
      })
    );
    // Legacy `research` normalizes to research-publication → "Publication" tab present.
    expect(
      screen.getByRole('link', { name: 'Publication' })
    ).toBeInTheDocument();
  });

  it('uses query-param hrefs in query mode (news taxonomy)', async () => {
    renderWithNextIntl(
      await render({
        topics: NEWS_TOPIC_TYPES,
        topicHrefMode: 'query',
        basePath: '/news',
        articles: [{ ...ITEMS[0], _id: 'n1', contentType: 'news-company' }],
      })
    );
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute(
      'href',
      '/news'
    );
    expect(screen.getByRole('link', { name: 'Company' })).toHaveAttribute(
      'href',
      '/news?topic=news-company'
    );
  });

  it('hides the tab bar when showTopicTabs is false', async () => {
    renderWithNextIntl(await render({ showTopicTabs: false }));
    expect(screen.queryByRole('link', { name: 'All' })).not.toBeInTheDocument();
    expect(screen.getByText('Research Row')).toBeInTheDocument();
  });

  it('opens safe external links in a new tab', async () => {
    renderWithNextIntl(
      await render({
        articles: [
          {
            ...ITEMS[0],
            _id: 'ext',
            title: 'External Row',
            offSiteUrl: 'https://example.com/post',
          },
        ],
      })
    );
    const link = screen.getByText('External Row').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com/post');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('hides placeholder "n/a" summaries', async () => {
    renderWithNextIntl(
      await render({
        articles: [
          { ...ITEMS[0], _id: 'na', title: 'No Summary Row', summary: 'n/a' },
        ],
      })
    );
    expect(screen.getByText('No Summary Row')).toBeInTheDocument();
    expect(screen.queryByText('n/a')).not.toBeInTheDocument();
  });

  it('drops dangerous hrefs entirely', async () => {
    const { container } = renderWithNextIntl(
      await render({
        articles: [
          {
            ...ITEMS[0],
            _id: 'evil',
            title: 'Evil Row',
            offSiteUrl: 'javascript:alert(1)',
          },
        ],
      })
    );
    expect(screen.getByText('Evil Row').closest('a')).toBeNull();
    expect(container.querySelector('a[href^="javascript:" i]')).toBeNull();
  });

  it('styles "View more" as the shared 14px outline pill', async () => {
    // The button only renders past the first page, so overflow PAGE_SIZE (9).
    renderWithNextIntl(
      await render({
        articles: Array.from({ length: 10 }, (_, index) => ({
          ...ITEMS[0],
          _id: `r${index}`,
          title: `Research Row ${index}`,
          slug: { current: `research-row-${index}` },
        })),
      })
    );

    const viewMore = screen.getByRole('link', { name: 'View more' });
    expect(viewMore).toHaveAttribute('href', '/research/index?count=10');
    // Asserts the traits the issue calls for -- an outline pill at 14px --
    // rather than the shared constant itself, so a palette tweak upstream does
    // not break this test while hand-written classes still would.
    expect(viewMore).toHaveClass('rounded-full', 'border', 'text-sm');
  });
});

describe('ArticleIndex cursor follower', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('tags rows with the label and mounts the follower when cursorLabel is set', async () => {
    stubMatchMedia(true);
    renderWithNextIntl(await render({ cursorLabel: 'Read' }));

    expect(screen.getByRole('link', { name: /Research Row/ })).toHaveAttribute(
      'data-cursor-label',
      'Read'
    );
    expect(screen.getByTestId('cursor-follower')).toBeInTheDocument();
  });

  it('keeps the native pointer when cursorLabel is omitted', async () => {
    stubMatchMedia(true);
    renderWithNextIntl(await render());

    expect(
      screen.getByRole('link', { name: /Research Row/ })
    ).not.toHaveAttribute('data-cursor-label');
    expect(screen.queryByTestId('cursor-follower')).not.toBeInTheDocument();
  });
});
