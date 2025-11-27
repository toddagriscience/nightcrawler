// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password } = formData;
    const response = await login(email, password);

    if (response !== null) {
      router.push('/');
      return;
    }
  }

  return (
    <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
      <div className="w-[90vw] max-w-[inherit]">
        <h1 className="mb-8 text-center text-3xl">LOGIN</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FieldSet className="mb-8">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  className="focus:ring-0!"
                  placeholder="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e) => handleFormChange(e)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="focus:ring-0!"
                  name="password"
                  onChange={(e) => handleFormChange(e)}
                  required
                />
              </Field>
              <Field className="flex flex-row items-center justify-between">
                <div className="flex basis-[min-content] flex-row items-center justify-center gap-2 text-nowrap">
                  <Checkbox
                    id="show-password"
                    className="max-h-4 max-w-4 focus:ring-0!"
                    onCheckedChange={() => setShowPassword(!showPassword)}
                  />
                  <FieldLabel htmlFor="show-password">Show Password</FieldLabel>
                </div>
                <Link
                  href={'/todo'}
                  className="basis-[min-content] text-sm text-nowrap underline"
                >
                  Forgot Password
                </Link>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Button
            className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
            type="submit"
          >
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
}
