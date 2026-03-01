---
description: Commit and Push Reliability Workflow
---

1. Before any commit or push flow that uses `--no-verify`, automatically run:
// turbo
   `cd frontend && rm -rf .next && bun i`
2. If that command fails because of sandbox or permissions, rerun it with elevated permissions.
3. If `git add`/`git commit` fails with `.git/index.lock` permission errors in the sandbox, rerun the same git command with elevated permissions.
4. If `git push` fails in sandbox with GitHub host/network resolution errors, rerun the push with elevated permissions.
