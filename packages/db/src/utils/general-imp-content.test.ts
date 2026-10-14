// Copyright © Todd Agriscience, Inc. All rights reserved.

import { expect, it } from 'vitest';
import { generalImpEmbeddingText } from './general-imp-content';

it('preserves the importer fingerprint format for catalog saves and reimports', () => {
  expect(
    generalImpEmbeddingText({
      title: 'Zinc',
      tags: ['soil', 'corn'],
      content: 'Advice',
    })
  ).toBe('Zinc\nsoil corn\nAdvice');
  expect(
    generalImpEmbeddingText({ title: null, tags: [], content: 'Concept' })
  ).toBe('Concept');
});
