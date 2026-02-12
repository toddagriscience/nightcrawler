// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { redirect } from 'next/navigation';
import AcceptForm from './components/accept-form';

export default async function AcceptPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // This is a hacky way to redirect users who try to navigate to /accept without being an invited user. This doesn't involve the database because nothing harmful can be done to a user's account on /accept.
  const isNewUser = (await searchParams).new_user;

  if (!(isNewUser === 'true')) {
    redirect('/');
  }

  const currentUser = await getAuthenticatedInfo();

  return <AcceptForm currentUser={currentUser} />;
}
