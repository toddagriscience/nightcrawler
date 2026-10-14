# AGENTS.md

This file is the single source of truth for repo-wide conventions.

Workspace docs cover only what is specific to that workspace and must not restate
the rules below:

- [`apps/site/CLAUDE.md`](apps/site/CLAUDE.md) — marketing site + customer platform
- [`README.md`](README.md) and each workspace's `README.md` — setup and commands

If a workspace doc contradicts this file, this file wins. Fix the workspace doc.

## Repository layout

| Workspace       | Package                  | What it is                                          |
| --------------- | ------------------------ | --------------------------------------------------- |
| `apps/site`     | `@nightcrawler/site`     | Next.js marketing site + customer platform          |
| `apps/internal` | `@nightcrawler/internal` | Next.js internal dashboard for client advisors      |
| `apps/sanity`   | `@nightcrawler/sanity`   | Sanity Studio (CMS)                                 |
| `packages/db`   | `@nightcrawler/db`       | Shared Drizzle schema, queries, migrations, tooling |

## Commands

Run `bun` commands from the repository root unless a workflow explicitly needs a
workspace directory.

| Command                | Where | What it does                                              |
| ---------------------- | ----- | --------------------------------------------------------- |
| `bun install`          | root  | Install all workspaces                                    |
| `bun run dev`          | root  | Every dev server in parallel                              |
| `bun run dev:site`     | root  | Site only (port 3000)                                     |
| `bun run dev:internal` | root  | Internal dashboard only (port 3100)                       |
| `bun run dev:sanity`   | root  | Sanity Studio only                                        |
| `bun run validate`     | root  | `format:check` → `type-check` → `lint` → `test` → `build` |
| `bun run type-check`   | root  | `tsc --noEmit` across workspaces                          |
| `bun run lint`         | root  | ESLint across workspaces                                  |
| `bun run test`         | root  | Vitest across workspaces                                  |
| `bun run format`       | root  | Prettier write                                            |
| `bun run knip`         | root  | Dead-code / unused-dependency report                      |
| `bun run storybook`    | root  | Storybook for `apps/site` (port 6006)                     |

`bun run ci` and `bun run lint:fix` exist **only inside `apps/site`**, not at the
root. Run them from `apps/site`.

Turbo silently skips a workspace that does not define the script being run.
Today `apps/sanity` has no `lint`, `test`, or `format:check`; `apps/internal` has
no `test`; `packages/db` has no `build`. A green `bun run validate` does not mean
every workspace was checked.

## Making a change

- Follow feature-sliced design. Keep components local to the page or feature that
  uses them; promote to a shared location only when they are genuinely used across
  the application.
- Prefer many small, understandable files over a few large ones.
- Within a slice, use the conventional file names: interfaces and types in
  `types.ts`, generic utilities in `utils.ts`, server actions in `actions.ts`,
  components in a `components/` folder. Anything else gets its own descriptively
  named file.
- Avoid extracting a helper function unless it is used 5+ times in a file or 10+
  times across the repository.
- Maintain strict TypeScript throughout. Do not use `any`.
- Write tests for new functionality.
- Run `bun run format` at the end of every change.

### Naming

- **Files and directories are kebab-case.** No exceptions beyond generated files
  (Drizzle migrations under `packages/db/drizzle/`) and conventional
  SCREAMING-CASE docs (`README.md`, `AGENTS.md`, `CLAUDE.md`).
- **Identifiers are not filenames.** React components, types, interfaces, and
  classes are PascalCase; functions and variables are camelCase. A file named
  `hero.tsx` exports a component named `Hero`.

### Imports

Both Next.js apps map `@/*` to their own `src/*`. Use the alias for all in-app
imports rather than long relative paths.

### Copyright

Every source file begins with:

```ts
// Copyright © Todd Agriscience, Inc. All rights reserved.
```

This is enforced by the `license-header/header` ESLint rule and will fail lint.

### Documentation

Document every exported interface, function, class, and constant with JSDoc.
Private helper functions, private components, and `*.stories.tsx` files are
exempt.

## Frontend

- Prioritize accessibility. Follow WCAG guidelines and verify with a screen
  reader. Maintain ARIA attributes and semantic HTML.
- Prioritize performance: animations, images, and bundle size.
- Prioritize server-side rendering where it fits, but do not sacrifice code
  quality to move more work to the server.
