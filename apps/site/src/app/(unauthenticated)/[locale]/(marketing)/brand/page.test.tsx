// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import brandMessages from '@/messages/brand/en.json';
import { describe, expect, it, vi } from 'vitest';

import BrandPage from './page';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('BrandPage', () => {
  it('renders page heading from brand messages', async () => {
    render(await BrandPage());

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: brandMessages.brand.pageHeading.title,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(brandMessages.brand.pageHeading.subtitle)
    ).toBeInTheDocument();
  });

  it('renders introduction and logo section copy', async () => {
    render(await BrandPage());

    const intro0 = brandMessages.brand.sectionContent.intro.text['0'];
    expect(
      screen.getByRole('heading', { name: 'Introduction' })
    ).toBeInTheDocument();
    expect(screen.getByText(intro0)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Logo' })).toBeInTheDocument();
  });

  it('renders Terms of Use link and brand email in usage terms', async () => {
    render(await BrandPage());

    expect(screen.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute(
      'href',
      '/terms'
    );

    const mailLinks = screen.getAllByRole('link', { name: 'brand@todd.com' });
    expect(mailLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of mailLinks) {
      expect(link).toHaveAttribute('href', 'mailto:brand@todd.com');
    }
  });

  it('renders how-to-use wordmark section when messages include a title', async () => {
    render(await BrandPage());

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: brandMessages.brand.howToUseWordmark.title,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', {
        name: brandMessages.brand.howToUseWordmark.title,
      })
    ).toBeInTheDocument();
  });
});
