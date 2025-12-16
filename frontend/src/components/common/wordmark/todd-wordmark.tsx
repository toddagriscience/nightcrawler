// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';

/** Small helper for the TODD logo.
 *
 * @returns {JSX.Element} - The logo, with a link to the homepage*/
export default function ToddHeader() {
  return (
    <Link
      href="/"
      className="wordmark uppercase text-4xl leading-none"
      data-testid="wordmark-link"
    >
      TODD
    </Link>
  );
}
