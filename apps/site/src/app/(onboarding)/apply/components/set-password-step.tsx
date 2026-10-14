// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import type {
  OnboardingActions,
  OnboardingApplicant,
} from '@/app/(onboarding)/apply/types';

/** Password-only account setup for an approved applicant, with injected submission. */
export default function SetPasswordStep({
  applicant,
  action,
  onComplete,
}: {
  applicant: OnboardingApplicant;
  action: OnboardingActions['signUp'];
  onComplete: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: '', confirmPassword: '' },
  });
  const [password, confirmPassword] = useWatch({
    control,
    name: ['password', 'confirmPassword'],
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        if (!applicant.passwordSet && !isPasswordValid) return;
        const formData = new FormData();
        formData.set('applicationId', String(applicant.applicationId));
        formData.set('token', applicant.token);
        if (!applicant.passwordSet) {
          formData.set('password', values.password);
          formData.set('confirmPassword', values.confirmPassword);
        }
        try {
          await action(null, formData);
          onComplete();
        } catch (error) {
          setError('root', {
            message:
              formatActionResponseErrors(error)[0] ??
              'Unable to save your password. Please try again.',
          });
        }
      })}
      className="flex flex-col gap-6"
      aria-busy={isSubmitting}
    >
      <div>
        <h2 className="text-xl font-semibold">
          {applicant.passwordSet
            ? 'Your password is saved'
            : 'Create your password'}
        </h2>
        <p className="mt-3 text-sm text-foreground/80">
          {applicant.passwordSet
            ? 'Continue to finish setting up your account.'
            : `Choose a password for ${applicant.email}. Your account information is already saved from your application.`}
        </p>
      </div>
      {!applicant.passwordSet && (
        <>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Create a Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={visible ? 'text' : 'password'}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
                className="hide-native-password-reveal pr-12"
                {...register('password', { required: true })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={visible ? 'Hide password' : 'Show password'}
                aria-pressed={visible}
                className="absolute right-0 top-0"
                onClick={() => setVisible(!visible)}
              >
                {visible ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type={visible ? 'text' : 'password'}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
              className="hide-native-password-reveal"
              {...register('confirmPassword', { required: true })}
            />
          </div>
          <PasswordChecklist
            password={password}
            confirmationPassword={confirmPassword}
            setIsPasswordValid={setIsPasswordValid}
          />
        </>
      )}
      {errors.root?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}
      <Button
        type="submit"
        disabled={(!applicant.passwordSet && !isPasswordValid) || isSubmitting}
        className="h-11 w-[200px] rounded-full bg-foreground text-background hover:bg-foreground/80"
      >
        {isSubmitting ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  );
}
