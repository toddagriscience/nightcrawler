// Copyright © Todd Agriscience, Inc. All rights reserved.

import NextLink from 'next/link';

/**
 * Legal subtext component. Renders legal subtext.
 *
 * @returns {JSX.Element} - The legal subtext component, containing the account agreement, privacy policy, and terms of service links.
 * */
export function LegalSubtext() {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <p className="text-xs font-thin">
        By continuing, you agree to the{' '}
        <NextLink
          href="/account-agreement.pdf"
          target="_blank"
          className="underline font-normal"
        >
          Todd Account Agreement
        </NextLink>{' '}
        and{' '}
        <NextLink href="/en/privacy" className="underline font-normal">
          Privacy Policy
        </NextLink>
        .
      </p>
      <p className="text-xs font-thin">
        <NextLink href="/terms" className="underline font-normal">
          Terms of Service
        </NextLink>{' '}
        apply.
      </p>
    </div>
  );
}
