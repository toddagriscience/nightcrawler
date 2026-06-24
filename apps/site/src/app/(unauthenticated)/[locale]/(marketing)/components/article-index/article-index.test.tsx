// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/articleIndex/en.json';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
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
    contentType: 'research',
    date: '2026-04-20',
    summary: 'Summary',
  },
];

function render(overrides: Partial<ArticleIndexProps> = {}) {
  return ArticleIndex({
    articles: ITEMS,
    activeTopic: 'all',
    basePath: '/research/index',
    title: 'Research',
    t,
    ...overrides,
  });
}

describe('isArticleIndexTopic', () => {
  it('accepts known topics and rejects others', () => {
    expect(isArticleIndexTopic('research')).toBe(true);
    expect(isArticleIndexTopic('product-release')).toBe(true);
    expect(isArticleIndexTopic('news')).toBe(false); // news is never a topic
    expect(isArticleIndexTopic('bogus')).toBe(false);
  });
});

describe('ArticleIndex', () => {
  it('renders the topic tab bar by default', async () => {
    renderWithNextIntl(await render());
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Research' })).toBeInTheDocument();
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
});
