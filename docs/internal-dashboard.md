# Internal Dashboard

This document explains the internal dashboard application and how to use it.

## Overview

The Internal Dashboard is a separate Next.js application for Todd Agriscience team members to:

- Manage user accounts
- View and manage orders
- Access database information
- Perform administrative tasks

**Not the public site** - This is only for internal staff.

## Access

### Requirements

- Internal account in database (`internal_account` table)
- Supabase authentication
- Active session

### Login

1. Go to dashboard URL (set up in Vercel)
2. Sign in with Supabase credentials
3. Must have internal account record (ask team to create one)

### Who Has Access

Internal team members only - database verifies that the account that's trying to log in also exists on the internal accounts database table on every page load.

## Deployment

The dashboard is a **separate Vercel project** from the main site:

- Deployed independently
- Same database as main site
- Own environment variables in Vercel
- Own deployment workflows

### Environment Variables

Required in Vercel (project settings):

```
DATABASE_URL=postgresql://...
DATABASE_PEM_CERT=(SSL certificate)
NEXT_PUBLIC_SUPABASE_PROJECT_ID=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

Same as main site but separate Vercel project configuration.

## Architecture

### Key Points

- **Dynamic rendering**: All routes force dynamic (no static generation)
- **Database-driven**: Fetches data at request time
- **Auth-protected**: Every page checks internal account status
- **Same database**: Shares database with main site

**Why dynamic?**: Turborepo build-time database fetching causes issues, and I'm too lazy to fix this. Fetching at request time ensures current data and avoids build complications.

## Features

### User Management

View and manage internal and external user accounts.

**Location**: `apps/internal/src/app/users/`

### Order Management

View customer orders, status, and details.

**Location**: `apps/internal/src/app/orders/`

### Database Admin

Direct database access through Drizzle Studio (see [Database Access](./database-access.md)).

### Analytics

Internal dashboards and metrics.

**Location**: `apps/internal/src/app/analytics/`

## Development

### Running Locally

```bash
bun run dev:internal
```

Runs on port 3100 (different from main site on 3000).

### Structure

```
apps/internal/
├── src/
│   ├── app/              # Dashboard pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── users/        # User management
│   │   ├── orders/       # Order management
│   │   └── ...
│   ├── components/       # Dashboard components
│   └── lib/              # Utilities
├── package.json
└── vercel.json
```

### Making Changes

1. Edit component/page in `apps/internal/src/app/`
2. Changes reload automatically in development
3. Test locally
4. Push to GitHub
5. Automatic preview deployment on PR
6. Deploy on release

## Important Notes

### Same Database

- Reads from same database as main site
- Can modify any data
- Be careful with production data
- No separate staging database for internal dashboard

### Authentication

- Uses Supabase authentication
- Shares auth system with main site
- Internal account table separate from users table
- Only internal accounts can access

### Performance

- All routes are dynamic
- No caching of pages
- Always fetches fresh data
- Slower than static pages but ensures current data

### Limitations

- No offline functionality
- Requires internet connection
- No sync with main site navigation
- Database changes reflect immediately

## Accessing Dashboard Data

### Via Database Tools

```bash
# View internal dashboard database via Drizzle Studio
bunx drizzle-kit studio --config packages/db/drizzle-local.config.ts
```

### Via Application

Access features through dashboard UI:

- User account management
- Order viewing and editing
- Administrative functions

### Permissions

Only internal accounts have access. To add an internal account:

```bash
bun run db:create-admin-farm-user
```

## Troubleshooting

### Can't log in

- Verify internal account exists: `bun run db:create-admin-farm-user`
- Check Supabase project ID and key are correct
- Verify account email is in `internal_account` table

### Dashboard won't load

- Check `DATABASE_URL` is set in Vercel
- Verify `DATABASE_PEM_CERT` is set (if using SSL)
- Check database connection
- Review Vercel deployment logs

### Changes not showing

- Dashboard pages are dynamic (always fresh data)
- Hard refresh browser (Cmd+Shift+R)
- Check if changes were actually saved to database

### Deployment failed

- Check Vercel logs for error
- Verify all environment variables set
- Try manual redeploy: Vercel → Deployments → Redeploy

## Separate from Main Site

**Different deployment**:

- Main site: `VERCEL_PROJECT_ID`
- Internal dashboard: `VERCEL_PROJECT_ID_INTERNAL` (separate)

**Different domains**:

- Main site: toddagriscience.com
- Dashboard: internal.toddagriscience.com (or configured)

**Same database**:

- Both read/write to same PostgreSQL database
- Coordinate changes carefully

**Separate code**:

- `/apps/site/` - Main application
- `/apps/internal/` - Dashboard application
- Changes to one don't affect the other automatically

## Questions?

For dashboard issues, contact the development team.
