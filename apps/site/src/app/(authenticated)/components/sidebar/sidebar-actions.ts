// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { logout } from '@/lib/auth-client';

/** Server action to log the current user out and redirect to home. */
export async function sidebarLogout() {
  await logout();
}
