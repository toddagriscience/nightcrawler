# Database Migrations

Managed by Drizzle ORM with automatic validation before deployment.

## How Migrations Work

1. **Edit schema** in `/packages/db/src/schema/`
2. **Test locally**: `bun run db:local:migrate`
3. **Commit files** (auto-generated)
4. **Push to GitHub**
5. **Validation** runs automatically (see below)
6. **Applied to staging** on main push
7. **Applied to production** on release

Migrations prevent data loss - unsafe changes (removing columns) are blocked.

## Creating a Migration

### Step 1: Update Schema

Edit table in `/packages/db/src/schema/`:

```typescript
// Example: Add new column
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name'), // NEW
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Step 2: Test

```bash
bun run db:local:migrate
```

Drizzle generates migration automatically in `/packages/db/drizzle/`.

### Step 3: Verify

```bash
# Check what was generated
ls -la packages/db/drizzle/

# Reset if needed
bun run db:local:reset
```

### Step 4: Commit

```bash
git add packages/db/drizzle/
git commit -m "feat: add user name field"
```

## Safe vs Unsafe Changes

| Change                    | Safe? | Example                        |
| ------------------------- | ----- | ------------------------------ |
| Add column (with default) | ✅    | `text('field').default('x')`   |
| Add table                 | ✅    | New table definition           |
| Add index                 | ✅    | `index('idx').on(table.field)` |
| Make optional             | ✅    | Remove `.notNull()`            |
| Remove column             | ❌    | Data loss!                     |
| Remove table              | ❌    | Data loss!                     |
| Require without default   | ❌    | Fails on existing NULL rows    |

**Validation blocks unsafe changes** - adjust migration and retry.

## Automatic Validation

### On Main Push

```
pr-database-compatibility-check.yml
  ↓
Clone staging DB
  ↓
Test schema
  ↓ (if safe)
Push to staging
```

### On Release

```
release-database-compatibility-check.yml
  ↓
Clone production DB
  ↓
Test schema
  ↓ (if safe)
Push to production
  ↓ (if successful)
Deploy to Vercel
```

If validation fails, check logs and adjust schema.

## Managing Migrations

### View Applied Migrations

```bash
# Local database
bunx drizzle-kit status --config packages/db/drizzle-local.config.ts

# In database
psql postgresql://postgres:Test123!@localhost:5432/postgres -c \
  "SELECT * FROM drizzle.__drizzle_migrations__"
```

### Common Issues

| Problem                   | Solution                                              |
| ------------------------- | ----------------------------------------------------- |
| Migration stuck           | Run `bun run db:local:reset`                          |
| Unsure what changed       | Check `/packages/db/drizzle/`                         |
| Validation fails          | Review error, adjust schema, create new release       |
| Wrong migration generated | Delete from drizzle folder, adjust schema, regenerate |

## Rollback

Drizzle doesn't have rollback. For mistakes:

1. Create new migration fixing it
2. Test locally
3. Create new release or push to main
4. Normal validation will run

## Files

```
packages/db/
├── src/schema/           # Edit these files
│   ├── user.ts
│   ├── mineral.ts
│   └── ...
└── drizzle/              # Auto-generated (don't edit)
    ├── 0001_init.sql
    ├── 0002_add_field.sql
    └── meta/_journal.json
```
