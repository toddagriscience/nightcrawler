# Internal Dashboard

This is a VERY basic internal dashboard that essentially provides a shell around the database for client advisors to utilize.

If you want to access this platform, you will need to have an internal account (see the internal account table). Authentication is done via Supabase, then check with the internal account table.

Repo-wide conventions live in [`AGENTS.md`](/AGENTS.md).

## Commands

From the repository root:

- `bun run dev:internal` - Start the development server on port 3100

From this workspace (`apps/internal`):

- `bun run dev` - Development server with Turbopack, port 3100
- `bun run build` - Build for production
- `bun run start` - Start the production server
- `bun run lint` - ESLint
- `bun run type-check` - TypeScript type checking via `tsc --noEmit`
- `bun run format` / `bun run format:check` - Prettier

This workspace defines no `test` script, so `bun run test` at the root does not cover it.

## Rendering note

All dashboard routes are forced to `dynamic` rendering on purpose. This avoids Turborepo/Vercel build-time database fetching issues and keeps the internal site loading data at request time instead of during static generation.
