// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, UserInsert } from '@/lib/types/db';
import { userInsertSchema } from '@/lib/zod-schemas/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { FadeIn } from '@/components/common';
import { inviteUserToFarm } from '../actions';
import { userRoleEnum } from '@/lib/db/schema';

const userRoles = userRoleEnum.enumValues;

// Yes, this is hardcoded. Sue me.
const userRolesWithDescription: Record<string, any>[] = [
  {
    role: userRoles[0],
    description: 'Administrators can control any and all information',
  },
  {
    role: userRoles[1],
    description: 'Viewers can only view information regarding the farm',
  },
];

/** The second tab for inviting colleagues to the Todd platform. */
export default function Colleagues({ allUsers }: { allUsers: User[] }) {
  const [users, setUsers] = useState(allUsers);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserInsert>({
    defaultValues: {},
    resolver: zodResolver(userInsertSchema.omit({ id: true })),
  });

  async function onSubmit(data: UserInsert) {
    const result = await inviteUserToFarm(data);
    if (result.error === null) {
      // Add the new user to the list and reset the form
      setUsers([...users, data as User]);
      reset();
    } else {
      console.log(result);
    }
  }

  return (
    <FadeIn className="mt-6">
      <div className="max-w-3xl">
        <h2 className="mb-4 text-lg font-semibold">Current Team Members</h2>
        <div className="mb-8">
          {users.length > 0 ? (
            <div className="flex flex-col gap-2">
              {users.map((singleUser, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between rounded-md border p-3"
                >
                  <div className="flex w-full flex-col sm:flex-row">
                    <p className="font-medium">
                      {singleUser.firstName} {singleUser.lastName}
                    </p>
                    <p className="text-muted-foreground sm:ml-2">
                      ({singleUser.email})
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {singleUser.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No team members added yet.</p>
          )}
        </div>

        <h2 className="mb-4 text-lg font-semibold">Invite a New Team Member</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="flex flex-col gap-6">
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
                  type="text"
                  placeholder="First name"
                  {...register('firstName')}
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
                  type="text"
                  placeholder="Last name"
                  {...register('lastName')}
                />
              </Field>
            </div>

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
                type="email"
                placeholder="colleague@example.com"
                {...register('email')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Phone (optional)</FieldLabel>
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
                placeholder="+1234567890"
                {...register('phone')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Job Title (optional)</FieldLabel>
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
                placeholder="e.g., Farm Manager"
                {...register('job')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Role</FieldLabel>
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
                    <SelectTrigger className="rounded-md border px-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {userRolesWithDescription.map((role) => (
                        <SelectItem key={role.role} value={role.role}>
                          {role.role} - {role.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <div className="flex flex-row items-center gap-3">
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
                <FieldLabel htmlFor="didOwnAndControlParcel">
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
                <FieldLabel htmlFor="didManageAndControl">
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

          <div className="mt-6">
            <SubmitButton buttonText="INVITE TEAM MEMBER" />
          </div>
        </form>
      </div>
    </FadeIn>
  );
}
