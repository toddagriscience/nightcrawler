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
      className={`wordmark leading-none relative w-20 h-20 ${className}`}
      data-testid="wordmark-link"
    >
      <Image src={Wordmark} alt="" fill />
    </Link>
  );
}
