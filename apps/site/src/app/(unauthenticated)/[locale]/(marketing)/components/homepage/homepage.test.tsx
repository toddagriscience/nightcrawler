// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Homepage from './homepage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/i18n/config', () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/common/page-header/page-header', () => ({
  default: ({
    title,
    subtitle,
    button,
  }: {
    title: string;
    subtitle?: string;
    button?: {
      href: string;
      text: string;
      buttonClassName?: string;
    };
  }) => (
    <div
      data-testid="page-header"
      data-title={title}
      data-subtitle={subtitle}
      data-button-href={button?.href}
      data-button-text={button?.text}
      data-button-class-name={button?.buttonClassName}
    />
  ),
}));

vi.mock('@/components/common/header-img/header-img', () => ({
  default: ({
    src,
    alt,
    wrapperClassName,
  }: {
    src: string;
    alt: string;
    wrapperClassName?: string;
  }) => (
    <div
      data-testid="header-img"
      data-src={src}
      data-alt={alt}
      data-wrapper-class-name={wrapperClassName}
    />
  ),
}));

vi.mock('@/components/common/section-content/section-content', () => ({
  default: ({
    caption,
    title,
    className,
  }: {
    caption?: string;
    title: string;
    className?: string;
  }) => (
    <div
      data-testid="section-content"
      data-caption={caption}
      data-title={title}
      data-class-name={className}
    />
  ),
}));

describe('Homepage', () => {
  it('renders expected content and links the research CTAs', () => {
    const { container } = render(<Homepage />);

    const root = container.querySelector('section');
    expect(root).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'space-y-15',
      'w-[90%]',
      'sm:w-[80%]',
      'mx-auto'
    );

    const header = screen.getByTestId('page-header');
    expect(header).toHaveAttribute('data-title', 'pageHeading.title');
    expect(header).toHaveAttribute('data-subtitle', 'pageHeading.subtitle');
    expect(header).toHaveAttribute('data-button-href', '/research');
    expect(header).toHaveAttribute('data-button-text', 'pageHeading.button');
    expect(header).toHaveAttribute('data-button-class-name', 'w-[174px]');

    const image = screen.getByTestId('header-img');
    expect(image).toHaveAttribute('data-src', '/marketing/garden-bed.svg');
    expect(image).toHaveAttribute('data-alt', 'pageHeading.title');
    expect(image).toHaveAttribute(
      'data-wrapper-class-name',
      'w-full h-[500px] lg:h-[630px] translate-y-[-59px] md:my-20'
    );

    const sectionContent = screen.getByTestId('section-content');
    expect(sectionContent).toHaveAttribute(
      'data-caption',
      'sectionContent.section1.caption'
    );
    expect(sectionContent).toHaveAttribute(
      'data-title',
      'sectionContent.section1.title'
    );

    const exploreResearchLink = screen.getByRole('link', {
      name: 'sectionContent.explore.button',
    });
    expect(exploreResearchLink).toHaveAttribute('href', '/research/index');
  });
});
