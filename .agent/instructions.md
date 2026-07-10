# Agent instructions

Repo-wide conventions are defined once, in [`AGENTS.md`](../AGENTS.md). Read it
first. It is the single source of truth for:

- [Repository layout and commands](../AGENTS.md#commands)
- [Feature-sliced design, naming, imports, copyright headers, JSDoc](../AGENTS.md#making-a-change)
- [Frontend conventions: accessibility, performance, state management](../AGENTS.md#frontend)
- [Database rules](../AGENTS.md#database)
- [Logging](../AGENTS.md#logging)
- [Testing](../AGENTS.md#testing)
- [Git hooks](../AGENTS.md#git-hooks)
- [Commit and pull-request workflow](../AGENTS.md#making-a-pull-request)

Workspace-specific context for the Next.js site — tech stack, directory
structure, component organization, internationalization — lives in
[`apps/site/CLAUDE.md`](../apps/site/CLAUDE.md).

This file deliberately restates none of it. Duplicated rules drift; pointers do
not.

## Workflows

The `workflows/` directory holds task-specific procedures that add something
beyond the documents above:

| Workflow                                                   | Use when                                                   |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| [`creating-issues.md`](workflows/creating-issues.md)       | Opening a GitHub issue                                     |
| [`creating-branches.md`](workflows/creating-branches.md)   | Starting work on an issue                                  |
| [`create-feature.md`](workflows/create-feature.md)         | Before making changes                                      |
| [`modifying-code.md`](workflows/modifying-code.md)         | Changing existing code                                     |
| [`adding-components.md`](workflows/adding-components.md)   | Adding a React component                                   |
| [`modifying-database.md`](workflows/modifying-database.md) | Touching the schema, and how migrations reach staging/prod |
| [`commit-and-push.md`](workflows/commit-and-push.md)       | Committing and pushing                                     |
