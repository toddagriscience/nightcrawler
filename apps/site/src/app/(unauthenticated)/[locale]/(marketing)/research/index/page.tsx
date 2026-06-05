// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { BiChevronDown } from 'react-icons/bi';
import { LuLayoutGrid, LuMenu } from 'react-icons/lu';

/**
 * A single row in the research listing.
 *
 * Shaped to mirror the relevant `SanityArticle` fields so the placeholder data
 * below can be swapped for `getArticlesByCollection('research')` with minimal
 * mapping (see the integration note in {@link ResearchIndexPage}).
 */
interface ResearchListItem {
  /** Stable key for the row. */
  id: string;
  /** Category label shown above the date (maps to `news.contentType`). */
  category: string;
  /** Human-readable publish date (maps from `news.date`). */
  date: string;
  /** Article headline (maps from `news.title`). */
  title: string;
  /** Optional supporting blurb (maps from `news.summary` / `news.subtitle`). */
  description?: string;
  /** Article slug used to build the detail route (maps from `news.slug.current`). */
  slug: string;
}

/** Category filter tabs rendered above the listing. */
const RESEARCH_TABS = [
  'All',
  'Publication',
  'Conclusion',
  'Milestone',
  'Release',
] as const;

/**
 * Maps a filter tab to the listing `category` value it should match.
 *
 * The tabs use editorial groupings while rows keep their own labels, so the tab
 * label and the row `category` differ (e.g. the `Publication` tab shows
 * `Research` rows). `All` is handled separately and `Conclusion` has no rows yet.
 */
const TAB_CATEGORY_MAP: Record<string, string> = {
  Publication: 'Research',
  Release: 'Product',
  Milestone: 'Milestone',
  Conclusion: 'Conclusion',
};

/** How many rows are visible initially and revealed per "View more" click. */
const PAGE_SIZE = 9;

/**
 * Placeholder research/product-release rows.
 *
 * TODO(sanity): Replace with `await getArticlesByCollection('research')` from
 * `@/lib/sanity/articles` and map each `SanityArticle` to a {@link ResearchListItem}
 * (`category` ← `contentType`, `date` ← formatted `date`, `slug` ← `slug.current`).
 */
const RESEARCH_ITEMS: ResearchListItem[] = [
  {
    id: '1',
    category: 'Milestone',
    date: 'Apr 23, 2026',
    title: 'Iris System Card',
    slug: 'iris-system-card',
  },
  {
    id: '2',
    category: 'Product',
    date: 'Apr 23, 2026',
    title: 'Introducing Todd-Iris',
    description:
      'Last fall, Todd announced its recapitialization, paving the way for the Todd Foundation to access significant resources.',
    slug: 'introducing-todd-iris',
  },
  {
    id: '3',
    category: 'Research',
    date: 'Apr 22, 2026',
    title: 'Introducing Todd Regenerative Celery',
    description:
      'Today, we’re sharing how the Foundation is starting to put that support to work.',
    slug: 'introducing-todd-regenerative-celery',
  },
  {
    id: '4',
    category: 'Product',
    date: 'Apr 21, 2026',
    title: 'Introducing New Todd Crop Genetics',
    description:
      'Todd is building a team that embodies diversity of thought, experience and background. Values: These values define what we consider to be the most important things.',
    slug: 'introducing-new-todd-crop-genetics',
  },
  {
    id: '5',
    category: 'Research',
    date: 'Apr 16, 2026',
    title: 'Introducing Todd-Iris for sustainable agriculture',
    description:
      'We believe that channeling these values is the most promising way to achieve our mission.',
    slug: 'introducing-todd-iris-for-sustainable-agriculture',
  },
  {
    id: '6',
    category: 'Research',
    date: 'Mar 25, 2026',
    title: 'Inside our approach to sustainable agriculture',
    description:
      'Humility reminds us to recognize the limits of our own knowledge and to remain open to new ideas, perspectives, and the possibility of being wrong.',
    slug: 'inside-our-approach-to-sustainable-agriculture',
  },
  {
    id: '7',
    category: 'Milestone',
    date: 'Mar 19, 2026',
    title: 'How we monitor internal platforms for misalignment',
    description:
      'Building a company requires rigor and discipline, boundless imagination, and a deep sense of responsibility.',
    slug: 'how-we-monitor-internal-platforms-for-misalignment',
  },
  {
    id: '8',
    category: 'Research',
    date: 'Mar 10, 2026',
    title: 'Improving advisory hierarchy for frontier platforms',
    description:
      'We approach research and product development with respect for the transformative technology we are helping create, and the coupled benefits, changes, and risks that come along with it.',
    slug: 'improving-advisory-hierarchy-for-frontier-platforms',
  },
  {
    id: '9',
    category: 'Research',
    date: 'Mar 5, 2026',
    title:
      'Sustainable agriculture struggle to control their chains of thought, and that’s good',
    description:
      'Our technology reflects an internal culture of optimism for the future and stewardship of our mission.',
    slug: 'sustainable-agriculture-chains-of-thought',
  },
  {
    id: '10',
    category: 'Research',
    date: 'Feb 28, 2026',
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore.',
    slug: 'lorem-ipsum-dolor-sit-amet',
  },
];

