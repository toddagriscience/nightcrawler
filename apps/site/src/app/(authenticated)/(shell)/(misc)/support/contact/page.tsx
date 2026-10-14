// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { db } from '@nightcrawler/db/schema/connection';
import { farm } from '@nightcrawler/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ContactForm } from './components/contact-form';
import { submitClientContact } from './actions';
import { loadInferenceContactContext } from './inference-context';
import type { ContactInput } from './types';

/** Contact page for an onboarded Iris client, inside the authenticated shell. */
export default async function ClientContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ context?: string | string[] }>;
} = {}) {
  const currentUser = await getAuthenticatedInfo();
  const [currentFarm] = await db
    .select({ name: farm.informalName })
    .from(farm)
    .where(eq(farm.id, currentUser.farmId))
    .limit(1);
  if (!currentFarm) notFound();
  const params = await searchParams;
  const token =
    typeof params?.context === 'string' ? params.context : undefined;
  const context = token ? await loadInferenceContactContext(token) : null;
  const initialValues = context
    ? {
        subject: 'Question from inference search',
        message: context.questions
          .map((question, index) => `${index + 1}. ${question}`)
          .join('\n\n'),
      }
    : undefined;

  async function sendMessage(input: ContactInput) {
    'use server';
    return submitClientContact(input, context?.token);
  }

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
      {context ? (
        <div className="text-foreground/70 space-y-2 text-sm">
          <p>
            Your original search questions
            {context.managementZone ? ' and management zone' : ''} will be
            attached to your request. Edit the message or add details before
            sending.
          </p>
          {context.managementZone ? (
            <p>Management zone: {context.managementZone.name}</p>
          ) : null}
        </div>
      ) : token ? (
        <p role="alert" className="text-red-700 text-sm">
          Your saved search could not be loaded. It may have expired. Start a
          new search or write your message below.
        </p>
      ) : null}
      <ContactForm
        key={context?.token ?? 'new-contact'}
        senderName={`${currentUser.firstName} ${currentUser.lastName}`.trim()}
        senderEmail={currentUser.email}
        farmName={currentFarm.name || 'your farm'}
        initialValues={initialValues}
        anotherMessageHref={context ? '/support/contact' : undefined}
        submitAction={context ? sendMessage : submitClientContact}
      />
    </section>
  );
}
