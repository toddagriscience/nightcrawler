// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PortableTextBlock, PortableTextComponentProps } from 'next-sanity';

interface SanityBodyTextProps extends PortableTextComponentProps<PortableTextBlock> {
  className?: string;
}

/**
 * Renders a standard "normal" text block for governance profile content.
 *
 * @param {SanityBodyTextProps} props - Props provided by PortableText, including the block's children.
 * @returns {JSX.Element | null} - A paragraph wrapping the block's children.
 */
export default function SanityBodyText({
  children,
  className,
}: SanityBodyTextProps) {
  if (!children) {
    return null;
  }

  return (
    <p
      className={`text-sm md:text-normal lg:text-base font-light leading-relaxed text-justify ${className ?? ''}`.trim()}
    >
      {children}
    </p>
  );
}
