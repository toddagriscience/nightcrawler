// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ManagementZoneRequestRow } from '@nightcrawler/db/queries';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { updateZoneRequest } from '../actions';

/** Queue with staff-only shipment tracking and analysis-gated processing. */
export default function ZoneRequestsClient({
  requests,
}: {
  requests: ManagementZoneRequestRow[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function update(id: number, step: 'sample_kit_sent' | 'processed') {
    setPendingId(id);
    setError(null);
    try {
      const result = await updateZoneRequest(id, step);
      if (!result.success) setError(result.error);
      else router.refresh();
    } catch {
      setError('Unable to update the request. Please try again.');
    } finally {
      setPendingId(null);
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Management zone requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Arrange sample kits and track processing. A zone stays under review
          until its soil analysis is entered.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Zone</TableHead>
            <TableHead>Farm / requester</TableHead>
            <TableHead>Parcel</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Next step</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                No management zone requests yet.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {request.answers.name}
                  <div className="text-xs text-muted-foreground">
                    Zone #{request.answers.zoneId}
                  </div>
                </TableCell>
                <TableCell>
                  {request.farmName}
                  <div className="text-xs text-muted-foreground">
                    {request.requesterEmail}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs whitespace-pre-wrap">
                    {request.answers.location}
                  </p>
                  {request.answers.acreage != null && (
                    <div className="text-xs text-muted-foreground">
                      {request.answers.acreage} acres
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    {!request.hasAnalysis && (
                      <span
                        className="size-2 rounded-full bg-yellow-500"
                        aria-label="Under review"
                      />
                    )}
                    {request.answers.stage === 'processed'
                      ? 'Processed'
                      : request.answers.stage === 'sample_kit_sent'
                        ? 'Sample kit sent'
                        : 'Requested'}
                  </span>
                  {request.answers.sampleKitSentAt && (
                    <div className="text-xs text-muted-foreground">
                      Kit sent{' '}
                      {new Date(
                        request.answers.sampleKitSentAt
                      ).toLocaleDateString()}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {request.answers.stage === 'requested' && (
                    <Button
                      size="sm"
                      disabled={pendingId !== null}
                      onClick={() => update(request.id, 'sample_kit_sent')}
                    >
                      {pendingId === request.id
                        ? 'Saving…'
                        : 'Mark sample kit sent'}
                    </Button>
                  )}
                  {request.answers.stage === 'sample_kit_sent' && (
                    <div className="space-y-2">
                      <Link
                        href="/analyses"
                        className="block text-sm underline"
                      >
                        Enter soil analysis for zone #{request.answers.zoneId}
                      </Link>
                      <Button
                        size="sm"
                        disabled={pendingId !== null || !request.hasAnalysis}
                        onClick={() => update(request.id, 'processed')}
                      >
                        {pendingId === request.id
                          ? 'Saving…'
                          : 'Mark processed'}
                      </Button>
                      {!request.hasAnalysis && (
                        <p className="text-xs text-muted-foreground">
                          A soil analysis is required before processing.
                        </p>
                      )}
                    </div>
                  )}
                  {request.answers.stage === 'processed' && (
                    <Link href="/analyses" className="text-sm underline">
                      View analyses
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
