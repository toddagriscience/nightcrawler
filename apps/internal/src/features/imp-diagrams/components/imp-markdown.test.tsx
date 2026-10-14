// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ImpMarkdown } from './imp-markdown';

it('keeps private diagram previews responsive and leaves raw HTML inert', () => {
  const { container } = render(
    <ImpMarkdown>
      {'![Scale](/api/imp-diagrams/image.png)\n\n<script>alert(1)</script>'}
    </ImpMarkdown>
  );
  expect(screen.getByRole('img', { name: 'Scale' })).toHaveClass('max-w-full');
  expect(container.querySelector('script')).toBeNull();
});
