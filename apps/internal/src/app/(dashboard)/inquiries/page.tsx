// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getClientInquiries, markClientInquiryHandled } from './actions';
import { InquiriesList } from './components/inquiries-list';
import Link from 'next/link';
import { logger } from '@/lib/logger';
import type { ClientInquiry } from './types';

/** Authenticated internal inbox for messages submitted by Iris clients. */
export default async function InquiriesPage() {
  let inquiries: ClientInquiry[] | null = null;
  try {
    inquiries = await getClientInquiries();
  } catch (error) {
    logger.error('Unable to load the client inquiries inbox', error);
  }
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Client inquiries</h1>
      {inquiries !== null ? (
        <InquiriesList
          inquiries={inquiries}
          handleAction={markClientInquiryHandled}
        />
      ) : (
        <div className="space-y-4">
          <p role="alert">The inbox could not be loaded. Please try again.</p>
          <Link href="/inquiries" className="underline">
            Reload inbox
          </Link>
        </div>
      )}
    </section>
  );
}
