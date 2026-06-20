// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';

export default function SupplierContracts() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel className="text-base leading-tight">
          Is your farm in any supplier contracts?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="supplierContracts"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Input
        className="bg-transparent border-1 border-[#848484]/80"
        type="text"
        placeholder="What are the products or services?"
        {...register('supplierContracts')}
      />
    </Field>
  );
}
