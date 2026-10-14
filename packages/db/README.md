# Database

The general database for nightcrawler. Executable DB scripts live in `scripts/`, and helpful environment variables can be found in `env.example`.

Repo-wide conventions live in [`AGENTS.md`](/AGENTS.md). **Do not create or run migrations** — in particular, do not run `bunx drizzle-kit generate`.

## Public API

Consumers import from `@nightcrawler/db`. The surface is the `exports` map in `package.json` (`.`, `./queries`, `./schema`, `./schema/*`, `./types`, and a handful of `./utils/*` modules). Adding a new consumer-facing module means adding an entry there.

## Commands

### Local Postgres 18 (Docker Compose)

These are proxied from the repository root, so `bun run db:local:up` works from anywhere.

- `bun run db:local:up` - Start local Postgres via `docker-compose.yml`
- `bun run db:local:down` - Stop and remove the local services
- `bun run db:local:migrate` - Apply Drizzle migrations to local Postgres
- `bun run db:local:seed` - Seed local Postgres with starter data
- `bun run db:local:init` - `up` → `migrate` → `seed`
- `bun run db:local:reset` - Recreate the local database from scratch
- `bun run db:local:wipe` - Drop local data

### Data loading

Also proxied from the root:

- `bun run db:seed-knowledge` - Seed knowledge-base articles
- `bun run db:create-admin-farm-user` - Create an admin farm user

Only available from within `packages/db`:

- `bun run db:add-seed-product` - Add a seed product
- `bun run db:import-varieties` - Import the variety inventory (see below)
- `bun run db:import-imps` - Import general integrated management plans
- `bun run db:migrate:remote` - Apply migrations to a remote database

### Quality

- `bun run lint`, `bun run type-check`, `bun run test`

This workspace defines no `build` or `format:check` script, so the root `bun run build` does not cover it.

## Variety inventory import

The `seed_crop` / `seed_variety` tables are a regenerable mirror of the "Variety Inventory" Google Sheet (the Sheet is the source of truth). To rebuild after a Sheet edit:

1. In Google Sheets: **File → Download → Comma-separated values (.csv)** and save to `packages/db/data/variety-inventory.csv` (gitignored).
2. Dry run (writes nothing): `bun run db:import-varieties`
3. Commit to the local DB: `bun run db:import-varieties --commit`

The importer upserts by slug and prunes rows no longer present in the Sheet, so re-running fully reconciles the DB to the current export.
