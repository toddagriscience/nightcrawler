// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import LegalPage from './page';

describe('LegalPage', () => {
  it('renders the page', () => {
    renderWithNextIntl(<LegalPage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Legal');
    expect(heading).toHaveTextContent('Library');

    expect(screen.getByText('Todd Privacy Policy')).toBeInTheDocument();

    expect(screen.getByText('Todd Terms of Use')).toBeInTheDocument();
  });

  it('renders all legal document titles', () => {
    renderWithNextIntl(<LegalPage />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(8);
  });

  it('has correct margins', () => {
    const { container } = renderWithNextIntl(<LegalPage />);

    expect(container.querySelector('.pt-\[146px\]')).toBeInTheDocument();
  });
});
