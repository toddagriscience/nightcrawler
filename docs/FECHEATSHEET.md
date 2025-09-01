# Copyright Todd LLC, All rights reserved

# ⚡ Quick Reference Guide

_Read [CONTRIBUTING.md](../.github/CONTRIBUTING.md) first. This is your quick reminder cheat sheet._

## 🚀 Quick Commands

```bash
# Setup (first time)
npm install && npm run validate

# Daily workflow
npm run dev                    # Start development
npm run validate              # Before committing
```

## Starting New Feature

### 1. Create feature branch (from main):

```bash
git checkout main && git pull origin main
git checkout -b feature/your-feature-name
```

- **Branch naming:** `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`

### 2. Write your code

**For new pages:**

```bash
# Create page directory
mkdir src/app/[locale]/your-page

# Create page
touch src/app/[locale]/your-page/page.tsx

# Create page-specific components (slice architecture)
mkdir src/app/[locale]/your-page/components

# Create page/component types if necessary (slice architecture)
touch src/app/[locale]/your-page/components/component.ts # For components

```

**For shared components:**

```bash
# Create in common directory
mkdir src/components/common/your-component
touch src/components/common/your-component/your-component.tsx
touch src/components/common/your-component/your-component.test.tsx
touch src/components/common/your-component/your-component.stories.tsx

# Add to common index (for shared components)
# Add export to src/components/common/index.ts:
echo "export { default as YourComponent } from './your-component/your-component';" >> src/components/common/index.ts
```

**Component template:**

```tsx
// Copyright Todd LLC, All rights reserved.

import { useTranslations } from 'next-intl';
import { yourprop } from ./types/yourprop

/**
 * Your component description
 * @param {Props} props - Component props
 * @returns {JSX.Element} - The component
 */
export default function YourComponent({ title, variant = 'primary' }: Props) {
  const t = useTranslations('YourNamespace');

  return (
    <div
      className={`your-classes ${variant === 'primary' ? 'primary-styles' : 'secondary-styles'}`}
    >
      <h1>{t('title')}</h1>
      <p>{title}</p>
    </div>
  );
}
```

### 2.5 Make your translations

1. Add to appropriate page file: `src/messages/{page}/en.json`
2. Add Spanish version: `src/messages/{page}/es.json`
3. Add new page/file into `/src/i18n/message-files.ts`:

   ```tsx
   const messageFiles = [
     'common',
     'header',
     'more previous files',
     'your new page', //ADD NEW PAGE HERE
   ];
   ```

4. Use in component:
   ```tsx
   const t = useTranslations('YourNamespace');
   return <h1>{t('title')}</h1>;
   ```

### 3. Make your commit with proper format

**Format:** `type: description`

**Quick examples:**

```bash
git commit -m "feat: add login form"
git commit -m "fix: mobile navigation overflow"
git commit -m "refactor: simplify theme context"
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 4. Push and create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR through GitHub UI
# Fill out PR template completely
# Request review from team members
```

**PR must target `main` branch!**

## 🔧 Git Hooks Validation

**Pre-commit** (when you commit): Husky runs `lint-staged` on staged files only:

- **JS/TS files**: `eslint --fix` + `prettier --write`
- **Other files**: `prettier --write`

**Pre-push** (when you push): Husky runs full `npm run validate`:

1. **Format check** (`npm run format:check`) - Prettier validation
2. **Type check** (`npm run type-check`) - TypeScript validation
3. **Lint** (`npm run lint`) - ESLint rules enforcement
4. **Test** (`npm run test`) - Unit tests execution
5. **Build** (`npm run build`) - Production build verification

**If any pre-push step fails, your push is blocked.** Use the quick fixes below to resolve issues. If they don't work, check the terminal to see what issues exist and fix them manually

## 🚨 Quick Fixes

```bash
# Format issues
npm run format

# Lint issues
npm run lint:fix

# Type errors
npm run type-check

# Build issues
rm -rf .next && npm run build
```

## 🔍 When Things Break

1. Check if `main` branch works: `git checkout main && npm run validate`
2. Rebase your branch: `git rebase main`
3. Clear cache: `rm -rf .next node_modules && npm install`
4. Still broken? Check recent commits or ask for help
