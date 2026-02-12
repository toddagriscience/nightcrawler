// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import Wordmark from '@public/wordmark.svg';
import Image from 'next/image';

/** Small helper for the TODD logo.
 *
 * @param {string} className - Optional class names
 * @returns {JSX.Element} - The logo, with a link to the homepage*/
export default function ToddHeader({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`wordmark leading-none ${className}`}
      data-testid="wordmark-link"
      aria-label="Todd Agriscience home page"
    >
      <Image
        src={Wordmark}
        alt=""
        className="object-contain"
        width={76}
        height={40}
      />
    </Link>
  );
}
