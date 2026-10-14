// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactSchema } from '../schema';
import type { ContactInput, ContactResult } from '../types';

interface ContactFormProps {
  senderName: string;
  senderEmail: string;
  farmName: string;
  /** Authorized server action, or an isolated preview/test replacement. */
  submitAction: (input: ContactInput) => Promise<ContactResult>;
}

/** Authenticated contact form with validated fields and delivery feedback. */
export function ContactForm({
  senderName,
  senderEmail,
  farmName,
  submitAction,
}: ContactFormProps) {
  const fieldId = useId();
  const [requestId, setRequestId] = useState<number | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: '', message: '' },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = async (input: ContactInput) => {
    try {
      const result = await submitAction(input);
      if (!result.success) {
        form.setError('root', { message: result.message });
        return;
      }
      form.reset();
      setRequestId(result.id);
    } catch {
      form.setError('root', {
        message: 'Your message could not be sent. Please try again.',
      });
    }
  };

  if (requestId !== null) {
    return (
      <div className="space-y-4">
        <p role="status" className="text-foreground">
          Message sent. Your advisor will follow up at {senderEmail}. Your
          request number is {requestId}.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setRequestId(null)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      <p className="text-foreground/70 text-sm">
        Sending as {senderName} ({senderEmail}) for {farmName}.
      </p>
      <div className="space-y-2">
        <Label htmlFor={`${fieldId}-subject`}>Subject</Label>
        <Input
          id={`${fieldId}-subject`}
          maxLength={160}
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={
            errors.subject ? `${fieldId}-subject-error` : undefined
          }
          {...form.register('subject')}
        />
        {errors.subject ? (
          <p
            id={`${fieldId}-subject-error`}
            role="alert"
            className="text-red-700 text-sm"
          >
            {errors.subject.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${fieldId}-message`}>Message</Label>
        <Textarea
          id={`${fieldId}-message`}
          rows={8}
          maxLength={5000}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${fieldId}-message-help${errors.message ? ` ${fieldId}-message-error` : ''}`}
          {...form.register('message')}
        />
        <p
          id={`${fieldId}-message-help`}
          className="text-foreground/70 text-sm"
        >
          Include the details your advisor needs. Maximum 5,000 characters.
        </p>
        {errors.message ? (
          <p
            id={`${fieldId}-message-error`}
            role="alert"
            className="text-red-700 text-sm"
          >
            {errors.message.message}
          </p>
        ) : null}
      </div>
      {errors.root ? (
        <p role="alert" className="text-red-700">
          {errors.root.message}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
