// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';

/** Small helper for the TODD logo.
 *
 * @param {string} className - Optional class names
 * @returns {JSX.Element} - The logo, with a link to the homepage*/
export default function ToddHeader({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`wordmark uppercase text-4xl leading-none ${className}`}
      data-testid="wordmark-link"
    >
      TODD
    </Link>
  );
}
