# GitHub Actions and Workflows

Automated workflows in `./.github/workflows/`. Most of these pretty simple - this documentation still exists to provide some context though.

## Main Workflows

| Workflow                                 | Trigger                  | Purpose                          |
| ---------------------------------------- | ------------------------ | -------------------------------- |
| **build**                                | PR, push to main         | Install dependencies             |
| **code-quality**                         | PR, push to main         | Lint, format check               |
| **testing**                              | PR, push to main         | Run unit tests                   |
| **security**                             | PR, push to main         | Dependency vulnerability scan    |
| **pr-database-compatibility-check**      | Push to main             | Validate schema on staging       |
| **release-database-compatibility-check** | Release created          | Validate schema on production    |
| **vercel-deploy-on-release**             | After release validation | Deploy to production             |
| **vercel-deploy-on-hotfix-push**         | Push to hotfixes         | Emergency production deploy      |
| **dependabot-auto-approve**              | Dependabot PR            | Auto-approve minor/patch updates |

## PR/Push Workflows

Run on every PR and push to `main`:

- ✅ Must pass to merge PR
- ✅ Blocks if any check fails
- ⏱️ ~15 minutes total

### Checks

1. **build**: Can we install dependencies and build the application?
2. **code-quality**: ESLint, Prettier, no secrets
3. **testing**: Unit tests pass?
4. **security**: `bun audit` for high-severity vulns
5. **pr-database-compatibility-check** (main only): Schema safe for staging?

## Release Workflows

Triggered when you create a GitHub Release:

1. **release-database-compatibility-check**
   - Clones production database
   - Tests schema changes
   - Fails if data loss detected
   - Pushes schema to production

2. **vercel-deploy-on-release** (on success)
   - Builds application
   - Deploys to Vercel production

## Hotfix Workflow

Push to `hotfixes` branch:

- ⚠️ No validation (for speed)
- Deploy immediately to production
- Merge back to `main` after

This is rarely used (very literally once in a blue moon). Usually I just make a new PR, and the fix that we need is shipped in less than an hour.

## Monitoring

### Check Status

1. GitHub → Actions tab
2. Click workflow run
3. See status for each job

### View Logs

1. Click job name
2. Expand step to see output
3. Search for errors

## Required Secrets

If one of these secrets is required to be placed in GitHub actions, it's already there.

| Secret               | Purpose                       |
| -------------------- | ----------------------------- |
| `STAGING_DATABASE_*` | Staging DB access (5 vars)    |
| `PROD_DATABASE_*`    | Production DB access (5 vars) |
| `DATABASE_PEM_CERT`  | SSL certificate               |
| `VERCEL_TOKEN`       | Vercel authentication         |
| `VERCEL_ORG_ID`      | Vercel org ID                 |
| `VERCEL_PROJECT_ID`  | Vercel project ID             |

## Common Issues

| Problem                   | Solution                               |
| ------------------------- | -------------------------------------- |
| Build fails               | Run `bun i` locally - dependency issue |
| Code quality fails        | Run `bun lint:fix && bun format`       |
| Tests fail                | Run `bun test` locally to debug        |
| Database validation fails | Schema change unsafe (would lose data) |
| Vercel deploy fails       | Check secrets configured in GitHub     |

## Disabling Workflows

Edit `./.github/workflows/workflow-name.yml` and comment out the `on:` trigger.

Don't do this unless absolutely necessary.
