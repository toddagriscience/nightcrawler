// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import { LegalSubtext } from '@/components/common/legal-subtext/legal-subtext';
import MarketingGradientBox from '@/components/common/marketing-gradient-box/marketing-gradient-box';
import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useState } from 'react';
import { resendApprovedApplicantActivationEmail } from '../actions';

/** Props for approved-applicant signup gate screens. */
interface ApprovedApplicantGateProps {
  /** Applicant email from the signup link */
  email: string;
  /** Gate reason shown to the applicant */
  reason: 'invalid-link' | 'email-mismatch';
  /** Email on the active session when it does not match the link */
  sessionEmail?: string;
  /** Platform access application id when resend is available */
  applicationId?: number;
  /** Signup token when resend is available */
  token?: string;
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
  applicationId,
  token,
}: ApprovedApplicantGateProps) {
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const title =
    reason === 'invalid-link'
      ? 'This signup link is invalid or expired'
      : 'You are signed in with a different email';

  const description =
    reason === 'invalid-link'
      ? 'Request a fresh onboarding link from Todd, or resend the email below if your link should still be valid.'
      : `This signup link is for ${email}, but you are signed in as ${sessionEmail}. Sign out and open the onboarding link from the correct inbox.`;

  const canResend =
    Boolean(applicationId && token) && reason === 'invalid-link';

  async function handleResend() {
    if (!applicationId || !token) {
      return;
    }

    setIsResending(true);
    setResendMessage(null);
    setResendError(null);

    try {
      await resendApprovedApplicantActivationEmail({
        applicationId,
        token,
        email,
      });
      setResendMessage(`We sent a new onboarding email to ${email}.`);
    } catch (error) {
      setResendError(
        formatActionResponseErrors(error)[0] ??
          'Failed to send onboarding email. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  }

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
                {canResend ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="brand"
                      className="w-full"
                      disabled={isResending}
                      onClick={() => void handleResend()}
                    >
                      {isResending ? (
                        <Spinner className="mx-auto h-5 w-5" />
                      ) : (
                        'Resend onboarding email'
                      )}
                    </Button>
                    {resendMessage ? (
                      <p className="text-sm text-left">{resendMessage}</p>
                    ) : null}
                    {resendError ? (
                      <p className="text-destructive text-sm text-left">
                        {resendError}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <LegalSubtext />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
