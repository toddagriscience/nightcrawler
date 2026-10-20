# General IMP operations

General Integrated Management **Practices** live in `general_imp` and are used
by client catalog pages and inference search. Farm-specific Integrated Management
**Plans** live in `integrated_management_plan`; importing practices does not add
rows to that table. Internal **IMPs → Open general IMP catalog** shows the
imported practices at `/imps/catalog`. The existing `/imps` editor remains for
farm-specific plans.

## Source and organization

The source of truth is the **Intergrated Managment Practices (IMPs)** tab
(spelling intentional) in the existing Google workbook configured in
`scripts/lib/sheets-source.ts`. This is spreadsheet data, not a Markdown file.
The Body cell contains Markdown. Keep the columns in this order:

| Column | Value                                                |
| ------ | ---------------------------------------------------- |
| A      | Blank (the importer preserves this leading column)   |
| B      | Category tags, separated by commas                   |
| C      | Raw trigger expression; blank for reference concepts |
| D      | Optional descriptive heading                         |
| E      | Markdown advice body; required                       |

The catalog places simple `low @zinc`, `ideal @zinc`, `high @zinc` triggers beside
each other for the same nutrient and category tags. Missing ranges remain empty.
Reference concepts and compound/custom triggers are shown separately, verbatim.
This grouping does **not** evaluate soil analyses, validate agronomic advice, or
change the inference engine's trigger behavior.

## Review or edit a practice

Only authenticated active internal accounts may load, export or save practices.
Search covers headings, tags, triggers and body. Each card shows the database's
last-edit timestamp. The editor accepts heading, tags, trigger and Markdown body;
it does not ask for knowledge-row IDs or editable dates.

Saving regenerates the `text-embedding-3-large` search embedding using
`OPENAI_EMBEDDINGS_KEY` configured in the internal app environment. The catalog
row, embedding and source hash are saved together. A missing key/service failure
leaves the database unchanged. The app does not write placeholder embeddings.
Existing slugs are retained to preserve client URLs. A concurrent edit is rejected
with a reload message rather than silently overwriting it.

Dashboard edits are live database edits, **not spreadsheet writes**. Export a
catalog JSON snapshot before reconciling them back to the sheet. The export is a
review/backup artifact, not an importer input. Copy changed fields into the source
sheet before importing again; otherwise imports may overwrite changes or prune
dashboard-created rows. There is no dashboard delete/import button.

For a new practice, choose a descriptive heading and a unique URL-safe slug. The
importer derives the slug from the heading, or first category when heading is
blank. Duplicate bases receive an eight-character content hash suffix. Confirm
the identity against a dry run before creating the practice. Changing a source
heading/category or the body of a duplicated-base row can change its derived slug
on the next import; review client links when doing so.

## Import from CSV

Run these commands from `packages/db`. Configure the intended local database
using `LOCAL_DATABASE_*` from `env.example`; the local target is loopback-only.
Use an already prepared database with the current schema. These instructions do
not require generating or running migrations.

1. Download the source tab as CSV to `data/general-imps.csv` (gitignored), or use
   `--file /absolute/path/export.csv`.
2. Run `bun run db:import-imps` for a dry run. Review parsed count, titles, tags,
   triggers and bodies. A dry run never writes or embeds and does not query the
   target's current catalog/prune set.
3. After reviewing the source and target, run
   `bun run db:import-imps --commit` against your intended local database.
4. Reload the catalog; check representative low/ideal/high, reference and compound
   rows, and client `/imp/general/<slug>` pages. Repeat the same import to confirm
   unchanged rows do not request new embeddings.

Without `OPENAI_EMBEDDINGS_KEY`, local CLI imports warn and generate deterministic
placeholder vectors for development only. They do not provide meaningful
semantic search. To replace placeholders, clear the affected
`general_imp.source_content_hash` on your disposable local database and re-import
with the real key; unchanged source hashes otherwise skip embedding regeneration.
Never copy placeholder knowledge rows into a managed environment.

## Google Sheet and managed targets

`--source sheet` reads the configured tab directly using Google Application
Default Credentials and the read-only Sheets scope. The operator's identity must
already have access to the workbook; CSV import needs no Google credentials.
For example, `bun run db:import-imps --source sheet` performs a read-only dry run.
Neither workflow edits the spreadsheet or provisions accounts.

Managed imports use the existing `--env staging` or `--env prod` flags and require
the respective `STAGING_DATABASE_*` / `PROD_DATABASE_*` configuration plus the
verified database CA. An authorized remote commit additionally requires
`--confirm` matching the selected environment and a real `OPENAI_EMBEDDINGS_KEY`.
Review the source snapshot and intended target before any managed write; no
managed target is needed to test this workflow locally.

The importer upserts by slug and prunes rows absent from the source. Fewer than
five parsed practices refuses a commit. Pruning more than 20% of existing rows
refuses **before any upsert**, unless `--allow-large-prune` is explicitly supplied
for a reviewed intentional removal. Each practice and its knowledge row are
transactional, but the whole import is not: a later service/database failure can
leave earlier practices updated. Correct the failure and rerun the same complete
source. Keep a reviewed source/export snapshot for recovery.
