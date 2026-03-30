# Database Access and Management

This document explains how to access and manage the database, primarily using tooling from Drizzle.

## Database quirks

Or all the weird shit that I did to the database but never told anyone about.

For context, there are 3 databases: local, staging, and production. Both staging and production run on DigitalOcean.

### Staging

There are two users in staging: `doadmin` and `testing`. Their passwords can both be found on DigitalOcean. `testing` is the user that accesses the database from Vercel. This user is automatically disconnected after a few seconds. If you need to modify the database via Drizzle Studio, access the database with `doadmin` instead.

For context, the user is disconnected after a few seconds to help with some issues that seem to arise with Drizzle/Next.js holding database connections for upwards of 5 minutes. I was never able to figure this out, so instead they're just booted off the database after a few seconds.

## Production

A similar paradigm is implemented in production, but instead of `doadmin` and `testing`, there's `studio-access` and `vercel-access`. `doadmin` still exists, but generally isn't used for sake of simplicity. The password for `vercel-access` can be found in the environment variables on Vercel.

## For Non-Technical Users

**Don't need to run database commands**, but helpful to know:

- **Drizzle Studio**: Visual tool to view data (like Excel for database)
- **Local database**: Running on your computer, test data only
- **Migrations**: Automatic updates to database structure
- **Backups**: Done automatically for staging/production via DigitalOcean

## Quick Start

### Drizzle Studio (GUI Tool)

Opens a web-based database browser:

```bash
# Local database
bunx drizzle-kit studio --config packages/db/drizzle-local.config.ts

# Staging database
bunx drizzle-kit studio --config packages/db/drizzle-staging.config.ts

# Production (requires secrets)
bunx drizzle-kit studio --config packages/db/drizzle-prod.config.ts
```

A browser window opens with an interactive database explorer. You can:

- Browse tables and records
- Run SQL queries
- Export data
- View schema

## Local Database Commands

In the past, my workflow has been the following:

```bash
bun run db:local:up
bun run db:local:init

# I'm too lazy to deal with migrations, so:

bun run db:local:reset
```

### Start/Stop

```bash
bun run db:local:up          # Start Docker database
bun run db:local:down        # Stop Docker database
bun run db:local:reset       # Complete reset (down → wipe → up → migrate → seed)
```

### Migrations & Seeding

```bash
bun run db:local:migrate     # Apply pending migrations
bun run db:local:seed        # Seed with starter data
bun run db:local:wipe        # Erase all data (keeps schema)
bun run db:local:init        # Migrate + seed
```

### Special Scripts

```bash
bun run db:create-admin-farm-user    # Create test admin account
bun run db:seed-knowledge            # Seed knowledge/content
bun run db:add-seed-product          # Add a seed product
```

## Using Drizzle in Code

Query the database from application code:

```typescript
// In server actions or API routes
import { db } from '@nightcrawler/db';
import { users } from '@nightcrawler/db/schema';
import { eq } from 'drizzle-orm';

// SELECT
const userList = await db.select().from(users).limit(10);

// WHERE
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))
  .limit(1);

// INSERT
await db.insert(users).values({
  email: 'new@example.com',
  name: 'John Doe',
});

// UPDATE
await db.update(users).set({ name: 'Jane' }).where(eq(users.id, userId));

// DELETE
await db.delete(users).where(eq(users.id, userId));
```

See `/packages/db/src/queries/` for pre-built query examples.

## Environment Variables

```bash
# Local (for local Docker database)
LOCAL_DATABASE_HOST=localhost
LOCAL_DATABASE_PORT=5432
LOCAL_DATABASE_USER=postgres
LOCAL_DATABASE_PASSWORD=Test123!
LOCAL_DATABASE_DATABASE=postgres

# Staging (for CI/CD)
STAGING_DATABASE_HOST=staging-host.com
STAGING_DATABASE_PORT=5432
STAGING_DATABASE_USER=postgres
STAGING_DATABASE_PASSWORD=****
STAGING_DATABASE_DATABASE=nightcrawler_staging

# Production (for CI/CD)
PROD_DATABASE_HOST=prod-host.com
PROD_DATABASE_PORT=5432
PROD_DATABASE_USER=postgres
PROD_DATABASE_PASSWORD=****
PROD_DATABASE_DATABASE=nightcrawler_production
```

You'll need to have the `DATABASE_PEM_CERT` to connect to either staging or prod. Alternatively, you can run with `NODE_TLS_REJECT_UNAUTHORIZED=0`. This is _extremely_ insecure. Do not run with this in production.

## Troubleshooting

For the love of all that is holy, do not try to reset either the staging or production database. (You're welcome to wipe and reinitialize the local database as much as you like though).

### Container won't start

```bash
docker ps | grep nightcrawler           # Check if running
docker rm -f nightcrawler-postgres-local # Force remove
bun run db:local:up                      # Try again
```

### Can't connect via psql

```bash
# Verify container is running
docker ps | grep nightcrawler

# Check port is open
lsof -i :5432

# Restart container
bun run db:local:down && bun run db:local:up
```

### Drizzle Studio connection fails

```bash
# Verify environment variables in .env
cat packages/db/.env | grep LOCAL_DATABASE

# Test connection manually
bunx drizzle-kit status --config packages/db/drizzle-local.config.ts
```

### Database locked/stuck

```bash
# Reset everything
bun run db:local:reset
```
