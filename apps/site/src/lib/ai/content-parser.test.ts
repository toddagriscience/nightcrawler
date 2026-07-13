// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  convertToMarkdownTable,
  excelCellToString,
  parseImpSheet,
} from './content-parser';

describe('excelCellToString', () => {
  it('passes primitives through', () => {
    expect(excelCellToString('hello')).toBe('hello');
    expect(excelCellToString(42)).toBe('42');
    expect(excelCellToString(0)).toBe('0');
    expect(excelCellToString(true)).toBe('true');
  });

  it('treats null, undefined, and unknown shapes as empty', () => {
    expect(excelCellToString(null)).toBe('');
    expect(excelCellToString(undefined)).toBe('');
    expect(excelCellToString({})).toBe('');
  });

  it('keeps the computed result of a formula cell instead of dropping it', () => {
    expect(excelCellToString({ formula: 'A1+B1', result: 42 })).toBe('42');
    expect(excelCellToString({ sharedFormula: 'A1', result: 3.5 })).toBe('3.5');
  });

  it('flattens rich text into its concatenated runs', () => {
    expect(
      excelCellToString({ richText: [{ text: 'Low' }, { text: ' Ca' }] })
    ).toBe('Low Ca');
  });

  it('unwraps hyperlink and error cells to their text', () => {
    expect(
      excelCellToString({ text: 'lab report', hyperlink: 'https://x.test' })
    ).toBe('lab report');
    expect(excelCellToString({ error: '#DIV/0!' })).toBe('#DIV/0!');
  });

  it('renders dates as ISO calendar dates', () => {
    expect(excelCellToString(new Date('2026-07-11T12:00:00Z'))).toBe(
      '2026-07-11'
    );
  });
});

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
