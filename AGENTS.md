# AGENTS.md

## Making a change

- Run `bun format` after every change you make

## Creating an issue via GitHub's MCP

- If you see "make an issue" or something similar, it's time to make an issue. The following is the workflow:
- Use the feature or bug template found in the `.github` folder, depending on the request of the user

## Making a pull request via GitHub's MCP

- If you see "make a PR" or something similar, it's time to make a PR. The following is the workflow
- Ask for user review/QA testing
- Add files with `git add .`
- If an only if the user approves, run `bun run validate` inside of the `./frontend` folder
- Commit the files in conventional commit format with `git commit -m`
- Push the files with `git push`
- Make a pull request. Don't request a review from anyone, but fill out all of the other attributes. Use the pull request template found in the `.github` folder.
- Link the pull request to the user
