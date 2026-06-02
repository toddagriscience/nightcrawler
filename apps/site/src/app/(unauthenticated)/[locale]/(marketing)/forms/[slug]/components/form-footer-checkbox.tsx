// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import type { SanityFormFooterCheckbox } from '@/lib/sanity/form-types';
import { ErrorMessage } from '@hookform/error-message';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

/** Larger form checkbox — bordered square with checkmark only on select. */
const FORM_CHECKBOX_CLASS =
  'h-6 w-6 shrink-0 cursor-pointer rounded-sm border border-[#848484]/80 bg-transparent shadow-none data-[state=checked]:border-foreground/60 data-[state=checked]:bg-transparent data-[state=checked]:text-foreground [&_svg]:h-5 [&_svg]:w-5';

/** Props for {@link FormFooterCheckbox}. */
export interface FormFooterCheckboxProps {
  /** CMS footer checkbox definition */
  checkbox: SanityFormFooterCheckbox;
  /** react-hook-form control */
  control: Control<Record<string, unknown>>;
  /** Validation errors */
  errors: FieldErrors<Record<string, unknown>>;
}

/**
 * Renders one CMS-defined footer consent checkbox.
 *
 * @param props - Checkbox definition and form bindings
 */
export function FormFooterCheckbox({
  checkbox,
  control,
  errors,
}: FormFooterCheckboxProps) {
  const fieldId = `footer-${checkbox.name}`;

  return (
    <div className="flex flex-col gap-3">
      <Controller
        name={checkbox.name}
        control={control}
        render={({ field }) => (
          <label
            htmlFor={fieldId}
            className="flex cursor-pointer items-start gap-3"
          >
            <Checkbox
              id={fieldId}
              className={FORM_CHECKBOX_CLASS}
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <div className="space-y-1">
              <FieldLabel htmlFor={fieldId} className="cursor-pointer">
                {checkbox.label}
                {checkbox.required ? ' *' : ''}
              </FieldLabel>
              {checkbox.helpText ? (
                <FieldDescription>{checkbox.helpText}</FieldDescription>
              ) : null}
            </div>
          </label>
        )}
      />
      <ErrorMessage
        errors={errors}
        name={checkbox.name}
        render={({ message }) => <FormErrorMessage errorMessage={message} />}
      />
    </div>
  );
}
