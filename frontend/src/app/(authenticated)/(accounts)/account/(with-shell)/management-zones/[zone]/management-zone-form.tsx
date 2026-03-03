// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  ManagementZoneInsert,
  ManagementZoneSelect,
} from '@/lib/types/db';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { updateManagementZone } from './actions';

export default function ManagementZoneForm({
  zone,
}: {
  zone: ManagementZoneSelect;
}) {
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ManagementZoneInsert>({
    defaultValues: {
      ...zone,
      location: [0, 0],
      // react-hook-form doesn't automatically handle Date, see each input for more context
      npkLastUsed: undefined,
      rotationYear: undefined,
    },
  });

  async function onSubmit(values: ManagementZoneInsert) {
    await trigger();

    const result = await updateManagementZone(zone.id, values);
    const errors = formatActionResponseErrors(result);

    if (errors.length !== 0) {
      setError('root', { message: errors[0] });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium leading-tight mb-1"
        >
          Nickname
        </Label>
        <Input
          className="w-full rounded-md border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
          id="name"
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
            className="w-full rounded-md border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
            id="latitude"
            type="number"
            step="any"
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
            className="w-full rounded-md border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
            id="longitude"
            type="number"
            step="any"
            {...register('location.1')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label
            htmlFor="rotationYear"
            className="block text-sm font-medium leading-tight mb-1"
          >
            Rotation year
          </Label>
          <Input
            className="w-full rounded-md border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
            id="rotationYear"
            type="date"
            {...register('rotationYear', { valueAsDate: true })}
            defaultValue={zone.rotationYear?.toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label
            htmlFor="npkLastUsed"
            className="block text-sm font-medium leading-tight mb-1"
          >
            NPK last used
          </Label>
          <Input
            className="w-full rounded-md border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
            id="npkLastUsed"
            type="date"
            {...register('npkLastUsed', {
              valueAsDate: true,
            })}
            defaultValue={zone.npkLastUsed?.toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 mt-10">
        <Label
          className="flex items-center gap-2 text-sm leading-tight"
          htmlFor="npk"
        >
          <Checkbox id="npk" {...register('npk')} />
          NPK in use
        </Label>
        <Label
          className="flex items-center gap-2 text-sm leading-tight"
          htmlFor="irrigation"
        >
          <Checkbox id="irrigation" {...register('irrigation')} />
          Irrigation
        </Label>
        <Label
          className="flex items-center gap-2 text-sm leading-tight"
          htmlFor="waterConservation"
        >
          <Checkbox id="waterConservation" {...register('waterConservation')} />
          Water conservation
        </Label>
      </div>

      <div className="flex w-full flex-row items-center justify-between mt-12">
        <Button
          variant="brand"
          type="submit"
          disabled={isSubmitting}
          className="rounded-full h-11 w-[144px] disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
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
