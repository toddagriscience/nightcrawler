---
description: Commit and Push Reliability Workflow
---

See [`AGENTS.md` → Making a pull request](../../AGENTS.md#making-a-pull-request)
and [`AGENTS.md` → Sandbox fallbacks](../../AGENTS.md#sandbox-fallbacks).

The rule this workflow used to state — clear the build cache before any
`--no-verify` commit or push — lives there now, with the correct path
(`rm -rf apps/site/.next && bun install` from the repository root).
