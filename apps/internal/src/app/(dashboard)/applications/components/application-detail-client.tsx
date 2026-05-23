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
} from '../actions';

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
}

/**
 * Formats one stored answer value for display.
 *
 * @param value - Raw answer value
 */
function formatAnswerValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value ?? '');
}

/**
 * Detail page UI for reviewing one platform access application.
 *
 * @param props - Application row and optional signup URL
 */
export default function ApplicationDetailClient({
  application: initialApplication,
  signupUrl: initialSignupUrl,
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

  const handleApprove = async () => {
    setLoading(true);
    try {
      const result = await approvePlatformAccessApplication(application.id);
      if (!result.application) {
        toast.error('Failed to approve application.');
        return;
      }

      setApplication(result.application);
      setSignupUrl(result.signupUrl);
      setConfirmAction(null);
      toast.success('Application approved.');
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
            <p className="text-sm text-muted-foreground">
              {application.formSlug}
              {application.sourceArticleSlug
                ? ` · referred from ${application.sourceArticleSlug}`
                : ''}
            </p>
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
      </div>

      <div className="space-y-3 rounded-md border p-4">
        <h2 className="text-sm font-medium">Answers</h2>
        {Object.keys(answers).length === 0 ? (
          <p className="text-sm text-muted-foreground">No answers stored.</p>
        ) : (
          Object.entries(answers).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">{key}</div>
              <div className="col-span-2 break-words">
                {formatAnswerValue(value)}
              </div>
            </div>
          ))
        )}
      </div>

      {signupUrl ? (
        <div className="rounded-md border p-4 text-sm break-all">
          <p className="font-medium mb-2">Signup link</p>
          <p>{signupUrl}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void copySignupUrl()}
          >
            Copy link
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
                ? 'This marks the application approved and generates a pre-filled signup link you can send to the applicant.'
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
