// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SanityFormField } from '@/lib/sanity/form-types';
import { ErrorMessage } from '@hookform/error-message';
import { useTranslations } from 'next-intl';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { MarketingFilterDropdown } from '../../../components/marketing-filter-dropdown';

/** Bordered toggle styling for yes/no options. */
const FORM_YES_NO_OPTION_CLASS =
  'rounded-md border border-[#848484]/80 transition-colors';

/** Selected state for yes/no toggles. */
const FORM_YES_NO_SELECTED_CLASS = 'border-foreground/60 bg-muted/30';

/** Larger form checkbox — bordered square with checkmark only on select. */
const FORM_CHECKBOX_CLASS =
  'h-6 w-6 shrink-0 cursor-pointer rounded-sm border border-[#848484]/80 bg-transparent shadow-none data-[state=checked]:border-foreground/60 data-[state=checked]:bg-transparent data-[state=checked]:text-foreground [&_svg]:h-5 [&_svg]:w-5';

/** Props for {@link FormFieldRenderer}. */
export interface FormFieldRendererProps {
  /** CMS field definition */
  field: SanityFormField;
  /** react-hook-form control for custom inputs */
  control: Control<Record<string, unknown>>;
  /** react-hook-form register */
  register: UseFormRegister<Record<string, unknown>>;
  /** Validation errors */
  errors: FieldErrors<Record<string, unknown>>;
}

/**
 * Renders one Sanity-defined form field for the single-page layout.
 *
 * @param props - Field definition and form bindings
 */
export function FormFieldRenderer({
  field,
  control,
  register,
  errors,
}: FormFieldRendererProps) {
  const t = useTranslations('formsPage');
  const requiredMark = field.required ? ' *' : '';

  if (field.type === 'yesNo') {
    return (
      <FieldSet className="flex flex-col gap-3">
        <FieldLabel>
          {field.label}
          {requiredMark}
        </FieldLabel>
        {field.helpText ? (
          <FieldDescription>{field.helpText}</FieldDescription>
        ) : null}
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <div className="flex gap-3">
              {(
                [
                  ['Yes', true],
                  ['No', false],
                ] as const
              ).map(([label, value]) => {
                const selected = controllerField.value === value;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      FORM_YES_NO_OPTION_CLASS,
                      'flex-1 cursor-pointer px-4 py-3 text-sm font-normal text-foreground',
                      selected && FORM_YES_NO_SELECTED_CLASS
                    )}
                    onClick={() => controllerField.onChange(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={field.name}
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </FieldSet>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <FieldSet className="flex flex-col gap-3">
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <label
              htmlFor={field.name}
              className="flex cursor-pointer items-start gap-3"
            >
              <Checkbox
                id={field.name}
                className={FORM_CHECKBOX_CLASS}
                checked={controllerField.value === true}
                onCheckedChange={(checked) =>
                  controllerField.onChange(checked === true)
                }
              />
              <div className="space-y-1">
                <FieldLabel htmlFor={field.name} className="cursor-pointer">
                  {field.label}
                  {requiredMark}
                </FieldLabel>
                {field.helpText ? (
                  <FieldDescription>{field.helpText}</FieldDescription>
                ) : null}
              </div>
            </label>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={field.name}
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </FieldSet>
    );
  }

  if (field.type === 'textarea') {
    return (
      <FieldSet className="flex flex-col gap-2">
        <Field>
          <FieldLabel htmlFor={field.name}>
            {field.label}
            {requiredMark}
          </FieldLabel>
          {field.helpText ? (
            <FieldDescription>{field.helpText}</FieldDescription>
          ) : null}
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            className="min-h-32 border border-[#848484]/80"
            {...register(field.name)}
          />
        </Field>
        <ErrorMessage
          errors={errors}
          name={field.name}
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </FieldSet>
    );
  }

  if (field.type === 'select') {
    const options = (field.options ?? []).map((option) => ({
      value: option,
      label: option,
    }));

    return (
      <FieldSet className="flex flex-col gap-2">
        <Field>
          <FieldLabel htmlFor={field.name}>
            {field.label}
            {requiredMark}
          </FieldLabel>
          {field.helpText ? (
            <FieldDescription>{field.helpText}</FieldDescription>
          ) : null}
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <MarketingFilterDropdown
                id={field.name}
                value={
                  typeof controllerField.value === 'string'
                    ? controllerField.value
                    : ''
                }
                onValueChange={controllerField.onChange}
                options={options}
                placeholder={t('selectPlaceholder')}
                ariaLabel={field.label}
                matchTriggerWidth
              />
            )}
          />
        </Field>
        <ErrorMessage
          errors={errors}
          name={field.name}
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </FieldSet>
    );
  }

  const inputType =
    field.type === 'email'
      ? 'email'
      : field.type === 'phone'
        ? 'tel'
        : field.type === 'url'
          ? 'url'
          : 'text';

  return (
    <FieldSet className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor={field.name}>
          {field.label}
          {requiredMark}
        </FieldLabel>
        {field.helpText ? (
          <FieldDescription>{field.helpText}</FieldDescription>
        ) : null}
        <Input
          id={field.name}
          type={inputType}
          placeholder={field.placeholder}
          className="border border-[#848484]/80"
          {...register(field.name)}
        />
      </Field>
      <ErrorMessage
        errors={errors}
        name={field.name}
        render={({ message }) => <FormErrorMessage errorMessage={message} />}
      />
    </FieldSet>
  );
}
