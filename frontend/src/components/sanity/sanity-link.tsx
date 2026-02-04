// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { TypedObject } from '@portabletext/types';
import type { PortableTextMarkComponentProps } from 'next-sanity';

interface SanityLinkValue extends TypedObject {
  href?: string;
}

/**
 * SanityLink component for displaying a link in PortableText.
 * @param props - The props for the SanityLink component
 * @returns {JSX.Element} - The SanityLink component
 */
export default function SanityLink({
  children,
  value,
}: PortableTextMarkComponentProps<SanityLinkValue>) {
  const href = value?.href ?? '';

  return (
    <a
      href={href}
      className="hover:text-[#2A2727]/80 underline hover:no-underline underline-offset-2 font-normal cursor-pointer"
    >
      {children}
    </a>
  );
}
