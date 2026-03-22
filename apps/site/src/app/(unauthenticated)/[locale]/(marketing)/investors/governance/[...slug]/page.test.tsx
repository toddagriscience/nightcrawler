// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GovernancePage from './page';
import sanityQuery from '@/lib/sanity/query';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} {...props} />
  ),
}));

vi.mock('@/lib/sanity/query', () => ({
  default: vi.fn(),
}));

vi.mock('@/lib/sanity/utils', () => ({
  urlFor: vi.fn(() => ({
    url: () => 'https://example.com/profile.jpg',
  })),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  })),
}));

const mockProfile = {
  _id: 'profile-1',
  _rev: 'rev-1',
  _type: 'governance-profiles',
  _createdAt: '2026-02-13T00:00:00.000Z',
  _updatedAt: '2026-02-13T00:00:00.000Z',
  name: 'Vincent Todd',
  title: 'Chairman & Chief Executive Officer',
  profileImage: {
    asset: {
      _ref: 'image-123',
      _type: 'reference',
    },
    alt: 'Vincent Todd headshot',
  },
  quote: 'Accelerating agriculture.',
  backstory: [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'b1c1',
          text: 'Backstory paragraph one.',
          marks: [],
        },
      ],
    },
  ],
  vision: [
    {
      _type: 'block',
      _key: 'v1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'v1c1',
          text: 'Vision paragraph one.',
          marks: [],
        },
      ],
    },
  ],
  email: 'vincent@todd.com',
};

describe('GovernancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders governance profile content from Sanity', async () => {
    vi.mocked(sanityQuery).mockResolvedValueOnce(mockProfile);

    const page = await GovernancePage({
      params: Promise.resolve({ slug: 'vincent-todd' }),
    });
    renderWithNextIntl(page);

    expect(screen.getByText('Vincent Todd')).toBeInTheDocument();
    expect(
      screen.getByText('Chairman & Chief Executive Officer')
    ).toBeInTheDocument();
    expect(screen.getByText('"Accelerating agriculture."')).toBeInTheDocument();
    expect(screen.getByText('Backstory')).toBeInTheDocument();
    expect(screen.getByText('Backstory paragraph one.')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(screen.getByText('Vision paragraph one.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Reach out to Vincent/i })
    ).toBeInTheDocument();
  });

  it('passes the resolved slug to sanityQuery', async () => {
    vi.mocked(sanityQuery).mockResolvedValueOnce(mockProfile);

    const page = await GovernancePage({
      params: Promise.resolve({ slug: ['vincent-todd'] }),
    });
    renderWithNextIntl(page);

    expect(sanityQuery).toHaveBeenCalledWith(
      'governance-profiles',
      { slug: 'vincent-todd' },
      { next: { revalidate: 0 } },
      0
    );
  });
});
