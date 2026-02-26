## Commit/Push Workflow
- Before any commit or push flow that uses `--no-verify`, automatically run: `cd frontend && rm -rf .next && bun i`.
- If that command fails because of sandbox or permissions, rerun it with elevated permissions.
- If `git add`/`git commit` fails with `.git/index.lock` permission errors in sandbox, rerun the same git command with elevated permissions.
- If `git push` fails in sandbox with GitHub host/network resolution errors, rerun the push with elevated permissions.
