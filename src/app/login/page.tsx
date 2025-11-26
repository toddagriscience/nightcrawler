// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Login() {
  return (
    <div className="w-[90vw] h-full flex flex-col">
      <h1>LOGIN</h1>
      <form>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input placeholder="Email" id="email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="••••••••" />
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
