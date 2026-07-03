// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { convertToMarkdownTable, parseImpSheet } from './content-parser';

describe('convertToMarkdownTable', () => {
  it('renders a header row, separator, and data rows', () => {
    const headers = ['Name', 'Value'];
    const rows = [
      { Name: 'Calcium', Value: '2000' },
      { Name: 'Magnesium', Value: '4000' },
    ];

    expect(convertToMarkdownTable(rows, headers)).toBe(
      [
        '| Name | Value |',
        '| --- | --- |',
        '| Calcium | 2000 |',
        '| Magnesium | 4000 |',
      ].join('\n')
    );
  });

  it('escapes pipe characters in cell content', () => {
    const table = convertToMarkdownTable([{ Note: 'a | b' }], ['Note']);
    expect(table).toContain('| a \\| b |');
  });

  it('coerces missing/nullish cells to empty strings', () => {
    const table = convertToMarkdownTable(
      [{ A: 'x' } as Record<string, unknown>],
      ['A', 'B']
    );
    // The absent "B" column renders as an empty cell rather than "undefined".
    expect(table.split('\n').at(-1)).toBe('| x |  |');
  });
});

describe('parseImpSheet', () => {
  const headers = ['Category', 'Trigger', 'Body'];

  it('produces one markdown doc per row with a title from the trigger', () => {
    const docs = parseImpSheet(
      [{ Category: 'soil', Trigger: 'Low pH', Body: 'Apply lime.' }],
      headers
    );

    expect(docs).toHaveLength(1);
    expect(docs[0]).toContain('# Low pH');
    expect(docs[0]).toContain('**Categories:** soil');
    expect(docs[0]).toContain('**Trigger:** Low pH');
    expect(docs[0]).toContain('Apply lime.');
  });

  it('skips rows with an empty body', () => {
    const docs = parseImpSheet(
      [
        { Category: 'soil', Trigger: 'Low pH', Body: '' },
        { Category: 'water', Trigger: 'Salinity', Body: 'Flush the field.' },
      ],
      headers
    );

    expect(docs).toHaveLength(1);
    expect(docs[0]).toContain('# Salinity');
  });

  it('falls back to "Untitled" when trigger and category are both blank', () => {
    const docs = parseImpSheet(
      [{ Category: '', Trigger: '', Body: 'Orphan recommendation.' }],
      headers
    );

    expect(docs[0]).toContain('# Untitled');
  });
});
