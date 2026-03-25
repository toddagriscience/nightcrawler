# Internal Dashboard

This is a VERY basic internal dashboard that essentially provides a shell around the database for client advisors to utilize.

If you want to access this platform, you will need to have an internal account (see the internal account table). Authentication is done via Supabase, then check with the internal account table.

## Rendering note

All dashboard routes are forced to `dynamic` rendering on purpose. This avoids Turborepo/Vercel build-time database fetching issues and keeps the internal site loading data at request time instead of during static generation.
