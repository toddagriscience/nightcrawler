// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { FadeIn } from '@/components/common';
import { Disclaimer } from '@/components/common/disclaimer/disclaimer';

/** The careers page. Currently only provides information on the externship and allows applicants to submit their email..
 *
 * @returns {JSX.Element} - The careers page. */
export default function Careers() {
  const url =
    // eslint-disable-next-line no-secrets/no-secrets
    'https://docs.google.com/forms/d/e/1FAIpQLSfi8yeNdjHuJCrO1sPSUhh8uCICsA6KGevRM-Mk9iND-aYkBQ/viewform';

  return (
    <div>
      <FadeIn className="flex flex-col min-h-[90vh] justify-center items-center mx-auto mb-8">
        <a href={url}>
          <SubmitButton
            className="max-w-[400px] w-[90vw]"
            buttonText="EXTERNSHIP APPLICATION"
          />
        </a>
      </FadeIn>
      <Disclaimer translationLoc="careers.disclaimers" disclaimerCount={5} />
    </div>
  );
}
