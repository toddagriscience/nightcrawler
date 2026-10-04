// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  DEFAULT_OFFER_LOCATION,
  getCurrentIsoDate,
  offerLetterSchema,
} from '../schema';
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
  | 'letterDate'
  | 'acceptByDate'
  | 'startDate'
  | 'endDate'
  | 'location'
  | 'annualBaseSalary'
  | 'signingBonus'
  | 'equityPercentage';

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
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Registration rule that converts number inputs before schema validation. */
const amountRules = {
  valueAsNumber: true,
};

/**
 * Offer letter form. Collects candidate details, downloads the generated PDF and
 * shows the matching offer email so it can be copied into a mail client.
 */
export default function OfferLetterForm() {
  const [emailText, setEmailText] = useState<string | null>(null);
  const today = getCurrentIsoDate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferLetterFormData>({
    resolver: zodResolver(offerLetterSchema),
    defaultValues: {
      name: '',
      position: '',
      address: { street: '', line2: '', city: '', state: '', zip: '' },
      letterDate: today,
      acceptByDate: today,
      startDate: today,
      endDate: today,
      location: DEFAULT_OFFER_LOCATION,
      annualBaseSalary: 0,
      signingBonus: 0,
      equityPercentage: 0,
    },
  });

  const onSubmit = async (data: OfferLetterFormData) => {
    try {
      const pdf = await generateOfferLetter(data);
      if (!pdf) {
        toast.error('Failed to generate offer packet.');
        return;
      }
      const slug = data.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      downloadPdf(pdf, `${slug}-packet.pdf`);
      toast.success('Offer packet downloaded.');
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

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Offer Letter</CardTitle>
          <CardDescription>
            Generates a complete offer packet with the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold">Candidate</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="name"
                  label="Candidate Name"
                  register={register}
                  error={errors.name}
                  inputProps={{ autoComplete: 'off' }}
                />
                <Field
                  name="position"
                  label="Position Name"
                  register={register}
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
                    {...register('address.state')}
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
                  error={errors.address?.zip}
                  placeholder="62701"
                  inputProps={{ autoComplete: 'off', inputMode: 'numeric' }}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 text-sm font-semibold">
                Offer Details
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="letterDate"
                  label="Letter Date"
                  type="date"
                  register={register}
                  error={errors.letterDate}
                />
                <Field
                  name="acceptByDate"
                  label="Accept By"
                  type="date"
                  register={register}
                  error={errors.acceptByDate}
                />
                <Field
                  name="startDate"
                  label="Start Date"
                  type="date"
                  register={register}
                  error={errors.startDate}
                />
                <Field
                  name="endDate"
                  label="End Date"
                  type="date"
                  register={register}
                  error={errors.endDate}
                />
              </div>
              <Field
                name="location"
                label="Location"
                register={register}
                error={errors.location}
                placeholder="Los Angeles, CA/Remote"
                inputProps={{ autoComplete: 'off' }}
              />
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
                  name="equityPercentage"
                  label="Equity (%)"
                  type="number"
                  register={register}
                  rules={amountRules}
                  error={errors.equityPercentage}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
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
              The offer packet has been downloaded. Copy the subject and body
              into the email to the candidate, or open a prefilled Gmail draft.
              Gmail links cannot attach files, so add the PDF to the draft
              yourself.
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