- Support multi-language architecture from the start; use `next-intl` for any
  user-facing text on the marketing site.
- **Form state:** use `useForm()` (react-hook-form) rather than hand-rolling
  `useState` / `useTransition` around a form.
- **Non-form local state:** `useState` / `useReducer`.
- **Cross-cutting state:** React Context (theme, locale).
- Use `requestAnimationFrame` for scroll and animation effects.
- Always add a `layout.tsx` with appropriate, minimum metadata to a new page.

## Backend

Log through the workspace's logger module. Never call `console.*` — see below.

## Database

Do not create or run migrations. In particular, do not run
`bunx drizzle-kit generate`.

`packages/db` exposes its public API through the `exports` map in its
`package.json`. Adding a new consumer-facing module means adding an entry there.

## Logging

Never call `console.*` in application or library source. Import the logger for
the workspace you are in:

| Workspace       | Module                        | Exports                        |
| --------------- | ----------------------------- | ------------------------------ |
| `apps/site`     | `@/lib/logger`                | named `logger` **and** default |
| `apps/internal` | `@/lib/logger`                | named `logger` **and** default |
| `packages/db`   | `src/utils/logger` (relative) | named `logger` **only**        |

`packages/db` has no default export — `import logger from '.../utils/logger'`
will not work there.

`console.*` is permitted **only** in `scripts/` directories, test files, test
setup files, and Storybook configuration, where it is the intended output
channel.

### Levels

- `logger.error` **always emits**, in every environment.
- `logger.warn`, `logger.info`, and `logger.debug` only emit when the logger
  decides the environment is development. They are silent under `NODE_ENV=test`.
- `apps/site`'s check is a heuristic — besides `NODE_ENV` it also inspects
  `PORT`, `HOSTNAME`, and the browser hostname. Do not rely on these levels
  being silent in production, and do not rely on them being visible either.
- **If a message must be visible in production, it has to go through
  `logger.error`.** Use it for problems that genuinely need attention.
- `packages/db`'s logger exposes only `error`, `warn`, and `info`.

```ts
import { logger } from '@/lib/logger';

// Development-only debug information
logger.warn('Component state changed:', { newState });

// Always emitted — reserve for problems needing attention
logger.error('API call failed:', error);
```

## Testing

At minimum, a page should have a test proving it renders. Aim higher where it is
cheap to do so. New `apps/site` components require both a unit test and a
Storybook story.

## Before you change anything

1. Run `bun run validate` to confirm a clean baseline.
2. Create a feature branch from the current working branch.
3. Follow the patterns already in the surrounding code.
4. Write or update tests for the behavior you touched.
5. Re-run `bun run validate` before committing.

When modifying existing code: preserve existing patterns, keep tests in step with
behavior changes, check that i18n message keys still resolve, and maintain ARIA
attributes and semantic HTML.

## Git hooks

- **pre-commit** runs `bun run format` and `lint-staged` (ESLint `--fix`, then
  Prettier). It does **not** type-check.
- **commit-msg** enforces conventional commits via commitlint.
- **pre-push** runs the full `bun run validate`.

## Making a pull request

1. Ask the user for review / QA testing.
2. Stage the change with `git add .`.
3. Only once the user approves, run `bun run validate`.
4. If you must use `git commit --no-verify` or `git push --no-verify`, first run
   `rm -rf apps/site/.next && bun install` from the repository root.
5. Commit in conventional-commit format with `git commit -m`.
6. Push with `git push`.
7. Open a pull request using the template in `.github/`. Fill out every field.
   Do not request a review from anyone.
8. Link the pull request to the user.

All CI checks must pass. Changes to i18n require updating the message files for
every locale. Keep the performance impact minimal.

### Sandbox fallbacks

- If a command fails because of sandbox or permission limits, rerun it with
  elevated permissions.
- If `git add` / `git commit` fails with a `.git/index.lock` permission error,
  rerun the same command with elevated permissions.
- If `git push` fails with GitHub host or network resolution errors, rerun the
  push with elevated permissions.

## Creating an issue

Use the feature or bug template in the `.github` folder, depending on what the
user asked for.

## Working with the user

- Ask for clarification on requirements rather than guessing.
- Present multiple implementation approaches where they exist.
- Explain the trade-offs between them.
- Prefer solutions that are easy to maintain.
