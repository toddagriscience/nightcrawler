// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type {
  ManagementZoneInsert,
  ManagementZoneSelect,
} from '@/lib/types/db';
import { cn } from '@/lib/utils';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { BiArrowBack, BiCalendar } from 'react-icons/bi';
import { toDisplayDate } from '../../../util';
import { updateManagementZone } from './actions';

const FIELD_CLASSES =
  'w-full rounded-md border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin';

const JANUARY = 0;
const DECEMBER = 11;
const CALENDAR_YEARS_BACK = 50;
const CALENDAR_YEARS_AHEAD = 10;

/**
 * Converts a database date, which is stored at UTC midnight, into the local
 * midnight date react-day-picker expects.
 * @param {Date | null | undefined} value - The date read from the database
 * @returns {Date | undefined} The equivalent day at local midnight
 */
function toCalendarDate(value: Date | null | undefined) {
  if (!value) {
    return undefined;
  }

  return new Date(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate()
  );
}

/**
 * Converts the local midnight date react-day-picker returns back to the UTC
 * midnight the `date` column round-trips through, so the day does not shift for
 * users east of UTC.
 * @param {Date | undefined} value - The day picked in the calendar
 * @returns {Date | null} The equivalent day at UTC midnight
 */
function fromCalendarDate(value: Date | undefined) {
  if (!value) {
    return null;
  }

  return new Date(
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
  );
}

/**
 * Calendar backed replacement for a native date input, wired to react-hook-form
 * through a controller since the trigger is a button rather than an input.
 */
function DateField({
  control,
  name,
  label,
  disabled,
}: {
  control: Control<ManagementZoneInsert>;
  name: 'rotationYear' | 'npkLastUsed';
  label: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  // The dropdowns need an explicit range, otherwise react-day-picker caps
  // navigation at the end of the current year and future rotation dates become
  // unreachable.
  const [startMonth, endMonth] = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return [
      new Date(currentYear - CALENDAR_YEARS_BACK, JANUARY),
      new Date(currentYear + CALENDAR_YEARS_AHEAD, DECEMBER),
    ];
  }, []);

  return (
    <div>
      {/*
        A `<label for>` cannot name a `<button>`, so this is a plain span: the
        association was inert and clicking it did nothing, unlike the native
        date input it replaced. The trigger below carries the accessible name
        via aria-label, so this copy is hidden from assistive tech to avoid
        announcing the label twice.
      */}
      <span
        aria-hidden="true"
        className="block text-sm font-medium leading-tight mb-1"
      >
        {label}
      </span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selected = toCalendarDate(field.value);
          const displayValue = toDisplayDate(field.value);

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  // A `<label for>` does not name a button, so the trigger
                  // carries the label and the current value itself.
                  aria-label={`${label}: ${displayValue}`}
                  className={cn(
                    FIELD_CLASSES,
                    'justify-start hover:bg-transparent'
                  )}
                >
                  <BiCalendar className="size-4" />
                  {displayValue}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={startMonth}
                  endMonth={endMonth}
                  selected={selected}
                  defaultMonth={selected}
                  onSelect={(date) => {
                    field.onChange(fromCalendarDate(date));
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
}

/**
 * Editable details for a single management zone.
 * @param {ManagementZoneSelect} zone - The zone being edited
 * @param {boolean} canEdit - Whether the current user may submit changes
 */
export default function ManagementZoneForm({
  zone,
  canEdit,
}: {
  zone: ManagementZoneSelect;
  canEdit: boolean;
}) {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ManagementZoneInsert>({
    defaultValues: {
      ...zone,
      location: [0, 0],
    },
  });

  async function onSubmit(values: ManagementZoneInsert) {
    await trigger();
    try {
      await updateManagementZone(zone.id, values);
    } catch (error) {
      const errors = formatActionResponseErrors(error);
      if (errors.length !== 0) {
        setError('root', { message: errors[0] });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!canEdit && (
        <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
          Your account is read only. Only administrators can edit management
          zone details.
        </p>
      )}
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium leading-tight mb-1"
        >
          Nickname
        </Label>
        <Input
          className={FIELD_CLASSES}
          id="name"
          disabled={!canEdit}
          {...register('name')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label
            htmlFor="latitude"
            className="block text-sm font-medium leading-tight mb-1"
          >
            Latitude
          </Label>
          <Input
            className={FIELD_CLASSES}
            id="latitude"
            type="number"
            step="any"
            disabled={!canEdit}
            {...register('location.0')}
          />
        </div>
        <div>
          <Label
            htmlFor="longitude"
            className="block text-sm font-medium leading-tight mb-1"
          >
            Longitude
          </Label>
          <Input
            className={FIELD_CLASSES}
            id="longitude"
            type="number"
            step="any"
            disabled={!canEdit}
            {...register('location.1')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DateField
          control={control}
          name="rotationYear"
          label="Rotation year"
          disabled={!canEdit}
        />
        <DateField
          control={control}
          name="npkLastUsed"
          label="NPK last used"
          disabled={!canEdit}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 mt-10">
        <Label
          className="flex items-center gap-2 text-sm leading-tight"
          htmlFor="npk"
        >
          <Checkbox id="npk" disabled={!canEdit} {...register('npk')} />
          NPK in use
        </Label>
        <Label
          className="flex items-center gap-2 text-sm leading-tight"
          htmlFor="irrigation"
        >
          <Checkbox
            id="irrigation"
            disabled={!canEdit}
            {...register('irrigation')}
          />
          Irrigation
        </Label>
        <Label
          className="flex items-center gap-2 text-sm leading-tight"
          htmlFor="waterConservation"
        >
          <Checkbox
            id="waterConservation"
            disabled={!canEdit}
            {...register('waterConservation')}
          />
          Water conservation
        </Label>
      </div>

      <div className="flex w-full flex-row items-center justify-between mt-12">
        {canEdit ? (
          <Button
            variant="brand"
            type="submit"
            disabled={isSubmitting}
            className="rounded-full h-11 w-[144px] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        ) : (
          <div />
        )}
        <div className="flex flex-row items-center gap-4">
          {errors.root && errors.root.message && (
            <div className="space-y-1">
              <p className="text-sm text-[#ff4d00]">{errors.root.message}</p>
            </div>
          )}
          <Link
            href={'/account/management-zones'}
            className="flex flex-row items-center gap-2 text-sm font-light hover:text-foreground/70 transition-all duration-300 ease-in-out"
          >
            <BiArrowBack className="size-5" /> Back to zones
          </Link>
        </div>
      </div>
    </form>
  );
}
