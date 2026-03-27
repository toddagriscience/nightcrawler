// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import Quote from './quote';

describe('Quote', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Quote isDark={false} />);
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'who-we-are');
  });

  it('displays the about heading content', () => {
    renderWithNextIntl(<Quote isDark={false} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/sustainable agriculture/i);
  });

  it('renders the Learn More link with correct href', () => {
    renderWithNextIntl(<Quote isDark={false} />);
    const aboutLink = screen.getByTestId('button-component');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/who-we-are');
    expect(aboutLink).toHaveTextContent('Who We Are');
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Quote />);
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // TODO: Add Spanish translation tests when Jest/NextIntl integration is improved
});
