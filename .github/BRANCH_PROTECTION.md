# Copyright Todd LLC, All rights reserved

# Branch Protection Setup for Dependabot Auto-Approval

This document outlines the recommended branch protection rules to enable Dependabot auto-approval while maintaining security and code quality.

## Recommended Branch Protection Rules

### For `main` branch:

```yaml
# GitHub Settings > Branches > Add rule
Branch name pattern: main

✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require review from code owners
  ❌ Restrict pushes that create files that have a matching path
  ❌ Allow specified actors to bypass required pull requests

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Required status checks:
    - Test & Lint
    - Build Application

✅ Require conversation resolution before merging
✅ Require signed commits
✅ Require linear history
✅ Require deployments to succeed before merging (optional)

❌ Lock branch
❌ Do not allow bypassing the above settings
```

### For `dev` branch:

```yaml
# GitHub Settings > Branches > Add rule
Branch name pattern: dev

✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require review from code owners
  ❌ Allow specified actors to bypass required pull requests

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Required status checks:
    - Test & Lint
    - Build Application

✅ Require conversation resolution before merging
❌ Require signed commits (optional for dev)
❌ Require linear history (optional for dev)

❌ Lock branch
❌ Do not allow bypassing the above settings
```

## Dependabot Configuration

The current setup provides these behaviors:

### Auto-Approval (`.github/workflows/dependabot-auto-approve.yml`)

- ✅ **Patch updates**: Auto-approved immediately
- ✅ **Minor updates**: Auto-approved immediately
- ❌ **Major updates**: Requires manual review (with warning comment)

### Auto-Merge (`.github/workflows/dependabot-auto-merge.yml`)

- ✅ **Patch updates**: Auto-merged after CI passes (except critical tools)
- ❌ **Minor updates**: Auto-approved but requires manual merge
- ❌ **Major updates**: Requires manual review and merge
- ❌ **Critical tools** (ESLint, Prettier, TypeScript): Always require manual merge

### Critical Tools (Always Manual)

These packages always require manual review due to their impact on code quality:

- `eslint*`
- `prettier`
- `typescript`
- `@types/*` (when major updates)

## Workflow Process

### 1. Dependabot Creates PR

- Dependabot creates PR with appropriate labels
- Assigns to `@toddagriscience/devops-team`
- Requests review from `@toddagriscience/core-team`

### 2. Auto-Approval Workflow

- Runs immediately when PR is created
- **Patch/Minor**: Auto-approves
- **Major**: Adds warning comment, no approval

### 3. CI/CD Pipeline

- Standard CI checks run (lint, test, build)
- Must pass before any merge can happen

### 4. Auto-Merge Workflow

- Runs after CI completes successfully
- **Patch only**: Auto-merges with squash
- **Everything else**: Adds comment explaining manual merge needed

### 5. Manual Review (when needed)

- Team reviews changelog and breaking changes
- Tests locally if necessary
- Manually merges when satisfied

## Benefits of This Setup

### ✅ Automation

- **90% of updates** (patches) are fully automated
- **Reduces maintenance burden** significantly
- **Faster security updates** for patch releases

### ✅ Safety

- **Major updates** always require human review
- **Critical tools** always require manual verification
- **All updates** must pass CI before merge
- **Branch protection** prevents direct pushes

### ✅ Visibility

- **Clear comments** explain what's happening
- **Proper labeling** for easy filtering
- **Team assignments** ensure accountability
- **Audit trail** of all automated actions

## Manual Override

If you need to manually handle a Dependabot PR:

1. **Disable auto-merge**: Comment `/dependabot ignore this update`
2. **Review changes**: Check changelog and breaking changes
3. **Test locally**: Pull branch and test if needed
4. **Merge manually**: Use GitHub UI or CLI

## Troubleshooting

### Auto-approval not working?

- Check that `dependabot[bot]` has necessary permissions
- Verify branch protection allows auto-approval
- Check workflow logs in Actions tab

### Auto-merge not working?

- Ensure CI is passing first
- Check that branch is up-to-date
- Verify no merge conflicts exist

### Too many manual merges?

- Adjust the auto-merge conditions in the workflow
- Consider allowing minor updates to auto-merge
- Review the critical tools list

## Security Considerations

- **GitHub token** has minimal required permissions
- **Auto-merge** only happens after CI passes
- **Major updates** always require human review
- **Critical tools** updates are never automated
- **Branch protection** prevents bypassing rules

This setup provides a good balance of automation and safety for dependency management.
