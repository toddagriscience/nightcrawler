// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { db } from '@nightcrawler/db/schema/connection';
import { farm } from '@nightcrawler/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ContactForm } from './components/contact-form';
import { submitClientContact } from './actions';

/** Contact page for an onboarded Iris client, inside the authenticated shell. */
export default async function ClientContactPage() {
  const currentUser = await getAuthenticatedInfo();
  const [currentFarm] = await db
    .select({ name: farm.informalName })
    .from(farm)
    .where(eq(farm.id, currentUser.farmId))
    .limit(1);
  if (!currentFarm) notFound();

  return (
    <section className="mx-auto max-w-2xl space-y-8 py-4">
      <div className="space-y-3">
        <h1 className="text-foreground text-3xl font-normal">
          Contact your advisor
        </h1>
        <p className="text-foreground/70">
          Send a message to the Todd team about your farm or account.
        </p>
      </div>
      <ContactForm
        senderName={`${currentUser.firstName} ${currentUser.lastName}`.trim()}
        senderEmail={currentUser.email}
        farmName={currentFarm.name || 'your farm'}
        submitAction={submitClientContact}
      />
    </section>
  );
}
