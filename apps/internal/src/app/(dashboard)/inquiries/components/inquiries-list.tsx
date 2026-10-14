// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { ClientInquiry, HandleInquiryResult } from '../types';

interface InquiriesListProps {
  inquiries: ClientInquiry[];
  /** Authorized server action, or an isolated test replacement. */
  handleAction: (id: number) => Promise<HandleInquiryResult>;
}

/** Internal client-message inbox with reviewer actions and safe escaped text. */
export function InquiriesList({ inquiries, handleAction }: InquiriesListProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [handledIds, setHandledIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInquiry = async (id: number) => {
    setError(null);
    setPendingId(id);
    try {
      const result = await handleAction(id);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setHandledIds((current) => [...current, id]);
      router.refresh();
    } catch {
      setError(
        'The request could not be updated. Please refresh the inbox and try again.'
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" onClick={() => router.refresh()}>
        Refresh inbox
      </Button>
      {inquiries.length === 0 ? (
        <p className="text-muted-foreground">No client inquiries yet.</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      ) : null}
      {inquiries.map((inquiry) => {
        const handled =
          inquiry.reviewedAt !== null || handledIds.includes(inquiry.id);
        return (
          <article
            key={inquiry.id}
            aria-labelledby={`inquiry-${inquiry.id}`}
            className="rounded-lg border p-5 space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2
                  id={`inquiry-${inquiry.id}`}
                  className="text-lg font-semibold"
                >
                  {inquiry.subject}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Request {inquiry.id} · {inquiry.farmName}
                  {inquiry.farmId ? ` (farm ${inquiry.farmId})` : ''}
                </p>
              </div>
              <span className="text-sm" role="status">
                {handled ? 'Handled' : 'New'}
              </span>
            </div>
            <p className="text-sm">
              {inquiry.senderName}
              {inquiry.senderEmail ? ` · ${inquiry.senderEmail}` : ''}
            </p>
            <time
              className="block text-sm text-muted-foreground"
              dateTime={inquiry.createdAt.toISOString()}
            >
              {inquiry.createdAt.toISOString().slice(0, 16).replace('T', ' ')}{' '}
              UTC
            </time>
            <p className="whitespace-pre-wrap break-words">{inquiry.message}</p>
            {!handled ? (
              <Button
                type="button"
                size="sm"
                disabled={pendingId !== null}
                onClick={() => handleInquiry(inquiry.id)}
                aria-label={`Mark request ${inquiry.id} handled`}
              >
                {pendingId === inquiry.id ? 'Updating…' : 'Mark handled'}
              </Button>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
