# Vercel Deployment

For 99% of your issues, just check the logs in Vercel. If needbe, feed it to Claude. If it's a database issue, _always_ google the error code from Postgres (if there is one).

## Projects

| Project      | App                    | URL                         | Purpose              |
| ------------ | ---------------------- | --------------------------- | -------------------- |
| **Site**     | @nightcrawler/site     | https://toddagriscience.com | Main app + marketing |
| **Internal** | @nightcrawler/internal | (configured)                | Admin dashboard      |

Both are separate Vercel projects, same database.

## Environment Variables

All stored **in Vercel** (not in repo).

### Set Via Vercel Dashboard

1. Select project
2. Settings → Environment Variables
3. Add for each environment (Production, Preview, Development)

### Required for Site

```
DATABASE_URL=postgresql://...
DATABASE_PEM_CERT=(SSL cert)
NEXT_PUBLIC_SUPABASE_PROJECT_ID=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
OPENAI_EMBEDDINGS_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
(see apps/site/env.example for full list)
```

### Required for Internal

```
DATABASE_URL=postgresql://...
DATABASE_PEM_CERT=(SSL cert)
NEXT_PUBLIC_SUPABASE_PROJECT_ID=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

## Deployments

### Release

```
GitHub Release Created
  ↓
Database Validation
  ↓ (if successful)
Vercel Deploy (vercel-deploy-on-release.yml)
  - Build application
  - Deploy to production
```

### Hotfix

```
Push to 'hotfixes' branch
  ↓
Immediate deploy (no validation)
  - Use for emergencies only
  - Merge back to main after
```

### PR Preview

- Automatic on every PR
- Vercel URL in PR comments
- Uses Preview environment variables

## GitHub Secrets for CI/CD

```
VERCEL_ORG_ID=...          # Your Vercel org ID
VERCEL_PROJECT_ID=...      # Site project ID
VERCEL_TOKEN=...           # Vercel auth token
```

(Store in repo Settings → Secrets)

## Local Development

```bash
# apps/site/.env (copy from env.example)
DATABASE_URL=postgresql://postgres:Test123!@localhost:5432/postgres
LOCAL_DATABASE_HOST=localhost
# ... other env vars

bun run dev:site      # Start on port 3000
```

## Configuration Files

### apps/site/vercel.json

```json
{
  "buildCommand": "next build",
  "installCommand": "bun i",
  "env": {
    "NEXT_TELEMETRY_DISABLED": "1"
  }
}
```

### apps/internal/vercel.json

```json
{
  "buildCommand": "next build",
  "installCommand": "bun i"
}
```

## Troubleshooting

| Problem                        | Solution                                                             |
| ------------------------------ | -------------------------------------------------------------------- |
| Build fails in Vercel          | Run `bun run build` locally. Missing env var? Check Vercel settings. |
| Works locally, fails in Vercel | Environment variable missing or different value                      |
| Old version still live         | Hard refresh (Cmd+Shift+R). Clear CDN cache if needed.               |
| DB won't connect               | Verify `DATABASE_URL` set. Verify `DATABASE_PEM_CERT` set (if SSL).  |

## Manual Redeploy

I use this when I'm either a) adding an environment variable or b) trying to troubleshoot something. There's no harm in creating another deployment directly on Vercel though.

1. Vercel dashboard → Deployments
2. Find last successful deployment
3. Click "Redeploy"

Or create new release for proper deployment.
