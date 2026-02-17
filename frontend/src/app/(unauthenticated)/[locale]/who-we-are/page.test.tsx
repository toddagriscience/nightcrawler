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

describe('WhoWeArePage', () => {
  it('renders exactly one h1 element with the correct title for accessibility', () => {
    renderWithNextIntl(<WhoWeArePage />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });

    expect(h1Elements).toHaveLength(1);

    expect(h1Elements[0]).toHaveTextContent('Who We Are');
  });

  it('renders the hero content', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(
      screen.getByRole('heading', { name: 'Who We Are' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Todd is building hyper-intelligent mentors/i)
    ).toBeInTheDocument();
  });

  it('renders culture section', () => {
    renderWithNextIntl(<WhoWeArePage />);

    expect(
      screen.getByRole('heading', { name: 'Empowered by Our Culture' })
    ).toBeInTheDocument();

    expect(screen.getByText(/distinctive culture/i)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Careers' })).toBeInTheDocument();
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
