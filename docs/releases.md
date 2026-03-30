# Releases

This document is useful, but the TLDR looks something like this: every time you want to push the changes that you've made to prod, go to [nightcrawler releases](https://github.com/toddagriscience/nightcrawler/releases) and create a new release. Follow SemVer for creating a new version, and click "Generate release notes". Then click "create a release". As long as there were no issues in staging (AKA no issues on the last merge to main), this release is automated.

The one big thing that might go wrong is an unsynced database. As mentioned in other documentation in this folder, automated migrations to staging and production will silently fail if the migration involves possible data loss. This is the first thing that you should troubleshoot if you have a database issue in prod.

By the way, I generally don't use the hotfixes branch. Just make a PR and merge to main - this helps keep everything nice and clean.

## Creating a Release

1. Go to GitHub → Releases → Draft new release
2. Tag: `v1.2.3` (semantic versioning: major.minor.patch)
3. Description: Summary of changes
4. Publish

We use SemVer for versioning.

- Major (v1.0.0): Breaking changes
- Minor (v1.1.0): New features
- Patch (v1.0.1): Bug fixes

## Release Process

```
GitHub Release Created
    ↓
Database Validation
  - Clone production DB
  - Test schema changes
  - Blocks if data loss detected
    ↓ (if successful)
Deploy to Production
  - Build application
  - Deploy to Vercel
    ↓ (complete)
Site goes live
```

**Safety**: Migrations that remove columns/tables are blocked automatically.

## Hotfixes

For critical production bugs:

```bash
git checkout hotfixes
# Make fix
git push origin hotfixes
# Auto-deploys immediately (no validation)
```

⚠️ Only for emergencies. Merge back to `main` after.

## Troubleshooting

**Database validation fails**: Schema change would cause data loss. Adjust migration and create new release.

**Vercel deployment fails**: Check secrets in GitHub → Settings → Secrets. Verify `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` are set.

**Stuck workflow**: Check Actions tab for errors. Verify all secrets configured.

## Required Secrets

GitHub repo needs these set (Settings → Secrets):

| Secret              | Purpose                         |
| ------------------- | ------------------------------- |
| `PROD_DATABASE_*`   | Production database credentials |
| `DATABASE_PEM_CERT` | SSL certificate                 |
| `VERCEL_TOKEN`      | Vercel auth                     |
| `VERCEL_ORG_ID`     | Vercel organization             |
| `VERCEL_PROJECT_ID` | Vercel project ID               |
