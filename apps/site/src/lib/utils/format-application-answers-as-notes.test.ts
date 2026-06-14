// Copyright © Todd Agriscience, Inc. All rights reserved.

import { formatApplicationAnswersAsAdvisorNotes } from '@nightcrawler/db/utils/format-application-answers-as-notes';
import { describe, expect, it } from 'vitest';

describe('formatApplicationAnswersAsAdvisorNotes', () => {
  it('formats answers as markdown list items', () => {
    const notes = formatApplicationAnswersAsAdvisorNotes({
      formSlug: 'iris-access',
      answers: {
        farm_name: 'Green Acres',
        organic: true,
      },
    });

    expect(notes).toContain('# Platform access request (iris-access)');
    expect(notes).toContain('**farm_name:** Green Acres');
    expect(notes).toContain('**organic:** Yes');
  });

  it('returns a placeholder when no answers are present', () => {
    const notes = formatApplicationAnswersAsAdvisorNotes({
      formSlug: 'iris-access',
      answers: {},
    });

    expect(notes).toContain('_No answers recorded._');
  });
});
