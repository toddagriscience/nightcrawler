// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SectionContent, { mapSectionTextParagraphs } from './section-content';

describe('mapSectionTextParagraphs', () => {
  it('returns empty array when text is undefined', () => {
    expect(mapSectionTextParagraphs(undefined)).toEqual([]);
  });

  it('uses count and numeric keys when count is valid', () => {
    expect(
      mapSectionTextParagraphs({
        count: '2',
        '0': 'First',
        '1': 'Second',
      })
    ).toEqual([
      { key: '0', body: 'First' },
      { key: '1', body: 'Second' },
    ]);
  });

  it('falls back to sorted entries when count is missing', () => {
    expect(
      mapSectionTextParagraphs({
        '1': 'B',
        '0': 'A',
      })
    ).toEqual([
      { key: '0', body: 'A' },
      { key: '1', body: 'B' },
    ]);
  });

  it('excludes count key from fallback entries', () => {
    expect(
      mapSectionTextParagraphs({
        count: 'not-a-number',
        '0': 'Only',
      })
    ).toEqual([{ key: '0', body: 'Only' }]);
  });
});

describe('SectionContent', () => {
  it('renders title, subtitle, and paragraphs from text with count', () => {
    render(
      <SectionContent
        title="Main title"
        subtitle="Sub title"
        text={{
          count: '2',
          '0': 'Paragraph one.',
          '1': 'Paragraph two.',
        }}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Main title' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Sub title' })
    ).toBeInTheDocument();
    expect(screen.getByText('Paragraph one.')).toBeInTheDocument();
    expect(screen.getByText('Paragraph two.')).toBeInTheDocument();
  });

  it('merges className on the root element', () => {
    const { container } = render(
      <SectionContent title="T" className="my-custom-section" text={{}} />
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass('my-custom-section');
    expect(root).toHaveClass('flex', 'flex-col');
  });

  it('applies subtitleClassName to the subtitle heading', () => {
    render(
      <SectionContent
        subtitle="Centered"
        subtitleClassName="text-center"
        text={{}}
      />
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass(
      'text-center'
    );
  });

  it('uses renderParagraph when provided', () => {
    render(
      <SectionContent
        text={{ count: '1', '0': 'Raw body' }}
        renderParagraph={(body, index) => (
          <span data-testid={`custom-${index}`}>{body.toUpperCase()}</span>
        )}
      />
    );
    expect(screen.getByTestId('custom-0')).toHaveTextContent('RAW BODY');
  });

  it('renders nothing for paragraphs when text is empty or yields no rows', () => {
    const { container } = render(<SectionContent title="Only title" />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });
});
