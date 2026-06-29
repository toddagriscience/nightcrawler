// Copyright © Todd Agriscience, Inc. All rights reserved.

import { isOutboundHref, toSafeHref } from '@/lib/sanity/safe-href';
import type { TypedObject } from '@portabletext/types';
import type { PortableTextMarkComponentProps } from 'next-sanity';

interface SanityLinkValue extends TypedObject {
  href?: string;
}

/**
 * SanityLink component for displaying a link in PortableText.
 *
 * CMS-authored hrefs are sanitized with {@link toSafeHref} so dangerous schemes
 * (`javascript:`, `data:`, …) never reach the anchor; unsafe values render as
 * plain text.
 *
 * @param props - The props for the SanityLink component
 * @returns {JSX.Element} - The SanityLink component
 */
export default function SanityLink({
  children,
  value,
}: PortableTextMarkComponentProps<SanityLinkValue>) {
  const safeHref = toSafeHref(value?.href);

  if (safeHref === null) {
    return <>{children}</>;
  }

  const outbound = isOutboundHref(safeHref);

  return (
    <a
      href={safeHref}
      rel={outbound ? 'noopener noreferrer' : undefined}
      target={outbound ? '_blank' : undefined}
      className="hover:text-[#2A2727]/80 underline hover:no-underline underline-offset-2 font-normal cursor-pointer"
    >
      {children}
    </a>
  );
}
