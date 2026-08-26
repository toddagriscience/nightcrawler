// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  ArticleContentType,
  SanityArticle,
} from '@/lib/sanity/article-types';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewsHighlightTiles } from './news-highlight-tiles';

const CATEGORY_LABELS: Partial<Record<ArticleContentType, string>> = {
  'news-company': 'Company',
  'news-research': 'Research',
  'news-global-affairs': 'Global affairs',
  'research-publication': 'Publication',
};

const ARTICLES: SanityArticle[] = [
  {
    _id: 'highlight-1',
    _type: 'news',
    title: 'Next Century of American Agriculture',
    slug: { current: 'next-century-of-american-agriculture' },
    contentType: 'news-company',
    date: '2026-08-12',
  },
  {
    _id: 'highlight-2',
    _type: 'news',
    title: 'Interview guide',
    slug: { current: 'interview-guide' },
    contentType: 'news-research',
    date: '2026-07-30',
  },
  {
    _id: 'highlight-3',
    _type: 'news',
    title: 'Building dynamic teams',
    slug: { current: 'building-dynamic-teams' },
    contentType: 'news-global-affairs',
    date: '2026-07-02',
  },
];

const meta = {
  title: 'Marketing/NewsHighlightTiles',
  component: NewsHighlightTiles,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'Section heading above the grid',
    },
    sectionId: {
      control: 'text',
      description: 'DOM id for the section; also seeds the heading id',
    },
  },
  args: {
    articles: ARTICLES,
    categoryLabel: (type: ArticleContentType) => CATEGORY_LABELS[type] ?? type,
    heading: 'Resources',
    sectionId: 'story-highlights',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '4rem 0' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof NewsHighlightTiles>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three highlighted articles — the full strip an editor curates per page. */
export const Default: Story = {};

/** An off-site pick sits alongside on-site ones and opens in a new tab. */
export const WithOffSiteArticle: Story = {
  args: {
    articles: [
      ARTICLES[0],
      { ...ARTICLES[1], offSiteUrl: 'https://example.com/interview-guide' },
      ARTICLES[2],
    ],
  },
};

/** Fewer than three picks: the grid keeps its columns instead of stretching. */
export const PartiallyFilled: Story = {
  args: {
    articles: ARTICLES.slice(0, 2),
  },
};

/** Long titles wrap without pushing the category line out of alignment. */
export const LongTitles: Story = {
  args: {
    articles: ARTICLES.map((article, index) => ({
      ...article,
      title: `${article.title} and what it means for growers in the ${2026 + index} season`,
    })),
  },
};

/** Nothing highlighted for the page — the section renders nothing at all. */
export const Empty: Story = {
  args: {
    articles: [],
  },
};
