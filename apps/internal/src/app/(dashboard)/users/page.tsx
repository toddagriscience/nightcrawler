// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Force dynamic rendering to ensure dashboard data is fetched at request time.
 */
export const dynamic = 'force-dynamic';

import { getUsers } from './actions';
import UsersClient from './components/users-client';

/**
 * Users management page.
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function UsersPage() {
  const initialUsers = await getUsers();

  return <UsersClient initialUsers={initialUsers} />;
}
