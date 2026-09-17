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
      'w-full',
      'flex-col',
      'justify-center',
      'items-center',
      'md:max-w-[910px]'
    );
  });

  it('reduces the top offset when a caption is present so titles stay aligned', () => {
    const { container: withCaption } = render(
      <PageHeader caption="Company" title="About" />
    );
    expect(withCaption.firstElementChild).toHaveClass('pt-14', 'md:pt-24');

    const { container: withoutCaption } = render(<PageHeader title="About" />);
    expect(withoutCaption.firstElementChild).toHaveClass('pt-25', 'md:pt-35');
  });

  it('uses the inner-page width when narrow', () => {
    const { container } = render(
      <PageHeader narrow subtitle="Sub" title="Main" />
    );
    expect(container.firstElementChild).toHaveClass('md:max-w-[610px]');
    expect(container.firstElementChild).not.toHaveClass('md:max-w-[910px]');
  });

  it('renders the subtitle as a paragraph, not a heading', () => {
    render(<PageHeader subtitle="Small line" title="Big line" />);

    const subtitle = screen.getByText('Small line');
    // A tagline is not a section heading. Rendering it as <h3> directly under
    // the <h1> skipped a level, and any page that then opened a section with
    // <h2> produced h1 -> h3 -> h2 — an outline that goes backwards.
    expect(subtitle.tagName).toBe('P');
    expect(subtitle).toHaveClass('max-w-[37rem]');
    expect(subtitle.className).toContain('clamp(');

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveClass(
      'w-[85%]',
      'sm:w-full',
      'max-w-none',
      'md:max-w-[910px]'
    );
    expect(title.className).toContain('clamp(');
  });

  it('applies title and subtitle class overrides', () => {
    render(
      <PageHeader
        title="Job title"
        subtitle="Team — Remote"
        titleClassName="text-[48px]"
        subtitleClassName="max-w-none text-[16px]"
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'text-[48px]'
    );
    expect(screen.getByText('Team — Remote')).toHaveClass(
      'max-w-none',
      'text-[16px]'
    );
  });

  it('allows a wider root max-width override', () => {
    const { container } = render(
      <PageHeader className="max-w-[1110px]" title="Wide title" />
    );

    expect(container.firstElementChild).toHaveClass('max-w-[1110px]');
  });

  it('opens outbound button hrefs in a new tab', () => {
    render(
      <PageHeader
        title="Role"
        button={{ href: 'https://jobs.example/apply', text: 'Apply now' }}
      />
    );

    const link = screen.getByRole('link', { name: 'Apply now' });
    expect(link).toHaveAttribute('href', 'https://jobs.example/apply');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('w-fit', 'px-[20px]');
    expect(link).not.toHaveClass('w-[168px]');
  });
});
