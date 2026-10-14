# Supabase authentication email templates

`confirm-signup.html` replaces the inline SVG from issue #391 with the public PNG wordmark. The PNG URL is absolute so email image proxies can fetch it. The existing `/wordmark.png` response permits cross-origin image use. The image has explicit dimensions and alternative text; the layout uses inline styles and system-font fallbacks.

The Supabase `{{ .ConfirmationURL }}` and `{{ .Data.first_name }}` placeholders remain intact. See the [Supabase template documentation](https://supabase.com/docs/guides/auth/auth-email-templates).

To install, save a copy of the current hosted template, then paste this HTML into **Authentication → Email Templates → Confirm sign up** for the intended Supabase project. Committing this file does not update a hosted project's template automatically.

Verification: render with disposable placeholder values, check that the PNG loads at 76×25, and follow the confirmation link in the test project. Send a test signup email to an authorized Gmail recipient and verify the logo there before considering #391 complete. Other existing hosted templates can use the same PNG image tag without changing their own auth-link placeholders.
