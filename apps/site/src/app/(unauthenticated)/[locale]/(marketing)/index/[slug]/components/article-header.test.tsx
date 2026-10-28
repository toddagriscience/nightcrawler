// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TooltipProvider } from '@/components/ui/tooltip';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { ArticleHeader } from './article-header';

describe('ArticleHeader', () => {
  it('renders a back link to its article listing', () => {
    renderWithNextIntl(
      <TooltipProvider>
        <ArticleHeader
          title="Article title"
          backHref="/news"
          backLabel="Back to News"
        />
      </TooltipProvider>
    );

    expect(screen.getByRole('link', { name: 'Back to News' })).toHaveAttribute(
      'href',
      '/news'
    );
  });
});
