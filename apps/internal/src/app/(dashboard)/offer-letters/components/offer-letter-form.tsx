// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import {
  useForm,
  type FieldError,
  type RegisterOptions,
  type UseFormRegister,
} from 'react-hook-form';
import { toast } from 'sonner';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logger from '@/lib/logger';
import { notifyActionError } from '@/lib/notify-action-error';
import { generateOfferLetter } from '../actions';
import {
  buildGmailComposeUrl,
  buildOfferEmail,
  OFFER_EMAIL_SUBJECT,
} from '../email-template';
import { US_STATES } from '../us-states';
import type { OfferLetterFormData } from '../types';

/** Dotted react-hook-form path for every text/number field in the form. */
type FieldPath =
  | 'name'
  | 'position'
  | 'address.street'
  | 'address.line2'
  | 'address.city'
  | 'address.zip'
  | 'startDate'
  | 'endDate'
  | 'annualBaseSalary'
  | 'signingBonus'
  | 'equity';

interface FieldProps<TName extends FieldPath> {
  /** Form path, also used to derive the input id */
  name: TName;
  label: string;
  error?: FieldError;
  register: UseFormRegister<OfferLetterFormData>;
  /** Passed to `register` (required, validate, valueAsNumber, …) */
  rules?: RegisterOptions<OfferLetterFormData, TName>;
  type?: string;
  placeholder?: string;
  /** Extra input props (min, step, autoComplete, …) */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

/** Labelled input with inline validation message wired to aria attributes. */
function Field<TName extends FieldPath>({
  name,
  label,
  error,
  register,
  rules,
  type = 'text',
  placeholder,
  inputProps,
  className,
}: FieldProps<TName>) {
  const id = `offer-${name.replace('.', '-')}`;
  return (
    <div className={className ?? 'space-y-2'}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
        {...register(name, rules)}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

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

/** Registration rules for a non-negative whole-dollar/unit amount. */
const amountRules = {
  valueAsNumber: true,
  required: 'Required',
  min: { value: 0, message: 'Must be 0 or more' },
  validate: (v: number) => Number.isFinite(v) || 'Enter a number',
};

/**
 * Offer letter form. Collects hiree details, downloads the generated PDF and
 * shows the matching offer email so it can be copied into a mail client.
 */
export default function OfferLetterForm() {
  const [emailText, setEmailText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OfferLetterFormData>({
    defaultValues: {
      name: '',
      position: '',
      address: { street: '', line2: '', city: '', state: '', zip: '' },
      startDate: '',
      endDate: '',
      annualBaseSalary: 0,
      signingBonus: 0,
      equity: 0,
    },
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
      setEmailText(buildOfferEmail(data.name, data.position));
    } catch {
      notifyActionError();
    }
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard.`);
    } catch (error) {
      logger.error(`Failed to copy offer ${label.toLowerCase()}:`, error);
      toast.error('Could not copy. Select the text and copy it manually.');
    }
  };

  const required = (message: string) => ({
    required: message,
    validate: (v: string) => v.trim().length > 0 || message,
  });

  return (
    <>
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
            className="space-y-6"
            noValidate
          >
            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold">Hiree</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="name"
                  label="Hiree Name"
                  register={register}
                  rules={required('Hiree name is required')}
                  error={errors.name}
                  inputProps={{ autoComplete: 'off' }}
                />
                <Field
                  name="position"
                  label="Position Name"
                  register={register}
                  rules={required('Position name is required')}
                  error={errors.position}
                  placeholder="Software Engineer Intern"
                  inputProps={{ autoComplete: 'off' }}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold">Address</legend>
              <Field
                name="address.street"
                label="Street Address"
                register={register}
                rules={required('Street address is required')}
                error={errors.address?.street}
                placeholder="123 Main St"
                inputProps={{ autoComplete: 'off' }}
              />
              <Field
                name="address.line2"
                label="Apt / Suite / Unit (optional)"
                register={register}
                error={errors.address?.line2}
                inputProps={{ autoComplete: 'off' }}
              />
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <Field
                  name="address.city"
                  label="City"
                  register={register}
                  rules={required('City is required')}
                  error={errors.address?.city}
                  inputProps={{ autoComplete: 'off' }}
                />
                <div className="space-y-2">
                  <Label htmlFor="offer-address-state">State</Label>
                  <select
                    id="offer-address-state"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-invalid={errors.address?.state ? true : undefined}
                    aria-describedby={
                      errors.address?.state
                        ? 'offer-address-state-error'
                        : undefined
                    }
                    {...register('address.state', {
                      required: 'State is required',
                    })}
                  >
                    <option value="">Select…</option>
                    {US_STATES.map(([code, label]) => (
                      <option key={code} value={code}>
                        {code} – {label}
                      </option>
                    ))}
                  </select>
                  {errors.address?.state && (
                    <p
                      id="offer-address-state-error"
                      className="text-sm text-destructive"
                    >
                      {errors.address.state.message}
                    </p>
                  )}
                </div>
                <Field
                  name="address.zip"
                  label="ZIP"
                  register={register}
                  rules={{
                    required: 'ZIP is required',
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: 'Use 12345 or 12345-6789',
                    },
                  }}
                  error={errors.address?.zip}
                  placeholder="62701"
                  inputProps={{ autoComplete: 'off', inputMode: 'numeric' }}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold">Dates</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="startDate"
                  label="Start Date"
                  type="date"
                  register={register}
                  rules={{ required: 'Start date is required' }}
                  error={errors.startDate}
                />
                <Field
                  name="endDate"
                  label="End Date"
                  type="date"
                  register={register}
                  rules={{
                    required: 'End date is required',
                    validate: (v: string) =>
                      v >= getValues('startDate') ||
                      'End date must be on or after start date',
                  }}
                  error={errors.endDate}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold">
                Compensation
              </legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  name="annualBaseSalary"
                  label="Annual Base Salary (USD)"
                  type="number"
                  register={register}
                  rules={amountRules}
                  error={errors.annualBaseSalary}
                  inputProps={{ min: 0, step: 1 }}
                />
                <Field
                  name="signingBonus"
                  label="Signing Bonus (USD)"
                  type="number"
                  register={register}
                  rules={amountRules}
                  error={errors.signingBonus}
                  inputProps={{ min: 0, step: 1 }}
                />
                <Field
                  name="equity"
                  label="Equity (units)"
                  type="number"
                  register={register}
                  rules={amountRules}
                  error={errors.equity}
                  inputProps={{ min: 0, step: 1 }}
                />
              </div>
            </fieldset>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Download className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Generating…' : 'Generate PDF'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={emailText !== null}
        onOpenChange={(open) => !open && setEmailText(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offer Email</DialogTitle>
            <DialogDescription>
              The PDF has been downloaded. Copy the subject and body into the
              email to the hiree, or open a prefilled Gmail draft. Gmail links
              cannot attach files, so add the PDF to the draft yourself.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="offer-email-subject">Subject</Label>
            <div className="flex gap-2">
              <Input
                id="offer-email-subject"
                readOnly
                value={OFFER_EMAIL_SUBJECT}
                onFocus={(e) => e.currentTarget.select()}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Copy subject"
                onClick={() => copy(OFFER_EMAIL_SUBJECT, 'Subject')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer-email-body">Body</Label>
            <textarea
              id="offer-email-body"
              readOnly
              value={emailText ?? ''}
              rows={12}
              className="w-full resize-y rounded-md border border-input bg-muted/40 p-3 font-mono text-sm"
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => emailText && copy(emailText, 'Body')}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Body
            </Button>
            <Button asChild>
              <a
                href={buildGmailComposeUrl(
                  OFFER_EMAIL_SUBJECT,
                  emailText ?? ''
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Gmail
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
