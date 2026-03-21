// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { updateRole } from './action';

export default function SelfSelectAdmin({
  role,
  canEditFarm,
}: {
  role: string;
  canEditFarm: boolean;
}) {
  const { handleSubmit, register, getValues, setValue } = useForm({
    defaultValues: { isAdmin: role === 'Admin' },
  });

  return (
    <>
      <h2 className="mb-2 text-lg font-normal">You</h2>
      <p className="mb-4 text-foreground/80 text-sm font-thin">
        Only one administrator account is permitted per farm. Please contact
        support for more information.
      </p>
      {canEditFarm ? (
        <form onChange={handleSubmit(updateRole)} className="mb-10">
          <Field orientation={'horizontal'}>
            <Checkbox
              onCheckedChange={() => setValue('isAdmin', !getValues().isAdmin)}
              {...register('isAdmin')}
              defaultChecked={getValues().isAdmin}
            />
            <Label className="text-sm text-muted-foreground/70 leading-tight">
              I am an administrator
            </Label>
          </Field>
        </form>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground/70">
          Your role is {role}. Only administrators can change farm permissions.
        </p>
      )}
    </>
  );
}
