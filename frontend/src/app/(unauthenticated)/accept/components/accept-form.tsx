// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { UserSelect } from '@/lib/types/db';
import { acceptInvite } from '../actions';
import { AcceptInvite, acceptInviteSchema } from '../types';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { FadeIn } from '@/components/common';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import { formatActionResponseErrors } from '@/lib/utils/actions';

export default function AcceptForm({
  currentUser,
}: {
  currentUser: UserSelect;
}) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInvite>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      phone: currentUser.phone || '',
      email: currentUser.email,
      didOwnAndControlParcel: false,
      didManageAndControl: false,
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit() {
    await trigger();
    setServerError('');

    try {
      const result = await acceptInvite(getValues());

      const errors = formatActionResponseErrors(result);

      if (errors.length > 0) {
        setServerError(errors[0]);
      }

      // Success is handled by the redirect('/') inside the action
    } catch (e) {
      setServerError('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <FadeIn className="max-w-250 w-[90vw] flex flex-col justify-center mx-auto h-screen gap-16">
      <h1 className="text-center text-3xl">Welcome to Todd.</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet className="flex flex-col gap-6">
          {serverError && <p className="text-red-500">{serverError}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Field>
              <div className="flex flex-row justify-between col-span-1">
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
                type="text"
                placeholder="First name"
                {...register('firstName')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between col-span-1">
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
                type="text"
                placeholder="Last name"
                {...register('lastName')}
              />
            </Field>

            <Field className="col-span-2">
              <div className="flex flex-row justify-between">
                <FieldLabel>Job Title</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="job"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="e.g. Farm Manager"
                {...register('job')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                type="text"
                readOnly
                {...register('email')}
                className="font-light border-black/40 bg-black/5"
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
                type="tel"
                placeholder="555-444-3333"
                {...register('phone')}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3">
            <Field
              className="flex items-center gap-3"
              orientation={'horizontal'}
            >
              <Checkbox
                {...register('didOwnAndControlParcel')}
                id="ownControl"
              />
              <FieldLabel htmlFor="ownControl" className="mb-0">
                I own and control this parcel
              </FieldLabel>
            </Field>
            <Field
              className="flex items-center gap-3"
              orientation={'horizontal'}
            >
              <Checkbox
                {...register('didManageAndControl')}
                id="manageControl"
              />
              <FieldLabel htmlFor="manageControl" className="mb-0">
                I manage and control operations
              </FieldLabel>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Password</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="password"
                placeholder="Min 8 characters"
                {...register('password')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Confirm Password</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="confirmPassword"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="password"
                placeholder="Repeat password"
                {...register('confirmPassword')}
              />
            </Field>
          </div>
          <PasswordChecklist
            password={watch('password')}
            confirmationPassword={watch('confirmPassword')}
          />
          <SubmitButton
            buttonText="Accept Invitation"
            reactHookFormPending={isSubmitting}
          />
        </FieldSet>
      </form>
    </FadeIn>
  );
}
