// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
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

  let currentUser;

  try {
    currentUser = await getAuthenticatedInfo();
  } catch (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
        <h1>There was an error with authentication</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return <AcceptForm currentUser={currentUser} />;
}
