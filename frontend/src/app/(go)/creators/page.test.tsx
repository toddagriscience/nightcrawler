// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import CreatorsPage from './page';

describe('CreatorsPage', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('has an Apply link', () => {
    renderWithNextIntl(<CreatorsPage />);
    const applyLink = screen.getByRole('link', { name: /apply/i });
    expect(applyLink).toBeInTheDocument();
  });
});
