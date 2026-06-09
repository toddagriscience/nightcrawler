// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { mapFormSubmissionAnswersToFarmRecords } from './map-form-submission-answers-to-farm-records';

describe('mapFormSubmissionAnswersToFarmRecords', () => {
  it('returns null for non-hydration form slugs', () => {
    expect(
      mapFormSubmissionAnswersToFarmRecords({
        formSlug: 'newsletter',
        answers: { email: 'a@b.com' },
      })
    ).toBeNull();
  });

  it('maps structured iris-access answers into table buckets', () => {
    const mapped = mapFormSubmissionAnswersToFarmRecords({
      formSlug: 'iris-access',
      answers: {
        firstName: 'Ada',
        email: 'ada@farm.test',
        businessName: 'Ada Farms LLC',
        mainCrops: 'Tomatoes',
        splitOperation_organicAndConventional: true,
        diseaseManagementNotes: 'Copper spray early season',
      },
    });

    expect(mapped).not.toBeNull();
    expect(mapped?.farm.businessName).toBe('Ada Farms LLC');
    expect(mapped?.farmInfo.mainCrops).toBe('Tomatoes');
    expect(mapped?.farmInfo.splitOperation).toEqual({
      organicAndConventional: true,
    });
    expect(mapped?.advisorNotesMarkdown).toContain('Disease management');
    expect(mapped?.advisorNotesMarkdown).toContain('Copper spray early season');
  });
});
