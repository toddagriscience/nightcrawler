// Copyright © Todd Agriscience, Inc. All rights reserved.

interface SanityQuoteProps {
  quote?: string | null;
  className?: string;
}

/**
 * Renders a governance profile quote from Sanity.
 *
 * @param {SanityQuoteProps} props - Quote content and optional styling.
 * @returns {JSX.Element | null} - The formatted quote, or null when empty.
 */
export default function SanityQuote({ quote, className }: SanityQuoteProps) {
  const normalizedQuote = typeof quote === 'string' ? quote.trim() : '';

  if (!normalizedQuote) {
    return null;
  }

  const hasQuotes =
    normalizedQuote.startsWith('"') && normalizedQuote.endsWith('"');
  const displayQuote = hasQuotes ? normalizedQuote : `"${normalizedQuote}"`;

  return (
    <blockquote
      className={`text-xl md:text-2xl lg:text-3xl leading-tight text-center font-light italic ${className ?? ''}`.trim()}
    >
      {displayQuote}
    </blockquote>
  );
}
