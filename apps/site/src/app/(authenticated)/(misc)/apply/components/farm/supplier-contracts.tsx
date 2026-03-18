// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { useFormContext } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function SupplierContracts() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>Is your farm in any supplier contracts?</FieldLabel>
        <ErrorMessage
          errors={errors}
          name="supplierContracts"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Input
        type="text"
        placeholder="What are the products or services?"
        {...register('supplierContracts')}
      />
    </Field>
  );
}
