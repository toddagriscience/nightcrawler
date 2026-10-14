// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserInsert, UserSelect } from '@/lib/types/db';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { userInsertSchema } from '@/lib/zod-schemas/db';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRoleEnum } from '@nightcrawler/db/schema';
import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import InvitedUser from '@/app/(onboarding)/apply/components/colleagues/invited-user';

const userRoles = userRoleEnum.enumValues;

// Role descriptions match the existing farm permission model.
const userRolesWithDescription: {
  role: (typeof userRoles)[number];
  description: string;
}[] = [
  {
    role: userRoles[0],
    description: 'Administrators can control any and all information',
  },
  {
    role: userRoles[1],
    description: 'Viewers can only view information regarding the farm',
  },
];

/** Optional team invitations in the second onboarding step. */
export default function Colleagues() {
  const {
    currentUser,
    allUsers,
    invitedUserVerificationStatus,
    completeTeamStep,
    canEditFarm,
    actions,
  } = useContext(ApplicationContext);

  const [users, setUsers] = useState(allUsers);
  const {
    handleSubmit: handleContinue,
    setError: setContinueError,
    clearErrors: clearContinueErrors,
    formState: { errors: continueErrors, isSubmitting: isContinuing },
  } = useForm();
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInsert>({
    defaultValues: {},
    resolver: zodResolver(userInsertSchema.omit({ id: true })),
  });

  async function onSubmit(data: UserInsert) {
    try {
      const result = await actions.inviteUserToFarm(data);
      // Use returned row so the new list entry has a real id (needed for uninvite)
      if (result.data) {
        setUsers((previous) => [...previous, result.data as UserSelect]);
      }
      reset();
    } catch (error) {
      setError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'Unable to invite this team member. Please try again.',
      });
    }
  }

  async function continueToPayment() {
    if (!canEditFarm || isSubmitting) return;
    clearContinueErrors();
    try {
      await completeTeamStep();
    } catch (error) {
      setContinueError('root', {
        message:
          formatActionResponseErrors(error)[0] ??
          'Unable to save your progress. Please try again.',
      });
    }
  }

  // Technically not the best code - refactor me
  function isVerified(user: UserSelect) {
    for (const invitedUser of invitedUserVerificationStatus) {
      if (invitedUser.email === user.email && invitedUser.verified) {
        return true;
      }
    }

    return false;
  }

  return (
    <div className="mt-6">
      <div className="max-w-3xl">
        <h2 className="mb-3 text-xl font-semibold">Add people</h2>
        <p className="mb-4 text-foreground/80 text-sm">
          Invite a teammate to your farm account, or continue without adding
          anyone.
        </p>
        <p className="mb-4 text-foreground/80 text-sm font-thin">
          Only one viewer account is allowed per user. Please contact support
          for more information.
        </p>
        <div className="mb-8">
          {users.length > 0 ? (
            <div className="flex flex-col gap-2">
              {users.map((singleUser) => (
                <InvitedUser
                  invitedUser={singleUser}
                  isCurrentUser={singleUser.id === currentUser.id}
                  isVerified={isVerified(singleUser)}
                  canEditFarm={canEditFarm}
                  key={singleUser.id}
                  onUninvited={(id) =>
                    setUsers((previous) => previous.filter((u) => u.id !== id))
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-foreground/80 text-sm italic">
              No team members added yet.
            </p>
          )}
        </div>

        {canEditFarm ? (
          <>
            <h2 className="mb-4 text-xl font-semibold">
              Invite a New Team Member
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <div className="flex flex-row justify-between">
                      <FieldLabel
                        htmlFor="firstName"
                        className="leading-tight mb-[-6px]"
                      >
                        First Name
                      </FieldLabel>
                      <ErrorMessage
                        errors={errors}
                        name="firstName"
                        render={({ message }) => (
                          <FormErrorMessage errorMessage={message} />
                        )}
                      />
                    </div>
                    <Input
                      className="border-[#848484]/80 border-1 bg-transparent"
                      type="text"
                      placeholder="First name"
                      id="firstName"
                      aria-invalid={Boolean(errors.firstName)}
                      {...register('firstName')}
                    />
                  </Field>

                  <Field>
                    <div className="flex flex-row justify-between">
                      <FieldLabel
                        htmlFor="lastName"
                        className="leading-tight mb-[-6px]"
                      >
                        Last Name
                      </FieldLabel>
                      <ErrorMessage
                        errors={errors}
                        name="lastName"
                        render={({ message }) => (
                          <FormErrorMessage errorMessage={message} />
                        )}
                      />
                    </div>
                    <Input
                      className="border-[#848484]/80 border-1 bg-transparent"
                      type="text"
                      placeholder="Last name"
                      id="lastName"
                      aria-invalid={Boolean(errors.lastName)}
                      {...register('lastName')}
                    />
                  </Field>
                </div>

                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel
                      htmlFor="email"
                      className="leading-tight mb-[-6px]"
                    >
                      Email
                    </FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    className="border-[#848484]/80 border-1 bg-transparent"
                    type="email"
                    placeholder="colleague@example.com"
                    id="email"
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </Field>

                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel
                      htmlFor="phone"
                      className="leading-tight mb-[-6px]"
                    >
                      Phone (optional)
                    </FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="phone"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    className="border-[#848484]/80 border-1 bg-transparent"
                    type="tel"
                    placeholder="+1234567890"
                    id="phone"
                    aria-invalid={Boolean(errors.phone)}
                    {...register('phone')}
                  />
                </Field>

                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel
                      htmlFor="job"
                      className="leading-tight mb-[-6px]"
                    >
                      Job Title (optional)
                    </FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="job"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    className="border-[#848484]/80 border-1 bg-transparent"
                    type="text"
                    placeholder="e.g., Farm Manager"
                    id="job"
                    aria-invalid={Boolean(errors.job)}
                    {...register('job')}
                  />
                </Field>

                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel
                      htmlFor="role"
                      className="leading-tight mb-[-6px]"
                    >
                      Role
                    </FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="role"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger
                          id="role"
                          aria-invalid={Boolean(errors.role)}
                          className="border-[#848484]/80 border-1 bg-transparent rounded-md px-3 hover:cursor-pointer"
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#848484]/80 border-1">
                          {userRolesWithDescription.map((role) => (
                            <SelectItem
                              key={role.role}
                              value={role.role}
                              className="text-muted-foreground/70 font-thin hover:cursor-pointer hover:bg-[#d9d9d9]/50"
                            >
                              {role.role} - {role.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field>
                  <div className="flex flex-row items-center gap-3 mt-1">
                    <Controller
                      name="didOwnAndControlParcel"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="didOwnAndControlParcel"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <FieldLabel
                      className="leading-tight"
                      htmlFor="didOwnAndControlParcel"
                    >
                      This person owned and controlled the parcel for the past 3
                      years
                    </FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="didOwnAndControlParcel"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                </Field>

                <Field>
                  <div className="flex flex-row items-center gap-3">
                    <Controller
                      name="didManageAndControl"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="didManageAndControl"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <FieldLabel
                      className="leading-tight"
                      htmlFor="didManageAndControl"
                    >
                      This person managed and controlled (but did not own) the
                      parcel for the past 3 years
                    </FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="didManageAndControl"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                </Field>
              </FieldSet>

              {errors.root?.message && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {errors.root.message}
                </p>
              )}
              <div className="mt-8 flex flex-row justify-between gap-4">
                <SubmitButton
                  buttonText="Invite Team Member"
                  className="h-11 w-[200px] rounded-full bg-white text-black hover:cursor-pointer border-primary border-1 hover:border-[#848484]/80 font-semibold hover:bg-white hover:text-foreground/80"
                  reactHookFormPending={isSubmitting}
                  disabled={isSubmitting || isContinuing}
                />
              </div>
            </form>
            <div className="mt-6 flex flex-col items-end gap-3">
              {continueErrors.root?.message && (
                <p role="alert" className="text-sm text-red-700">
                  {continueErrors.root.message}
                </p>
              )}
              <Button
                type="button"
                onClick={() => void handleContinue(continueToPayment)()}
                disabled={isSubmitting || isContinuing}
                className="h-11 w-[200px] rounded-full bg-black text-white hover:cursor-pointer hover:bg-black/80 font-semibold"
              >
                {isContinuing ? 'Continuing…' : 'Continue'}
              </Button>
            </div>
          </>
        ) : (
          <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
            Your account is read only. Only administrators can invite or manage
            team members.
          </p>
        )}
      </div>
    </div>
  );
}
