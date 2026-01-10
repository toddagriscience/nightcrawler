// Copyright © Todd Agriscience, Inc. All rights reserved.

import posthog from 'posthog-js';

export default function CookieBanner() {
  function handleCookieConsent(consent: boolean) {
    if (consent) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }

  return (
    <div>
      <button onClick={() => handleCookieConsent(false)}>
        I do not consent
      </button>
      <button onClick={() => handleCookieConsent(true)}>I consent</button>
    </div>
  );
}
