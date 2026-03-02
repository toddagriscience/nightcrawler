// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { updateRole } from './action';

export default function SelfSelectAdmin({ role }: { role: string }) {
  const { handleSubmit, register, getValues, setValue } = useForm({
    defaultValues: { isAdmin: role === 'Admin' },
  });

  return (
    <>
      <h2 className="mb-1 text-lg font-semibold">You</h2>
      <p className="mb-5">
        Only one administrator account is permitted per farm. Please contact
        support for more information.
      </p>
      <form onChange={handleSubmit(updateRole)} className="mb-8">
        <Field orientation={'horizontal'}>
          <Checkbox
            onCheckedChange={() => setValue('isAdmin', !getValues().isAdmin)}
            {...register('isAdmin')}
            defaultChecked={getValues().isAdmin}
          />
          <Label>I am an administrator</Label>
        </Field>
      </form>
    </>
  );
}
