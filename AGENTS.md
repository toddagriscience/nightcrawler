## Commit/Push Workflow
- Before any commit or push flow that uses `--no-verify`, automatically run: `cd frontend && rm -rf .next && bun i`.
- If that command fails because of sandbox or permissions, rerun it with elevated permissions.
