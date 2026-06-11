// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  approvePlatformAccessApplication,
  getPlatformAccessApplicationById,
  rejectPlatformAccessApplication,
  resendPlatformAccessApplicationInvite,
} from '../actions';
import ApplicationAnswersPanel from './application-answers-panel';
import { FormSlugBadge } from './form-slug-badge';
import FarmAdvisorProfileNotes from './farm-advisor-profile-notes';

/** One platform access application row. */
export type ApplicationRow = NonNullable<
  Awaited<ReturnType<typeof getPlatformAccessApplicationById>>
>;

/** Pending confirmation action for approve/reject. */
type ConfirmAction = 'approve' | 'reject';

/** Props for {@link ApplicationDetailClient}. */
export interface ApplicationDetailClientProps {
  /** Application loaded on the server */
  application: ApplicationRow;
  /** Pre-built signup URL when already approved */
  signupUrl: string | null;
  /** Advisor notes when the application is linked to a farm */
  farmAdvisorProfileNotes: string | null;
}

/**
 * Detail page UI for reviewing one platform access application.
 *
 * @param props - Application row and optional signup URL
 */
export default function ApplicationDetailClient({
  application: initialApplication,
  signupUrl: initialSignupUrl,
  farmAdvisorProfileNotes,
}: ApplicationDetailClientProps) {
  const router = useRouter();
  const [application, setApplication] =
    useState<ApplicationRow>(initialApplication);
  const [signupUrl, setSignupUrl] = useState<string | null>(initialSignupUrl);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const answers = (application.answers ?? {}) as Record<string, unknown>;

  const showInviteEmailResult = (
    result: Awaited<ReturnType<typeof resendPlatformAccessApplicationInvite>>,
    successLabel: string
  ) => {
    if (!result.application) {
      toast.error(result.emailError ?? 'Failed to send invite email.');
      return;
    }

    setApplication(result.application);
    setSignupUrl(result.signupUrl);

    if (result.emailSent) {
      toast.success(`${successLabel} Magic link email sent.`);
      return;
    }

    toast.error(
      result.emailError
        ? `Could not send email: ${result.emailError}`
        : 'Could not send email. Copy the signup link below instead.'
    );
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const result = await approvePlatformAccessApplication(application.id);
      if (!result.application) {
        toast.error('Failed to approve application.');
        return;
      }

      setConfirmAction(null);
      showInviteEmailResult(result, 'Application approved.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async () => {
    setLoading(true);
    try {
      const result = await resendPlatformAccessApplicationInvite(
        application.id
      );
      showInviteEmailResult(result, 'Invite resent.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const result = await rejectPlatformAccessApplication(application.id);
      if (!result) {
        toast.error('Failed to reject application.');
        return;
      }

      setConfirmAction(null);
      toast.success('Application rejected.');
      router.push('/applications');
    } finally {
      setLoading(false);
    }
  };

  const copySignupUrl = async () => {
    if (!signupUrl) return;
    await navigator.clipboard.writeText(signupUrl);
    toast.success('Signup link copied.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
          <Link href="/applications">← Back to applications</Link>
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Application #{application.id}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <FormSlugBadge slug={application.formSlug} />
              {application.sourceArticleSlug ? (
                <span>Referred from {application.sourceArticleSlug}</span>
              ) : null}
            </div>
          </div>
          <Badge variant="outline">{application.status}</Badge>
        </div>
      </div>

      <div className="grid gap-4 rounded-md border p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium">Retention consent</p>
          <p className="text-muted-foreground">
            {application.retentionConsent ? 'Yes' : 'No'}
          </p>
        </div>
        <div>
          <p className="font-medium">Submitted</p>
          <p className="text-muted-foreground">
            {application.createdAt
              ? new Date(application.createdAt).toLocaleString()
              : '—'}
          </p>
        </div>
        {application.reviewedAt ? (
          <div>
            <p className="font-medium">Reviewed</p>
            <p className="text-muted-foreground">
              {new Date(application.reviewedAt).toLocaleString()}
            </p>
          </div>
        ) : null}
        {application.status === 'approved' ? (
          <>
            <div>
              <p className="font-medium">Invite email</p>
              <p className="text-muted-foreground">
                {application.inviteSentAt
                  ? `Sent ${new Date(application.inviteSentAt).toLocaleString()}`
                  : 'Not sent yet'}
              </p>
            </div>
            <div>
              <p className="font-medium">Signup completed</p>
              <p className="text-muted-foreground">
                {application.signedUpAt
                  ? `Yes — ${new Date(application.signedUpAt).toLocaleString()}`
                  : 'Not yet'}
              </p>
            </div>
            {application.farmId ? (
              <div>
                <p className="font-medium">Farm ID</p>
                <p className="text-muted-foreground">{application.farmId}</p>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <ApplicationAnswersPanel
        formSlug={application.formSlug}
        answers={answers}
      />

      {application.farmId && farmAdvisorProfileNotes !== null ? (
        <FarmAdvisorProfileNotes
          farmId={application.farmId}
          initialNotes={farmAdvisorProfileNotes}
        />
      ) : null}

      {signupUrl ? (
        <div className="rounded-md border p-4 text-sm break-all">
          <p className="font-medium mb-2">Onboarding link (fallback)</p>
          <p className="text-muted-foreground mb-2">
            Same link as the approval email. Applicant sets a password at signup
            to finish account setup.
          </p>
          <p>{signupUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void copySignupUrl()}
            >
              Copy link
            </Button>
          </div>
        </div>
      ) : null}

      {application.status === 'approved' && !application.signedUpAt ? (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => void handleResendInvite()}
          >
            {loading ? 'Sending…' : 'Resend invite email'}
          </Button>
        </div>
      ) : null}

      {application.status === 'pending' ? (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => setConfirmAction('reject')}
          >
            Reject
          </Button>
          <Button
            type="button"
            variant="success"
            disabled={loading}
            onClick={() => setConfirmAction('approve')}
          >
            Approve
          </Button>
        </div>
      ) : null}

      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve'
                ? 'Approve application?'
                : 'Reject application?'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve'
                ? 'This marks the application approved and emails the applicant a magic link to begin signup. If email delivery fails, copy the signup link shown on this page.'
                : application.retentionConsent
                  ? 'This marks the application rejected. Their information will be kept on file because they consented to retention.'
                  : 'This marks the application rejected and deletes their submitted answers because they did not consent to retention.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={confirmAction === 'approve' ? 'success' : 'destructive'}
              disabled={loading}
              onClick={() =>
                void (confirmAction === 'approve'
                  ? handleApprove()
                  : handleReject())
              }
            >
              {confirmAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
