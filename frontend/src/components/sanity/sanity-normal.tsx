// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PortableTextBlock, PortableTextComponentProps } from 'next-sanity';

interface SanityNormalProps extends PortableTextComponentProps<PortableTextBlock> {
  summary?: string;
}

/**
 * Renders a standard "normal" text block for PortableText.
 *
 * @param {SanityNormalProps} props - Props provided by PortableText, including the block's children.
 * @returns {JSX.Element} - A paragraph wrapping the block's children.
 */
export default function SanityNormal(props: SanityNormalProps) {
  const { children, index, summary } = props;

  return (
    <>
      {summary && index === 0 && (
        <p className="text-lg md:text-xl leading-relaxed">{summary}</p>
      )}
      <p className="text-base sm:text-normal font-light leading-relaxed">
        {children}
      </p>
    </>
  );
}
