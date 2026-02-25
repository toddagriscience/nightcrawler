// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Input } from '@/components/ui/input';
import type {
  ManagementZoneInsert,
  ManagementZoneSelect,
} from '@/lib/types/db';
import { useForm } from 'react-hook-form';
import { updateManagementZone } from './actions';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

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
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nickname
        </label>
        <Input id="name" {...register('name')} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="mb-1 block text-sm font-medium">
            Latitude
          </label>
          <Input
            id="latitude"
            type="number"
            step="any"
            {...register('location.0')}
          />
        </div>
        <div>
          <label htmlFor="longitude" className="mb-1 block text-sm font-medium">
            Longitude
          </label>
          <Input
            id="longitude"
            type="number"
            step="any"
            {...register('location.1')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="rotationYear"
            className="mb-1 block text-sm font-medium"
          >
            Rotation year
          </label>
          <Input
            id="rotationYear"
            type="date"
            {...register('rotationYear', { valueAsDate: true })}
            defaultValue={zone.rotationYear?.toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label
            htmlFor="npkLastUsed"
            className="mb-1 block text-sm font-medium"
          >
            NPK last used
          </label>
          <Input
            id="npkLastUsed"
            type="date"
            {...register('npkLastUsed', {
              valueAsDate: true,
            })}
            defaultValue={zone.npkLastUsed?.toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contaminationRisk"
          className="mb-1 block text-sm font-medium"
        >
          Contamination risk
        </label>
        <select
          id="contaminationRisk"
          {...register('contaminationRisk')}
          className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Not set</option>
          <option value="Low">Low</option>
          <option value="Med">Med</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('npk')} />
          NPK in use
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('irrigation')} />
          Irrigation
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('waterConservation')} />
          Water conservation
        </label>
      </div>

      <div className="flex w-full flex-row items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-black px-6 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <div className="flex flex-row items-center gap-4">
          {errors.root && errors.root.message && (
            <div className="space-y-1">
              <p className="text-sm text-[#ff4d00]">{errors.root.message}</p>
            </div>
          )}
          <Link
            href={'/account/management-zones'}
            className="flex flex-row items-center gap-2 text-sm font-light"
          >
            Back to zones <ExternalLinkIcon strokeWidth={1} />{' '}
          </Link>
        </div>
      </div>
    </form>
  );
}
