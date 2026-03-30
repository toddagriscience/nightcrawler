# AGENTS.md

## Modifying the frontend

- Prioritize accessibility and performance
- Prioritize server side rendering when possible, but don't neglect code quality in order to render more on the server
- Prioritize simple, understandable, file architecture with lots of small files rather than confusing file architecture with a few large files (see feature sliced design)
- Use `useForm()` as much as possible instead of `useState()`, `useTransition()`, etc.
- ALWAYS add a `layout.tsx` with appropriate, but minimum, metadata to new pages

## Modifying the backend

- Log using `logger.ts`

## Making a change

- Follow feature sliced design as much as possible - components should be kept local unless they may need to be used across the entire application.
- Keep interfaces and types in `types.ts`, generic utility functions in `utils.ts`, server actions in `actions.ts`, components in a components folder (names can be unique), and any unique files in a file with a unique name.
- Avoid helper functions if they aren't used 5 or more times across the file or 10 or more times across the entire repository.
- All files should be in kebab-case, unless otherwise specified.
- Run `bun format` after every change you make
- Document ALL interfaces, functions, classes, and constant variables by utilizing JSDoc standards
- Implement appropriate logging via the `logger` module

## Creating an issue via GitHub's MCP

- If you see "make an issue" or something similar, it's time to make an issue. The following is the workflow:
- Use the feature or bug template found in the `.github` folder, depending on the request of the user

## Making a pull request via GitHub's MCP

- If you see "make a PR" or something similar, it's time to make a PR. The following is the workflow
- Ask for user review/QA testing
- Add files with `git add .`
- If and only if the user approves, run `bun run validate`
- If you must use `git commit --no-verify` or `git push --no-verify`, first run `cd frontend && rm -rf .next && bun i` from the repo root
- Commit the files in conventional commit format with `git commit -m`
- Push the files with `git push`
- Make a pull request. Don't request a review from anyone, but fill out all of the other attributes. Use the pull request template found in the `.github` folder.
- Link the pull request to the user
