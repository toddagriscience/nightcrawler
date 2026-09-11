// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { notifyActionError } from '@/lib/notify-action-error';
import { generateOfferLetter } from '../actions';
import type { OfferLetterFormData } from '../types';

/**
 * Turns base64 PDF bytes into a Blob and triggers a browser download.
 */
function downloadPdf(base64: string, filename: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(
    new Blob([bytes], { type: 'application/pdf' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Offer letter form. Collects hiree details and downloads the generated PDF.
 */
export default function OfferLetterForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OfferLetterFormData>({
    defaultValues: { name: '', address: '', startDate: '', endDate: '' },
  });

  const onSubmit = async (data: OfferLetterFormData) => {
    try {
      const pdf = await generateOfferLetter(data);
      if (!pdf) {
        toast.error('Failed to generate offer letter.');
        return;
      }
      const slug = data.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      downloadPdf(pdf, `offer-letter-${slug}.pdf`);
      toast.success('Offer letter downloaded.');
    } catch {
      notifyActionError();
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>New Offer Letter</CardTitle>
        <CardDescription>
          Generates a test PDF with the details below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="offer-name">Name</Label>
            <Input
              id="offer-name"
              autoComplete="off"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'offer-name-error' : undefined}
              {...register('name', {
                required: 'Name is required',
                validate: (v) => v.trim().length > 0 || 'Name is required',
              })}
            />
            {errors.name && (
              <p id="offer-name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer-address">Address</Label>
            <Textarea
              id="offer-address"
              rows={3}
              placeholder={'123 Main St\nSpringfield, IL 62701'}
              aria-invalid={errors.address ? true : undefined}
              aria-describedby={
                errors.address ? 'offer-address-error' : undefined
              }
              {...register('address', {
                required: 'Address is required',
                validate: (v) => v.trim().length > 0 || 'Address is required',
              })}
            />
            {errors.address && (
              <p id="offer-address-error" className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="offer-start-date">Start Date</Label>
              <Input
                id="offer-start-date"
                type="date"
                aria-invalid={errors.startDate ? true : undefined}
                aria-describedby={
                  errors.startDate ? 'offer-start-date-error' : undefined
                }
                {...register('startDate', {
                  required: 'Start date is required',
                })}
              />
              {errors.startDate && (
                <p
                  id="offer-start-date-error"
                  className="text-sm text-destructive"
                >
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer-end-date">End Date</Label>
              <Input
                id="offer-end-date"
                type="date"
                aria-invalid={errors.endDate ? true : undefined}
                aria-describedby={
                  errors.endDate ? 'offer-end-date-error' : undefined
                }
                {...register('endDate', {
                  required: 'End date is required',
                  validate: (v) =>
                    v >= getValues('startDate') ||
                    'End date must be on or after start date',
                })}
              />
              {errors.endDate && (
                <p
                  id="offer-end-date-error"
                  className="text-sm text-destructive"
                >
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Download className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Generating…' : 'Generate PDF'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
