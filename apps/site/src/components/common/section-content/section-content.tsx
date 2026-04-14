// Copyright © Todd Agriscience, Inc. All rights reserved.

import type React from 'react';

/**
 * Builds paragraph rows from a `text` map: prefers `count` plus `"0"`, `"1"`, …
 * If `count` is missing or invalid, falls back to sorted entries (excluding `count`).
 * @param text - Map including optional string `count` and paragraph bodies at numeric keys
 * @returns Ordered `{ key, body }` for each paragraph
 */
export function mapSectionTextParagraphs(
  text: Record<string, string> | undefined
): { key: string; body: string }[] {
  if (!text) {
    return [];
  }
  const countParsed = Number(text.count);
  if (Number.isFinite(countParsed) && countParsed > 0) {
    return Array.from({ length: countParsed }, (_, index) => {
      const key = String(index);
      return { key, body: text[key] ?? '' };
    });
  }
  return Object.entries(text)
    .filter(([k]) => k !== 'count')
    .sort(([a], [b]) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        return na - nb;
      }
      return a.localeCompare(b, undefined, { numeric: true });
    })
    .map(([key, body]) => ({ key, body }));
}

/**
 * SectionContent for title, optional subtitle, paragraph map (`text`) with optional `count`, and optional `subtext`.
 * @param title - Section heading
 * @param subtitle - Optional subheading
 * @param text - Paragraph map: `count` (string number) plus `"0"`, `"1"`, … per what-we-do pattern
 * @param subtext - Optional line after paragraphs (e.g. logo clear space)
 * @returns {JSX.Element} - The section content component
 */
export default function SectionContent({
  title,
  subtitle,
  text,
  className,
  subtitleClassName,
  renderParagraph,
}: {
  title?: string;
  subtitle?: string;
  text?: Record<string, string>;
  className?: string;
  /** Extra classes applied to the subtitle `<h3>`. */
  subtitleClassName?: string;
  /** Override default plain-text rendering per paragraph. Receives the body string and its 0-based index. */
  renderParagraph?: (body: string, index: number) => React.ReactNode;
}) {
  const paragraphs = mapSectionTextParagraphs(text);

  return (
    <div
      className={`flex flex-col gap-4 text-left mx-10 md:max-w-[800px] ${className}`}
    >
      {title ? (
        <h2 className="text-[24px] md:text-3xl lg:text-5xl/[80px] text-foreground">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <h3
          className={`text-[17px] md:text-xl lg:text-3xl/[56px] ${subtitleClassName ?? ''}`}
        >
          {subtitle}
        </h3>
      ) : null}
      {paragraphs.length > 0 ? (
        <div className="text-[17px] lg:text-[17px]/[28px] font-thin space-y-4.75">
          {paragraphs.map(({ key, body }, index) => (
            <p key={key}>
              {renderParagraph ? renderParagraph(body, index) : body}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
