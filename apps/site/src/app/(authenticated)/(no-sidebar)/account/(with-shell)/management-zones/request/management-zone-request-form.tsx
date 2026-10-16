// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ManagementZoneRequestInput } from '@nightcrawler/db/utils/management-zone-request';
import type { requestManagementZone } from './actions';

/** Collects parcel details and submits an authenticated management-zone request. */
export default function ManagementZoneRequestForm({
  submitRequest,
}: {
  submitRequest: typeof requestManagementZone;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ManagementZoneRequestInput>();
  const submit = handleSubmit(async (values) => {
    try {
      const result = await submitRequest(values);
      if (!result.success) {
        setError('root', { message: result.error });
        return;
      }
      router.push(`/?zone=${result.zoneId}`);
      router.refresh();
    } catch {
      setError('root', {
        message: 'Unable to submit your request. Please try again.',
      });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Add your parcel details so your advisor can arrange a soil sample kit.
        Your zone will stay under review until a soil analysis is available.
      </p>
      <div className="space-y-2">
        <Label htmlFor="request-zone-name">Zone name</Label>
        <Input
          id="request-zone-name"
          maxLength={200}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'request-zone-name-error' : undefined}
          {...register('name', {
            required: 'Enter a zone name.',
            validate: (value) => !!value.trim() || 'Enter a zone name.',
          })}
        />
        {errors.name && (
          <p
            id="request-zone-name-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="request-zone-location">Location</Label>
        <Textarea
          id="request-zone-location"
          placeholder="Parcel address or a description of its location"
          maxLength={1000}
          aria-invalid={!!errors.location}
          aria-describedby={
            errors.location ? 'request-zone-location-error' : undefined
          }
          {...register('location', {
            required: 'Enter a location.',
            validate: (value) => !!value.trim() || 'Enter a location.',
          })}
        />
        {errors.location && (
          <p
            id="request-zone-location-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.location.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="request-zone-acreage">Acreage (optional)</Label>
        <Input
          id="request-zone-acreage"
          type="number"
          min="0"
          max="1000000"
          step="any"
          aria-invalid={!!errors.acreage}
          aria-describedby={
            errors.acreage ? 'request-zone-acreage-error' : undefined
          }
          {...register('acreage', {
            setValueAs: (value) => (value === '' ? null : Number(value)),
            validate: (value) =>
              value == null ||
              (Number.isFinite(value) && value > 0 && value <= 1_000_000) ||
              'Enter an acreage greater than zero and no more than 1,000,000.',
          })}
        />
        {errors.acreage && (
          <p
            id="request-zone-acreage-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.acreage.message}
          </p>
        )}
      </div>
      {errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" variant="brand" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Request management zone'}
      </Button>
    </form>
  );
}
