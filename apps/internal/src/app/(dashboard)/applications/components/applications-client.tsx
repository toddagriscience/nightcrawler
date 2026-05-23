// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { getPlatformAccessApplications } from '../actions';

/** One platform access application row. */
type ApplicationRow = Awaited<
  ReturnType<typeof getPlatformAccessApplications>
>[number];

/** Props for {@link ApplicationsClient}. */
interface ApplicationsClientProps {
  /** Initial server-fetched applications */
  initialApplications: ApplicationRow[];
}

/**
 * Client UI for listing platform access applications.
 *
 * @param props - Initial application rows
 */
export default function ApplicationsClient({
  initialApplications,
}: ApplicationsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review platform access requests submitted from `/forms/[slug]`.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Retention</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground">
                No applications yet.
              </TableCell>
            </TableRow>
          ) : (
            initialApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.id}</TableCell>
                <TableCell>{application.formSlug}</TableCell>
                <TableCell>
                  <Badge variant="outline">{application.status}</Badge>
                </TableCell>
                <TableCell>
                  {application.retentionConsent ? 'Yes' : 'No'}
                </TableCell>
                <TableCell>
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/applications/${application.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