/**
 * Research & product-release listing (`/{locale}/research/index`).
 *
 * Renders a category filter bar, Filter/Sort controls, and a divided list of
 * article rows. The active category is driven by the `?category=` search param
 * so filtering stays server-rendered and shareable. Content is currently static
 * placeholder data; see {@link RESEARCH_ITEMS} for the Sanity integration point.
 *
 * @param props - Page props
 * @param props.searchParams - Route search params (`category` selects the active tab)
 * @returns {JSX.Element} The research listing page
 */
export default async function ResearchIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; count?: string }>;
}) {
  const { category, count } = await searchParams;
  const activeCategory =
    RESEARCH_TABS.find(
      (tab) => tab.toLowerCase() === (category ?? '').toLowerCase()
    ) ?? 'All';
  const filteredItems =
    activeCategory === 'All'
      ? RESEARCH_ITEMS
      : RESEARCH_ITEMS.filter(
          (item) => item.category === TAB_CATEGORY_MAP[activeCategory]
        );

  const requestedCount = Number.parseInt(count ?? '', 10);
  const visibleCount = Math.min(
    Number.isFinite(requestedCount) && requestedCount > 0
      ? Math.max(requestedCount, PAGE_SIZE)
      : PAGE_SIZE,
    filteredItems.length
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;
  const nextCount = Math.min(visibleCount + PAGE_SIZE, filteredItems.length);
  const categoryQuery =
    activeCategory === 'All' ? '' : `category=${activeCategory.toLowerCase()}&`;

  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 sm:px-12 md:pt-16 lg:px-20">
        {/* Heading + toolbar */}
        <header className="flex flex-col gap-8 lg:gap-10">
          <h1 className="text-[40px] font-normal leading-tight sm:text-[48px] sm:leading-[64px]">
            Research
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav aria-label="Filter research by category">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {RESEARCH_TABS.map((tab) => (
                  <li key={tab}>
                    <Link
                      href={
                        tab === 'All'
                          ? '/research/index'
                          : `/research/index?category=${tab.toLowerCase()}`
                      }
                      aria-current={tab === activeCategory ? 'true' : undefined}
                      className="text-[18px] font-normal leading-7 text-black transition-opacity hover:opacity-60 aria-[current=true]:underline aria-[current=true]:underline-offset-4"
                    >
                      {tab}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-6 text-[14px] leading-7">
              <button
                type="button"
                className="flex items-center gap-1 text-black transition-opacity hover:opacity-60"
              >
                Filter
                <BiChevronDown aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-1 text-black transition-opacity hover:opacity-60"
              >
                Sort
                <BiChevronDown aria-hidden className="size-4" />
              </button>

              {/* Grid / list view toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Grid view"
                  className="text-[#d9d9d9] transition-opacity hover:opacity-60"
                >
                  <LuLayoutGrid aria-hidden className="size-[18px]" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed
                  className="text-[#181818] transition-opacity hover:opacity-60"
                >
                  <LuMenu aria-hidden className="size-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Listing */}
        {filteredItems.length === 0 ? (
          <p className="mt-12 text-[14px] leading-7 text-[#666666]">
            No {activeCategory.toLowerCase()} entries yet.
          </p>
        ) : (
          <ul className="mt-8">
            {visibleItems.map((item) => (
              <li
                key={item.id}
                className="border-b border-[rgba(226,226,226,0.5)]"
              >
                <div className="flex cursor-pointer flex-col gap-2 py-7 transition-opacity hover:opacity-70 md:flex-row md:gap-10">
                  <div className="flex gap-3 text-[14px] leading-7 md:w-[280px] md:shrink-0 md:flex-col md:gap-0">
                    <span className="text-black">{item.category}</span>
                    <span className="text-[#666666]">{item.date}</span>
                  </div>

                  <div className="max-w-[600px]">
                    <h2 className="text-[18px] font-normal leading-[26px] text-black">
                      {item.title}
                    </h2>
                    {item.description ? (
                      <p className="mt-2 text-[14px] font-normal leading-[27px] text-black">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* View more */}
        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Link
              href={`/research/index?${categoryQuery}count=${nextCount}`}
              scroll={false}
              className="rounded-[50px] border-[0.75px] border-[#848484] px-7 py-2.5 text-[14px] leading-none text-[#181818] transition-colors hover:bg-black/5"
            >
              View more
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
