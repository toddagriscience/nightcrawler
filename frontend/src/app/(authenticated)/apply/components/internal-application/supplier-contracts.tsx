// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface SupplierContractsProps {
  register: UseFormRegister<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
  farmName?: string;
}

export default function SupplierContracts({
  register,
  errors,
  farmName = 'The farm',
}: SupplierContractsProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>Is {farmName} in any supplier contracts?</FieldLabel>
        <ErrorMessage
          errors={errors}
          name="supplierContracts"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Input
        type="text"
        placeholder="If so, what are the products or services?"
        {...register('supplierContracts')}
      />
    </Field>
  );
}
