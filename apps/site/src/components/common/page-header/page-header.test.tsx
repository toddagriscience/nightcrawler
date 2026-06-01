// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PageHeader from './page-header';

describe('PageHeader', () => {
  it('renders subtitle and title', () => {
    render(<PageHeader subtitle="Company" title="Brand Guideline" />);

    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Brand Guideline' })
    ).toBeInTheDocument();
  });

  it('wraps content in a layout container with expected utility classes', () => {
    const { container } = render(<PageHeader subtitle="Sub" title="Main" />);
    const root = container.firstElementChild;
    expect(root).toHaveClass(
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'max-w-[910px]'
    );
  });

  it('applies typography classes to subtitle and title', () => {
    render(<PageHeader subtitle="Small line" title="Big line" />);

    const subtitle = screen.getByText('Small line');
    expect(subtitle.tagName).toBe('H3');
    expect(subtitle).toHaveClass(
      'text-base',
      'md:text[17px]/[28px]',
      'w-[80%]',
      'sm:w-full'
    );

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveClass('text-[33px]', 'md:text-5xl', 'lg:text-[64px]');
  });
});
