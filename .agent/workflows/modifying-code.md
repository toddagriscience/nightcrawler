---
description: When modifying existing code
---

See [`AGENTS.md` → Before you change anything](../../AGENTS.md#before-you-change-anything),
which covers reviewing context first, preserving existing patterns, keeping
tests in step with behavior, checking that i18n keys still resolve, and
maintaining ARIA attributes and semantic HTML.

Message files are per-namespace directories, not single JSON files — see
[`apps/site/CLAUDE.md` → Internationalization](../../apps/site/CLAUDE.md#internationalization).

Run `bun run validate` from the repository root before submitting.
