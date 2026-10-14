---
description: When modifying database tables
---

1. Apply changes to the schema.
2. Do not create or run migrations — see [`AGENTS.md` → Database](../../AGENTS.md#database). Let the specific backend teams handle migrations.

## How migrations reach staging/prod (for the backend team)

- Committed migrations live in `packages/db/drizzle/*.sql` + `meta/_journal.json`. CI applies them with the ledger-based drizzle migrator (`packages/db/scripts/migrate-remote-db.ts`), never `drizzle-kit push` — push silently no-ops in CI (interactive enum resolver, no TTY, exits 0), which is how prod once drifted.
- Merge to `main` → "Database Compatibility Check" workflow migrates **staging**. Cutting a release → "Release Database Compatibility Check And Push" migrates **prod**, then chains the Vercel deploy. Both fail loudly on any mismatch.
- If a database has drifted (schema present but ledger disagrees), run the manual "DB Reconcile (Apply Pending Migrations)" workflow (Actions → workflow_dispatch → pick `staging`/`prod`, run `verify` first, then `apply`).
- Row data for sheet-mirrored tables (seed varieties, general IMPs) is loaded by the importers in `packages/db/scripts/import-*.ts`; they default to the local Docker DB, and can target remotes with `--env staging|prod` plus `--commit --confirm <env>` and `OPENAI_EMBEDDINGS_KEY`.
