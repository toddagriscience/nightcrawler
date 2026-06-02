// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn } from '@/components/common';
import { LegalSubtext } from '@/components/common/legal-subtext/legal-subtext';
import MarketingGradientBox from '@/components/common/marketing-gradient-box/marketing-gradient-box';

/** Props for approved-applicant signup gate screens. */
interface ApprovedApplicantGateProps {
  /** Applicant email from the signup link */
  email: string;
  /** Gate reason shown to the applicant */
  reason: 'missing-session' | 'invalid-link' | 'email-mismatch';
  /** Email on the active session when it does not match the link */
  sessionEmail?: string;
}

/**
 * Explains why an approved applicant cannot continue on the password page yet.
 *
 * @param props - Gate reason and applicant email
 */
export default function ApprovedApplicantGate({
  email,
  reason,
  sessionEmail,
}: ApprovedApplicantGateProps) {
  const title =
    reason === 'invalid-link'
      ? 'This signup link is invalid or expired'
      : reason === 'email-mismatch'
        ? 'You are signed in with a different email'
        : 'Open your approval email to continue';

  const description =
    reason === 'invalid-link'
      ? 'Request a fresh invite from Todd, or use the latest approval email you received.'
      : reason === 'email-mismatch'
        ? `This signup link is for ${email}, but you are signed in as ${sessionEmail}. Sign out and open the approval link from the correct inbox.`
        : `Use the magic link we sent to ${email}. That link signs you in before you create your password.`;

  return (
    <main>
      <div className="max-w-[1400px] mx-auto px-15 lg:px-16 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mx-auto mt-25 md:mt-15 w-full max-w-[1200px] mx-auto">
          <MarketingGradientBox />
          <div className="flex w-full max-w-[530px] lg:max-w-none flex-col md:mr-0 lg:mr-10">
            <FadeIn>
              <div className="mx-auto flex flex-col justify-start w-full max-w-[280px] sm:max-w-[450px] md:max-w-[500px] md:mt-10 gap-6">
                <h1 className="text-2xl text-left font-normal">{title}</h1>
                <p className="text-sm font-normal text-left">{description}</p>
                <LegalSubtext />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
