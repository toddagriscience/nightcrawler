# Database

The general database for nightcrawler. Executable DB scripts live in `scripts/`, and helpful environment variables can be found in `env.example`.

## Variety inventory import

The `seed_crop` / `seed_variety` tables are a regenerable mirror of the "Variety Inventory" Google Sheet (the Sheet is the source of truth). To rebuild after a Sheet edit:

1. In Google Sheets: **File → Download → Comma-separated values (.csv)** and save to `packages/db/data/variety-inventory.csv` (gitignored).
2. Dry run (writes nothing): `bun run db:import-varieties`
3. Commit to the local DB: `bun run db:import-varieties --commit`

The importer upserts by slug and prunes rows no longer present in the Sheet, so re-running fully reconciles the DB to the current export.
