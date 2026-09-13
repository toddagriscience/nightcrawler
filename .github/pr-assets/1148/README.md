# Issue #1148 screenshots

Before and after viewport captures for the approved applicant onboarding flow.
Before uses unchanged `origin/main` source at
`4082464b1ac0cb41b3632807390e28b518458ea1`; after was refreshed against the final
implementation rebased onto that main commit.

The local preview harness renders application components with fictional account
data and simulated actions. It substitutes framework/server boundaries and
recreates the authenticated header structure, using the application's styles and
fonts. These images do not demonstrate live Supabase, Stripe, or email behavior.

Files are original, unchanged JPEG captures. Most desktop views are 1430×894
pixels despite the 1440x900 suffix in their names. Both password captures, both
bank-saved captures, the before-payment capture, and the after-payment-continue-error
capture are 1440×900. The desktop gate capture is 1279×900. Separate top and bottom
views cover long pages.

Only reliable viewport captures are included. Tall/full-page exports had capture
artifacts and were excluded; the exact 1440×7000 Chrome capture recipe was not
completed.
