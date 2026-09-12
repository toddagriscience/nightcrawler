// Copyright © Todd Agriscience, Inc. All rights reserved.

import OfferLetterForm from './components/offer-letter-form';

/**
 * Offer letters page.
 * Renders the form that generates a downloadable offer letter PDF.
 */
export default function OfferLettersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Offer Letters</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the hiree&apos;s details to generate a downloadable offer
          letter PDF.
        </p>
      </div>
      <OfferLetterForm />
    </div>
  );
}
