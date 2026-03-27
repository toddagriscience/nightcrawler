// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import logger from '@/lib/logger';

/** Login form field values */
interface LoginFormData {
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Login page for the internal dashboard.
 * Uses Supabase email/password authentication.
 */
export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        logger.warn(`Login failed: ${error.message}`);
        toast.error('Invalid email or password. Please try again.');
        return;
      }

      toast.success('Signed in successfully.');
      router.push('/');
      router.refresh();
    } catch (error) {
      logger.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">Todd Internal Dashboard</CardTitle>
        <CardDescription>
          Sign in with your internal account credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@toddagriscience.com"
              autoComplete="email"
              {...register('email', { required: 'Email is required' })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
