// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { redirect } from 'next/navigation';

/** A basic error page in case someone's auth code isn't working. See `app/auth/confirm/route.ts` for more information.
 *
 * @returns {JSX.Element} - The error page*/
export default function AuthCodeError() {
  return (
    <div className="flex flex-col justify-center items-center max-w-[550px] mx-auto h-screen">
      <div>
        <h1 className="mb-6 text-center text-3xl">AUTH CODE ERROR</h1>
        <p className="mb-6">
          There was an error with your authentication code.
        </p>
        <SubmitButton
          buttonText="HOME"
          onClickFunction={() => redirect('/en')}
        />
      </div>
    </div>
  );
}
