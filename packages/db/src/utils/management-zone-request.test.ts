// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  parseManagementZoneRequestInput,
  readManagementZoneRequestAnswers,
} from './management-zone-request';

const details = {
  name: 'North field',
  location: 'West of the barn',
  acreage: 12.5,
};

describe('management zone request input', () => {
  it('selects only parcel details, ignoring forged identity and workflow fields', () => {
    expect(
      parseManagementZoneRequestInput({
        ...details,
        name: ' North field ',
        farmId: 99,
        requestedByUserId: 99,
        zoneId: 99,
        stage: 'processed',
        approved: true,
      })
    ).toEqual(details);
  });
  it.each([
    null,
    {},
    { ...details, name: ' ' },
    { ...details, name: 'a'.repeat(201) },
    { ...details, location: '' },
    { ...details, location: 'a'.repeat(1001) },
    { ...details, acreage: NaN },
    { ...details, acreage: Infinity },
    { ...details, acreage: -1 },
    { ...details, acreage: 0 },
    { ...details, acreage: '12.5' },
  ])('rejects malformed details %#', (input) => {
    expect(() => parseManagementZoneRequestInput(input)).toThrow();
  });
  it('allows acreage to be omitted', () => {
    expect(
      parseManagementZoneRequestInput({
        name: details.name,
        location: details.location,
      }).acreage
    ).toBeNull();
  });
});

describe('management zone request metadata', () => {
  it('reads known metadata and ignores unrelated form answers', () => {
    expect(
      readManagementZoneRequestAnswers({
        ...details,
        zoneId: 7,
        requestedByUserId: 3,
        stage: 'requested',
        arbitrary: 'discard',
      })
    ).toEqual({
      ...details,
      zoneId: 7,
      requestedByUserId: 3,
      stage: 'requested',
    });
  });
  it.each([
    { zoneId: 0 },
    { zoneId: '7' },
    { requestedByUserId: null },
    { stage: 'approved' },
  ])('rejects invalid metadata %#', (invalid) => {
    expect(
      readManagementZoneRequestAnswers({
        ...details,
        zoneId: 7,
        requestedByUserId: 3,
        stage: 'requested',
        ...invalid,
      })
    ).toBeNull();
  });
});
