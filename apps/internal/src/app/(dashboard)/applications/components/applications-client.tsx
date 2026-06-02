// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { getPlatformAccessApplications } from '../actions';
import { FormSlugBadge } from './form-slug-badge';

/** One platform access application row. */
type ApplicationRow = Awaited<
  ReturnType<typeof getPlatformAccessApplications>
>[number];

/** Props for {@link ApplicationsClient}. */
interface ApplicationsClientProps {
  /** Initial server-fetched applications */
  initialApplications: ApplicationRow[];
}

/** Sentinel value for the “all forms” filter option. */
const ALL_FORMS_FILTER = 'all';

/**
 * Unique form slugs from application rows, sorted alphabetically.
 *
 * @param applications - Application list
 */
function getUniqueFormSlugs(applications: ApplicationRow[]): string[] {
  return [
    ...new Set(
      applications
        .map((application) => application.formSlug)
        .filter((slug): slug is string => Boolean(slug?.trim()))
    ),
  ].sort((a, b) => a.localeCompare(b));
}

/**
 * Client UI for listing platform access applications.
 *
 * @param props - Initial application rows
 */
export default function ApplicationsClient({
  initialApplications,
}: ApplicationsClientProps) {
  const [formSlugFilter, setFormSlugFilter] = useState(ALL_FORMS_FILTER);

  const formSlugs = useMemo(
    () => getUniqueFormSlugs(initialApplications),
    [initialApplications]
  );

  const filteredApplications = useMemo(() => {
    if (formSlugFilter === ALL_FORMS_FILTER) {
      return initialApplications;
    }

    return initialApplications.filter(
      (application) => application.formSlug === formSlugFilter
    );
  }, [formSlugFilter, initialApplications]);

  const emptyMessage =
    initialApplications.length === 0
      ? 'No applications yet.'
      : formSlugFilter === ALL_FORMS_FILTER
        ? 'No applications yet.'
        : `No applications for form “${formSlugFilter}”.`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review platform access requests submitted from `/forms/[slug]`.
        </p>
      </div>

      {formSlugs.length > 0 ? (
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <Label htmlFor="applications-form-filter">Filter by form</Label>
          <Select value={formSlugFilter} onValueChange={setFormSlugFilter}>
            <SelectTrigger id="applications-form-filter">
              <SelectValue placeholder="All forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FORMS_FILTER}>All forms</SelectItem>
              {formSlugs.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signup</TableHead>
            <TableHead>Retention</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.id}</TableCell>
                <TableCell>
                  <FormSlugBadge slug={application.formSlug} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{application.status}</Badge>
                </TableCell>
                <TableCell>
                  {application.status === 'approved'
                    ? application.signedUpAt
                      ? 'Completed'
                      : application.inviteSentAt
                        ? 'Invite sent'
                        : 'Pending'
                    : '—'}
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
