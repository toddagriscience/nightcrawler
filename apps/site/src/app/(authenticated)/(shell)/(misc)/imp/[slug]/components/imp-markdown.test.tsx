// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ImpMarkdown } from './imp-markdown';
it('renders accessible responsive diagram references while leaving raw HTML inert', () => {
  const { container } = render(
    <ImpMarkdown
      content={
        '![Low to ideal range](/api/imp-diagrams/12345678-1234-4123-8123-123456789abc.png)\n\n<script>alert(1)</script>'
      }
    />
  );
  const image = screen.getByRole('img', { name: 'Low to ideal range' });
  expect(image).toHaveAttribute(
    'src',
    '/api/imp-diagrams/12345678-1234-4123-8123-123456789abc.png'
  );
  expect(image).toHaveClass('max-w-full');
  expect(image).toHaveAttribute('loading', 'lazy');
  expect(container.querySelector('script')).toBeNull();
});
