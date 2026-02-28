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
import { UserSelect, UserInsert } from '@/lib/types/db';
import { userInsertSchema } from '@/lib/zod-schemas/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { inviteUserToFarm } from '../actions';
import { userRoleEnum } from '@/lib/db/schema';
import { Button } from '@/components/ui';
import { TabTypes } from '../types';
import SelfSelectAdmin from './colleagues/self-select-admin';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { ApplicationContext } from './application-tabs';
import { resendVerificationEmail } from './colleagues/action';
import { RefreshCw } from 'lucide-react';
import InvitedUser from './colleagues/invited-user';

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
export default function Colleagues({
  setCurrentTab,
}: {
  setCurrentTab: (arg0: TabTypes) => void;
}) {
  const { currentUser, allUsers, invitedUserVerificationStatus } =
    useContext(ApplicationContext);

  const [users, setUsers] = useState(allUsers);
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
    const result = await inviteUserToFarm(data);
    if (result.error === null) {
      // Use returned row so the new list entry has a real id (needed for uninvite)
      if (result.data) {
        setUsers([...users, result.data as UserSelect]);
      }
      reset();
    } else {
      setError('role', { message: formatActionResponseErrors(result)[0] });
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
        <h2 className="mb-1 text-lg font-semibold">Current Team Members</h2>
        <p className="mb-5">
          Only one viewer account is allowed per user. Please contact support
          for more information.
        </p>
        <div className="mb-8">
          {users.length > 0 ? (
            <div className="flex flex-col gap-2">
              {users.map((singleUser, index) => (
                <InvitedUser
                  invitedUser={singleUser}
                  isCurrentUser={singleUser.id === currentUser.id}
                  isVerified={isVerified(singleUser)}
                  key={index}
                  onUninvited={(id) =>
                    setUsers(users.filter((u) => u.id !== id))
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No team members added yet.
            </p>
          )}
        </div>
        <SelfSelectAdmin role={currentUser.role} />

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

          <div className="mt-10 flex flex-row gap-6">
            <SubmitButton
              buttonText="INVITE TEAM MEMBER"
              className="basis-2/3"
              reactHookFormPending={isSubmitting}
            />
            <Button
              onClick={() => {
                setCurrentTab('farm');
                scrollTo(0, 0);
              }}
              className="w-full basis-1/3 bg-black text-white hover:cursor-pointer hover:bg-black/80"
            >
              NEXT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
