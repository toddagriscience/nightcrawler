// Copyright © Todd Agriscience, Inc. All rights reserved.

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
}: {
  title?: string;
  subtitle?: string;
  text?: Record<string, string>;
  className?: string;
}) {
  const paragraphs = mapSectionTextParagraphs(text);

  return (
    <div className={`flex flex-col gap-4 text-left max-w-[800px] ${className}`}>
      {title ? (
        <h2 className="text-3xl md:text-3xl lg:text-5xl/[80px] text-foreground">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <h3 className="text-xl md:text-xl lg:text-3xl/[56px]">{subtitle}</h3>
      ) : null}
      {paragraphs.length > 0 ? (
        <div className="text-sm lg:text-[17px]/[28px] font-thin space-y-4.75">
          {paragraphs.map(({ key, body }) => (
            <p key={key}>{body}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
