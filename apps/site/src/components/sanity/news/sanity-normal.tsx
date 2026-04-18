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
        <p className="text-[17px] font-normal leading-[28px] tracking-normal">
          {summary}
        </p>
      )}
      <p className="text-[17px] font-normal leading-[28px] tracking-normal">
        {children}
      </p>
    </>
  );
}
