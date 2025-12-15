// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { logout } from '@/lib/auth';
import SubmitButton from '../submit-button/submit-button';

/** A temporary function for the dashboard. Will be improved/changed in the future.
 *
 * @returns {JSX.Element} - A logout button with Supabase logout functionality*/
export default function LogoutButton() {
  return (
    <SubmitButton onClickFunction={logout} buttonText="LOGOUT"></SubmitButton>
  );
}
