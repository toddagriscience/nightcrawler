// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { IrisButton } from '@/components/common/iris-button/iris-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createObservation, updateObservation } from '../../actions';
import { fromCalendarDate, toCalendarDate } from './observation-dates';
import {
  OBSERVATION_BODY_MAX_LENGTH,
  type UpdateObservationInput,
  type ZoneObservation,
} from './types';

function startOfLocalToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

const JANUARY = 0;
const DECEMBER = 11;
const CALENDAR_YEARS_BACK = 50;
const CALENDAR_YEARS_AHEAD = 10;
const DATE_LABEL = 'Date';
const UNSET_DATE_LABEL = 'Select date';

interface ObservationFormValues {
  body: string;
  observedOn: Date;
}

interface ObservationFormProps {
  /** Management zone the note is saved against. */
  zoneId: number;
  /** Existing observation when editing. */
  observation?: ZoneObservation;
  /** Called after a successful save. */
  onSuccess: () => void;
  /** Called when the user cancels. */
  onCancel: () => void;
}

/**
 * Calendar day picker styled like the reminder due-date field.
 */
function ObservationDateField({
  value,
  onChange,
  disabled,
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const displayValue = value
    ? value.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : UNSET_DATE_LABEL;

  const [startMonth, endMonth] = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return [
      new Date(currentYear - CALENDAR_YEARS_BACK, JANUARY),
      new Date(currentYear + CALENDAR_YEARS_AHEAD, DECEMBER),
    ];
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <span
        aria-hidden="true"
        className="flex items-center gap-2 text-sm leading-none font-medium select-none"
      >
        {DATE_LABEL}
      </span>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="observedOn"
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={`${DATE_LABEL}: ${displayValue}`}
            className={cn(
              'h-10 w-full justify-start border-foreground/15 font-normal hover:bg-transparent',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon aria-hidden="true" className="size-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[100] w-auto border-0 p-0" align="start">
          <Calendar
            autoFocus
            mode="single"
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            selected={value}
            defaultMonth={value}
            className="border-foreground/15"
            classNames={{
              dropdown_root:
                'has-focus:border-foreground/15 border-foreground/15 shadow-xs has-focus:ring-ring/50 has-focus:ring-1 relative rounded-md border-1',
            }}
            onSelect={(date) => {
              if (!date) {
                return;
              }
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * Form for recording or editing a zone observation.
 *
 * @param props - Zone, optional existing observation, and close handlers.
 * @returns The observation form.
 */
export function ObservationForm({
  zoneId,
  observation,
  onSuccess,
  onCancel,
}: ObservationFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ObservationFormValues>({
    defaultValues: {
      body: observation?.body ?? '',
      observedOn: observation
        ? toCalendarDate(observation.observedOn)
        : startOfLocalToday(),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const input: UpdateObservationInput = {
      body: values.body,
      observedOn: fromCalendarDate(values.observedOn),
    };

    try {
      if (observation) {
        await updateObservation(observation.id, input);
      } else {
        await createObservation({ zoneId, ...input });
      }
      router.refresh();
      onSuccess();
    } catch (error) {
      logger.error('Failed to save observation:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to save observation'
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Controller
        name="observedOn"
        control={control}
        rules={{ required: 'Date is required' }}
        render={({ field }) => (
          <ObservationDateField
            value={field.value}
            onChange={field.onChange}
            disabled={isSubmitting}
          />
        )}
      />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="observation-body">Observation</Label>
        <Textarea
          id="observation-body"
          rows={3}
          disabled={isSubmitting}
          placeholder="What did you notice?"
          className="border-foreground/15"
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? 'observation-body-error' : undefined}
          {...register('body', {
            validate: (value) => {
              const trimmed = value.trim();
              if (!trimmed) {
                return 'Observation is required';
              }
              if (trimmed.length > OBSERVATION_BODY_MAX_LENGTH) {
                return `Observation must be ${OBSERVATION_BODY_MAX_LENGTH} characters or fewer`;
              }
              return true;
            },
          })}
        />
        {errors.body ? (
          <p id="observation-body-error" className="text-sm text-destructive">
            {errors.body.message}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <IrisButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </IrisButton>
        <IrisButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </IrisButton>
      </div>
    </form>
  );
}
