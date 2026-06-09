// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { SanityForm } from '@/lib/sanity/form-types';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitFormSubmission } from '../actions';
import {
  buildFormAnswersSchema,
  buildFormDefaultValues,
  flattenFormFields,
  FORM_HONEYPOT_FIELD,
  resolveFormFooterCheckboxes,
  resolveFormSections,
} from '../utils';
import { FormFieldRenderer } from './form-field-renderer';
import { FormFooterCheckbox } from './form-footer-checkbox';

/** Props for {@link DynamicForm}. */
export interface DynamicFormProps {
  /** CMS form definition */
  form: SanityForm;
}

/**
 * Splits Sanity copy into paragraphs for spaced layout.
 *
 * @param copy - Raw CMS text
 */
function splitCopyParagraphs(copy: string): string[] {
  return copy
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

/**
 * Renders a Sanity-defined access request form on a single centered page.
 *
 * @param props - CMS form document
 */
export function DynamicForm({ form }: DynamicFormProps) {
  const t = useTranslations('formsPage');
  const searchParams = useSearchParams();
  const sourceArticleSlug = searchParams.get('ref') ?? undefined;
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sections = useMemo(() => resolveFormSections(form), [form]);
  const fields = useMemo(() => flattenFormFields(sections), [sections]);
  const footerCheckboxes = useMemo(
    () => resolveFormFooterCheckboxes(form),
    [form]
  );

  const schema = useMemo(
    () => buildFormAnswersSchema(fields, footerCheckboxes),
    [fields, footerCheckboxes]
  );
  const defaultValues = useMemo(
    () => buildFormDefaultValues(fields, footerCheckboxes),
    [fields, footerCheckboxes]
  );
  const descriptionParagraphs = useMemo(
    () => (form.description ? splitCopyParagraphs(form.description) : []),
    [form.description]
  );
  const footerTextParagraphs = useMemo(
    () => (form.footerText ? splitCopyParagraphs(form.footerText) : []),
    [form.footerText]
  );

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Record<string, unknown>>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  async function onSubmit() {
    setSubmitError(null);

    try {
      await submitFormSubmission({
        formSlug: form.slug.current,
        answers: getValues(),
        sourceArticleSlug,
      });
      setSubmitted(true);
    } catch (error) {
      const [message] = formatActionResponseErrors(error);
      setSubmitError(message ?? t('submitError'));
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
        <h1 className="max-w-2xl text-3xl font-normal md:text-4xl">
          {form.successTitle ?? t('defaultSuccessTitle')}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          {form.successMessage ?? t('defaultSuccessMessage')}
        </p>
      </main>
    );
  }

  const hasFooter =
    footerCheckboxes.length > 0 || footerTextParagraphs.length > 0;

  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center md:px-10 md:py-24">
      <h1 className="max-w-2xl text-3xl font-normal leading-tight md:text-5xl md:leading-tight">
        {form.title}
      </h1>

      {descriptionParagraphs.length > 0 ? (
        <div className="mt-16 flex w-full max-w-2xl flex-col gap-8 md:mt-24 md:gap-10">
          {descriptionParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed text-foreground md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <form
        className="mt-16 flex w-full max-w-2xl flex-col gap-12 text-left md:mt-24 md:gap-14"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)();
        }}
      >
        <Field className="hidden">
          <Input type="text" tabIndex={-1} {...register(FORM_HONEYPOT_FIELD)} />
        </Field>

        {sections.map((section, sectionIndex) => (
          <section
            key={`${section.title}-${sectionIndex}`}
            className="flex flex-col gap-8 md:gap-10"
          >
            {section.title ? (
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-medium text-foreground">
                  {section.title}
                </h2>
                {section.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {section.description}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
              {section.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.width === 'half' ? 'md:col-span-1' : 'md:col-span-2'
                  }
                >
                  <FormFieldRenderer
                    field={field}
                    control={control}
                    register={register}
                    errors={errors}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {hasFooter ? (
          <FieldSet className="flex flex-col gap-6 border-t border-border pt-10">
            {footerCheckboxes.map((checkbox) => (
              <FormFooterCheckbox
                key={checkbox.name}
                checkbox={checkbox}
                control={control}
                errors={errors}
              />
            ))}

            {footerTextParagraphs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {footerTextParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </FieldSet>
        ) : null}

        {submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : null}

        <div className="flex justify-center pt-2">
          <SubmitButton
            buttonText={form.submitButtonLabel ?? t('submit')}
            disabled={!isValid || isSubmitting}
            reactHookFormPending={isSubmitting}
            onClickFunction={() => void handleSubmit(onSubmit)()}
          />
        </div>
      </form>
    </main>
  );
}
