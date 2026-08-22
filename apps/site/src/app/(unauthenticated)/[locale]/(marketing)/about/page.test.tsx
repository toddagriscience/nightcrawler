// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import WhoWeArePage from './page';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
  }) => (
    <img src={typeof src === 'string' ? src : src.src} alt={alt} {...props} />
  ),
}));

vi.mock('./components/competencies-section/competencies-section', () => ({
  default: () => <div data-testid="competencies-section">Competencies</div>,
}));

vi.mock(
  './components/responsibilities-section/responsibilities-section',
  () => ({
    default: () => (
      <div data-testid="responsibilities-section">Responsibilities</div>
    ),
  })
);

describe('WhoWeArePage', () => {
  it('renders exactly one h1 element with the correct title for accessibility', () => {
    renderWithNextIntl(<WhoWeArePage />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });

    expect(h1Elements).toHaveLength(1);

    expect(h1Elements[0]).toHaveTextContent('About');
  });

  it('renders the hero content', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();

    expect(screen.getByText('Company')).toBeInTheDocument();

    expect(
      screen.getAllByText(
        /We believe sustainable agriculture is the foundation/i
      )
    ).not.toHaveLength(0);
  });

  it('renders vision section with image and CTA', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(
      screen.getByRole('heading', {
        name: /Our vision for the future\s+of agriculture/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Our research/i })
    ).toBeInTheDocument();
  });

  it('renders the mission statement', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(
      screen.getByText(/We are creating generative farms/i)
    ).toBeInTheDocument();
  });

  it('renders partners section', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(
      screen.getByRole('heading', { name: 'Our Partners' })
    ).toBeInTheDocument();
  });

  it('renders navigation link to What We Do', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(
      screen.getByRole('link', { name: /What we do/i })
    ).toBeInTheDocument();
  });
});
