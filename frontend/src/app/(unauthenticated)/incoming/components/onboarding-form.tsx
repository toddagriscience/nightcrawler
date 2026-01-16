// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { useForm } from 'react-hook-form';
import { userInfoType } from '@/lib/types/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { userInfo } from '@/lib/zod-schemas/onboarding';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

/**
 * Onboarding form component for outbound onboarding flow.
 * Displays a form for users to confirm their pre-filled information when joining the platform.
 *
 * @param {string} props.firstName - Pre-filled first name from URL parameters (optional)
 * @param {string} props.lastName - Pre-filled last name from URL parameters (optional)
 * @param {string} props.farmName - Pre-filled farm name from URL parameters (optional)
 * @param {string} props.email - Pre-filled email from URL parameters (optional)
 * @param {string} props.phone - Pre-filled phone number from URL parameters (optional)
 * @returns {JSX.Element} The onboarding form component
 */
export default function OnboardingForm({
  firstName = '',
  lastName = '',
  farmName = '',
  email = '',
  phone = '',
}) {
  const router = useRouter();
  // This page isn't using `handleSubmit()` becaues I was having trouble getting it working.
  const {
    register,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<userInfoType>({
    defaultValues: {
      firstName,
      lastName,
      farmName,
      email,
      phone,
    },
    resolver: zodResolver(userInfo),
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    await trigger();

    if (isValid) {
      const params = new URLSearchParams({
        first_name: getValues().firstName,
        last_name: getValues().lastName,
        farm_name: getValues().farmName,
        email: getValues().email,
        phone: getValues().phone,
      });
      router.push(`/join?${params.toString()}`);
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-[800px] flex-col items-center justify-center gap-6">
      <h1 className="text-3xl">Let&apos;s get started.</h1>
      <p>Is this the correct information?</p>
      <form
        className="flex w-screen max-w-[800px] flex-col gap-4 px-4"
        onSubmit={(e) => onSubmit(e)}
      >
        <FieldSet className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>First Name</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="firstName"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                placeholder="First Name"
                required
                {...register('firstName', {
                  required: 'This field is required.',
                })}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Last Name</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="lastName"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                placeholder="Last Name"
                required
                {...register('lastName', {
                  required: 'This field is required.',
                })}
              />
            </Field>
          </div>

          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>Farm Name</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="farmName"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input
              placeholder="Farm Name"
              required
              {...register('farmName', {
                required: 'This field is required.',
              })}
            />
          </Field>

          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>Email</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input
              placeholder="Email"
              type="email"
              required
              {...register('email', {
                required: 'This field is required.',
              })}
            />
          </Field>

          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>Phone Number</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="phone"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input
              placeholder="Phone Number"
              type="tel"
              required
              defaultValue={'+1'}
              {...register('phone', {
                required: 'This field is required.',
              })}
              maxLength={10}
            />
          </Field>
        </FieldSet>
        <SubmitButton buttonText="CONFIRM INFORMATION" />
      </form>
    </div>
  );
}
